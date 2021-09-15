import { LocalityPreprocessor } from "bugfinder-framework";
import { CommitPath } from "bugfinder-localityrecorder-commitpath";
export declare class CommitSubset implements LocalityPreprocessor<CommitPath> {
    skip: number;
    n: number;
    /**
     * Returns the CommitPaths of the n Commits after the Skip commit
     * @param localities
     */
    preprocess(localities: CommitPath[]): Promise<CommitPath[]>;
    private setCommitPaths;
}
