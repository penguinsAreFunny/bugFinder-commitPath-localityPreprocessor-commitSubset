import {LocalityPreprocessor} from "bugfinder-framework";
import {inject, injectable, optional} from "inversify";
import {CommitPath} from "bugfinder-localityrecorder-commitpath";
import {BUGFINDER_COMMITPATH_LOCALITYPREPROCESSOR_COMMITSUBSET_TYPES} from "./TYPES";
import {Commit} from "bugfinder-localityrecorder-commit";

@injectable()
export class CommitSubset implements LocalityPreprocessor<CommitPath> {

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

        for (const loc of localities) {
            this.setCommitPaths(commitPathMap, loc)
            if (commitMap.get(loc.commit.hash) != null) continue

            commitMap.set(loc.commit.hash, loc.commit)
            commits.push(loc.commit)
        }

        const upperLimit = this.n == null ? commits.length : this.skip + this.n
        for (let i = this.skip; i < upperLimit; i++) {
            if (i > commits.length)
                throw new Error(`There are not enough commits in localities for used skip: ${this.skip} and n: ${this.n}`)
            const cur = commits[i];
            commitPaths.push(...commitPathMap.get(cur.hash))
        }

        return commitPaths;
    }

    private setCommitPaths(commitPathMap: Map<string, CommitPath[]>, loc: CommitPath) {
        let cps = commitPathMap.get(loc.commit.hash)
        if (cps?.length > 0)
            cps.push(loc)
        if (cps == null)
            cps = [loc]
        commitPathMap.set(loc.commit.hash, cps)
    }

}