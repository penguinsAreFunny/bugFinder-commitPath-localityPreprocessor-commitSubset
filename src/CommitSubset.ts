import {LocalityPreprocessor} from "bugfinder-framework";
import {inject, injectable, optional} from "inversify";
import {CommitPath} from "bugfinder-localityrecorder-commitpath";
import {BUGFINDER_COMMITPATH_LOCALITYPREPROCESSOR_COMMITSUBSET_TYPES} from "./TYPES";
import {Commit, GitFileType} from "bugfinder-localityrecorder-commit";
import {
    BUGFINDER_LOCALITYRECORDER_COMMITPATH_TYPES,
    PathsHandling
} from "../../bugFinder-localityRecorder-commitPath/src";

@injectable()
export class CommitSubset implements LocalityPreprocessor<CommitPath> {
    @optional() @inject(BUGFINDER_COMMITPATH_LOCALITYPREPROCESSOR_COMMITSUBSET_TYPES.pathsHandling)
    pathsHandling: PathsHandling;


    @inject(BUGFINDER_COMMITPATH_LOCALITYPREPROCESSOR_COMMITSUBSET_TYPES.skip)
    skip: number = 0;

    @optional() @inject(BUGFINDER_COMMITPATH_LOCALITYPREPROCESSOR_COMMITSUBSET_TYPES.n)
    n: number;

    /**
     * Returns the CommitPaths of the n Commits after the Skip commit
     * @param localities
     */
    async preprocess(localities: CommitPath[]): Promise<CommitPath[]> {
        const commitPaths = []
        const commits = [];
        const commitMap = new Map<string, Commit>()
        const commitPathMap = new Map<string, CommitPath[]>()

        let i = 0
        for (const loc of localities) {
            this.setCommitPaths(commitPathMap, loc)
            if (commitMap.get(loc.commit.hash) != null) continue

            commitMap.set(loc.commit.hash, loc.commit)
            commits.push(loc.commit)

            if (i == localities.length - 2) {
                console.log(loc.commit.hash)
            }
            i++
        }

        const upperLimit = this.n == null ? commits.length : this.skip + this.n
        console.log("Skip :", this.skip)
        console.log("Upperlimit: ", upperLimit)

        for (let i = this.skip; i < upperLimit; i++) {
            if (i > commits.length)
                throw new Error(`There are not enough commits in localities for used skip: ${this.skip} and n: ${this.n}`)
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
        console.log(`Applying path handling for ${localities.length} localities.`)
        let commits: Commit[] = CommitPath.getCommits(localities);

        // pathsHandling: filter commitPath which do not comply the pathIncludes pattern
        const filterPathIncludes: (CommitPath) => boolean = (commitPath: CommitPath) => {
            if (commitPath.path) return this.pathsHandling.pathIncludes.test(commitPath.path.path);
            return true;
        }

        if (this.pathsHandling && this.pathsHandling.pathIncludes) {
            localities = localities.filter(filterPathIncludes);
            console.log("localities after filtering pathIncludes: ", localities.length)
        }

        // remove paths which are deleted
        const removeDeletedPaths: (CommitPath) => boolean = (commitPath: CommitPath) => {
            if (commitPath.path) return commitPath.path.type !== GitFileType.deleted;
            return true;
        }
        localities = localities.filter(removeDeletedPaths);
        console.log("localities after removing deleted paths: ", localities.length)

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
        }
        localities = localities.filter(removeEmptyPath)
        console.log("Localities after removing CommitPaths not containing a path. " +
            "These were used to reconstruct commits")

        console.log("localities after injecting pathInjections: ", localities.length)
        console.log(`PathHandling got ${localities.length} localities from ${commits.length} commits.`)
        return localities;
    }

}