import { LocalityPreprocessor } from "bugfinder-framework";
import { CommitPath } from "bugfinder-localityrecorder-commitpath";
import { PathsHandling } from "../../bugFinder-localityRecorder-commitPath/src";
export declare class CommitSubset implements LocalityPreprocessor<CommitPath> {
    pathsHandling: PathsHandling;
    skip: number;
    n: number;
    /**
     * Returns the CommitPaths of the n Commits after the Skip commit
     * @param localities
     */
    preprocess(localities: CommitPath[]): Promise<CommitPath[]>;
    private setCommitPaths;
    applyPathHandling(localities: CommitPath[]): CommitPath[];
}
