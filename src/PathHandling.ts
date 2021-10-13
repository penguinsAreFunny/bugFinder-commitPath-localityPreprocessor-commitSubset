/**
 * PathsHandling is used to determine which paths
 * 1. should be used
 * 2. should be injected
 */
export interface PathsHandling {
    /**
     * Filters all CommitPath-Paths which should be used.
     * The matched files will be quantified
     * F.e.: \/*.ts\b for just adding paths ending with .ts.
     */
    pathIncludes?: RegExp[]

    /**
     * Remove all CommitPaths which should not be used.
     */
    pathExcludes?: RegExp[]

    /**
     * Paths which should be injected and therefore quantified.
     * F.e. ["src"] if relative values to whole src should be evaluated
     */
    injections: string[]

    /**
     * Determines whether paths should be injected
     * if the only paths remaining would be the injected ones
     */
    injectOnEmptyPaths: boolean
}
