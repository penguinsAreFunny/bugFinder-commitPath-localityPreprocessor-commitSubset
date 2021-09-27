import {LocalityPreprocessor, SHARED_TYPES} from "bugfinder-framework";
import {inject, injectable, optional} from "inversify";
import {CommitPath, PathsHandling} from "bugfinder-localityrecorder-commitpath";
import {BUGFINDER_COMMITPATH_LOCALITYPREPROCESSOR_COMMITSUBSET_TYPES} from "./TYPES";
import {Commit, GitFileType} from "bugfinder-localityrecorder-commit";
import {Logger} from "ts-log";

const REMOVED_BECAUSE_GITDELETED =
    "CommitPath has been removed, because the given path was deleted with commit"
const REMOVED_BECAUSE_PATH_INCLUDE =
    "CommitPath has been removed, because the give path did not match the path-include-pattern"
const REMOVED_BECAUSE_EMPTY_COMMIT =
    "CommitPath has been removed, because there were no paths given for that commit"


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
            if (i > commits.length){
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

    public applyPathHandling(localities: CommitPath[]): CommitPath[] {
        this.logger.info(`Applying path handling for ${localities.length} localities.`)
        let commits: Commit[] = CommitPath.getCommits(localities);

        // pathsHandling: filter commitPath which do not comply the pathIncludes pattern
        const filterPathIncludes: (CommitPath) => boolean = (commitPath: CommitPath) => {
            if (commitPath.path) {
                const pathIncludeMatch = this.pathsHandling.pathIncludes.test(commitPath.path.path)
                if (!pathIncludeMatch)
                    this.removedCommitPaths.push({commitPath: commitPath, reason: REMOVED_BECAUSE_PATH_INCLUDE})

                return pathIncludeMatch
            }
            return true;
        }

        if (this.pathsHandling && this.pathsHandling.pathIncludes) {
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

        // inject paths for each unique commit
        commits.forEach(commit => {
            const commitPath = localityMap.get(commit.hash);
            if (commitPath == null || (commitPath.path == null && !this.pathsHandling?.injectOnEmptyPaths)) {
                // do not inject on empty paths
                return
            }
            this.pathsHandling?.injections?.forEach(injection => {
                const injectedCommitPath = new CommitPath();
                injectedCommitPath.commit = commit;
                injectedCommitPath.path = {
                    path: injection,
                    type: GitFileType.other
                };
                localities.push(injectedCommitPath);
                localityMap.set(commit.hash, injectedCommitPath)
            })

        });

        // delete commitPaths without a path
        const removeEmptyPath = (commitPath: CommitPath) => {
            if (commitPath.path != null) return true
            this.removedCommitPaths.push({commitPath: commitPath, reason: REMOVED_BECAUSE_EMPTY_COMMIT})
        }
        localities = localities.filter(removeEmptyPath)
        this.logger.info("Localities after removing CommitPaths not containing a path. " +
            "These were used to reconstruct commits")

        this.logger.info("localities after injecting pathInjections: ", localities.length)
        this.logger.info(`PathHandling got ${localities.length} localities from ${commits.length} commits.`)

        this.removedCommitPaths.forEach(cp => {
            this.logger.debug(cp.reason, cp.commitPath.commit.hash, cp.commitPath.path, cp.commitPath.path?.type)
        })

        return localities;
    }

}