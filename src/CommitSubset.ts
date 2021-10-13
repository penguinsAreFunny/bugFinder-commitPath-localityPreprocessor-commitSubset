import {LocalityPreprocessor} from "bugfinder-framework";
import {inject, injectable, optional} from "inversify";
import {CommitPath} from "bugfinder-localityrecorder-commitpath";
import {BUGFINDER_COMMITPATH_LOCALITYPREPROCESSOR_COMMITSUBSET_TYPES} from "./TYPES";
import {Commit, GitFileType} from "bugfinder-localityrecorder-commit";
import {Logger} from "ts-log";
import {PathsHandling} from "./PathHandling";

const REMOVED_BECAUSE_GITDELETED =
    "CommitPath has been removed, because the given path was deleted with commit"
const REMOVED_BECAUSE_PATH_INCLUDE =
    "CommitPath has been removed, because the give path did not match the path-include-pattern"
const REMOVED_BECAUSE_EMPTY_COMMIT =
    "CommitPath has been removed, because there were no paths given for that commit"
const REMOVED_BECAUSE_PATH_EXCLUDE =
    "CommitPath has been removed, because the given path matched the path-exclude-pattern"
const REMOVED_BECAUSE_REDUNDANT =
    "CommitPath has been removed, because it was redundant. This might occur due to path injections."

@injectable()
export class CommitSubset implements LocalityPreprocessor<CommitPath> {
    @optional() @inject(BUGFINDER_COMMITPATH_LOCALITYPREPROCESSOR_COMMITSUBSET_TYPES.logger)
    logger: Logger

    @optional() @inject(BUGFINDER_COMMITPATH_LOCALITYPREPROCESSOR_COMMITSUBSET_TYPES.pathsHandling)
    pathsHandling: PathsHandling;

    @inject(BUGFINDER_COMMITPATH_LOCALITYPREPROCESSOR_COMMITSUBSET_TYPES.skip)
    skip: number = 0;

    @optional() @inject(BUGFINDER_COMMITPATH_LOCALITYPREPROCESSOR_COMMITSUBSET_TYPES.n)
    n: number;

    /**
     * All removed CommitPaths with reason why they have been removed
     * @private
     */
    private removedCommitPaths: Array<{ commitPath: CommitPath, reason: string }> = []

    /**
     * Returns the CommitPaths of the n Commits after the Skip commit
     * @param localities
     */
    async preprocess(localities: CommitPath[]): Promise<CommitPath[]> {
        const commitPaths = []
        const commits = [];
        const commitMap = new Map<string, Commit>()
        const commitPathMap = new Map<string, CommitPath[]>()

        for (const loc of localities) {
            this.setCommitPaths(commitPathMap, loc)
            if (commitMap.get(loc.commit.hash) != null) continue

            commitMap.set(loc.commit.hash, loc.commit)
            commits.push(loc.commit)
        }

        const upperLimit = this.n == null ? commits.length : this.skip + this.n
        this.logger.info("Skip :", this.skip)
        this.logger.info("Upperlimit: ", upperLimit)

        for (let i = this.skip; i < upperLimit; i++) {
            if (i > commits.length) {
                this.logger.error(`There are not enough commits in localities for used skip: ${this.skip} and n: ${this.n}`)
                throw new Error(`There are not enough commits in localities for used skip: ${this.skip} and n: ${this.n}`)
            }
            const cur = commits[i];
            commitPaths.push(...commitPathMap.get(cur.hash))
        }

        return this.applyPathHandling(commitPaths);
    }

    private setCommitPaths(commitPathMap: Map<string, CommitPath[]>, loc: CommitPath) {
        let cps = commitPathMap.get(loc.commit.hash)
        if (cps?.length > 0)
            cps.push(loc)
        if (cps == null)
            cps = [loc]
        commitPathMap.set(loc.commit.hash, cps)
    }

    private includeMatch(path: string): boolean {
        for (const matcher of this.pathsHandling.pathIncludes) {
            const match = matcher.test(path)
            if (match) return true
        }
        return false
    }

    private excludeMatch(path: string): boolean {
        for (const matcher of this.pathsHandling.pathExcludes) {
            const match = matcher.test(path)
            if (match) return true
        }
        return false
    }

    public applyPathHandling(localities: CommitPath[]): CommitPath[] {
        this.logger.info(`Applying path handling for ${localities.length} localities.`)
        let commits: Commit[] = CommitPath.getCommits(localities);

        // pathsHandling: filter commitPath which do not comply the pathIncludes pattern
        const filterPathIncludes: (CommitPath) => boolean = (commitPath: CommitPath) => {
            if (commitPath.path) {
                const pathIncludeMatch = this.includeMatch(commitPath.path.path)
                if (!pathIncludeMatch)
                    this.removedCommitPaths.push({commitPath: commitPath, reason: REMOVED_BECAUSE_PATH_INCLUDE})

                return pathIncludeMatch
            }
            return true;
        }

        if (this.pathsHandling && this.pathsHandling.pathIncludes.length > 0) {
            localities = localities.filter(filterPathIncludes);
            this.logger.info("localities after filtering pathIncludes: ", localities.length)
        }

        // remove paths which are deleted
        const removeDeletedPaths: (CommitPath) => boolean = (commitPath: CommitPath) => {
            if (commitPath.path) {
                const isDeleted = commitPath.path.type === GitFileType.deleted;
                if (isDeleted)
                    this.removedCommitPaths.push({commitPath: commitPath, reason: REMOVED_BECAUSE_GITDELETED})

                return !isDeleted;
            }
            return true;
        }
        localities = localities.filter(removeDeletedPaths);
        this.logger.info("localities after removing deleted paths: ", localities.length)

        const localityMap = new Map<string, CommitPath>();
        localities.forEach(l => {
            localityMap.set(l.commit.hash, l);
        })

        // remove pathExcludes
        const removePathExcludes: (CommitPath) => boolean = (commitPath: CommitPath) => {
            if (commitPath.path) {
                const pathExcludeMatch = this.excludeMatch(commitPath.path.path)
                if (pathExcludeMatch)
                    this.removedCommitPaths.push({commitPath: commitPath, reason: REMOVED_BECAUSE_PATH_EXCLUDE})

                return !pathExcludeMatch
            }
            return true;
        }
        localities = localities.filter(removePathExcludes)
        this.logger.info("localities after removing path excludes ", localities.length)

        // inject paths for each unique commit
        commits.forEach(commit => {
            const commitPath = localityMap.get(commit.hash);
            if (commitPath == null || (commitPath.path == null && !this.pathsHandling?.injectOnEmptyPaths)) {
                // do not inject on empty paths
                return
            }
            this.pathsHandling?.injections?.forEach(injection => {
                // inject paths
                const injectedCommitPath = new CommitPath();
                injectedCommitPath.commit = commit;
                injectedCommitPath.path = {
                    path: injection,
                    type: GitFileType.injected
                };
                localities.push(injectedCommitPath);
                localityMap.set(commit.hash, injectedCommitPath)
            })

        });
        this.logger.info("localities after injecting pathInjections: ", localities.length)

        // delete commitPaths without a path
        const removeEmptyPath = (commitPath: CommitPath) => {
            if (commitPath.path != null) return true
            this.removedCommitPaths.push({commitPath: commitPath, reason: REMOVED_BECAUSE_EMPTY_COMMIT})
        }
        localities = localities.filter(removeEmptyPath)
        this.logger.info("Localities after removing CommitPaths not containing a path. " +
            "These were used to reconstruct commits", localities.length)

        localities = this.removeRedundantCommitPaths(localities)
        this.logger.info("Localities after removing redundant CommitPaths: ", localities.length)

        this.logger.info(`PathHandling got ${localities.length} localities from ${commits.length} commits.`)

        this.removedCommitPaths.forEach(cp => {
            this.logger.debug(cp.reason, cp.commitPath.commit.hash, cp.commitPath.path, cp.commitPath.path?.type)
        })

        return localities;
    }

    private removeRedundantCommitPaths(commitPaths: CommitPath[]): CommitPath[] {
        const nonRedundantCPs: CommitPath[] = []
        const map = new Map<string, CommitPath[]>()

        // adding cp to map. If element already exists it is redundant
        const addToMap = (map2: Map<string, CommitPath[]>, cp: CommitPath) => {
            const key = cp.commit.hash + cp.path?.path
            let cps = map2.get(key)
            if (cps == null) {
                map2.set(key, [cp])
                nonRedundantCPs.push(cp)
            } else {
                this.removedCommitPaths.push({commitPath: cp, reason: REMOVED_BECAUSE_REDUNDANT})
            }
        }

        for (const cp of commitPaths) {
            addToMap(map, cp)
        }

        return nonRedundantCPs

    }

}