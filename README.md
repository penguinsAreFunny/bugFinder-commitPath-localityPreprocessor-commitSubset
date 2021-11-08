# Description
This package is used as a localityPreprocessor for the recording phase of the [bugfinder-framework](https://github.com/penguinsAreFunny/bugFinder-framework#readme) or 
([npm:bugfinder-framework](https://www.npmjs.com/package/bugfinder-framework)). It returns all CommitPaths of a
subset of Commits given. The first $skip commits will be ignored and the CommitPaths of next $n Commits will be returned.
You can filter files with pathInclude- and pathExclude pattern.
You can inject paths as CommitPaths to each commit.
# Prerequisites
You need to begin with understanding the [bugfinder-framework](https://github.com/penguinsAreFunny/bugFinder-framework#readme)
and installing it:

    npm i bugfinder-framework

# Usage
    npm i -D bugfinder-commitpath-localitypreprocessor-commitsubset
inversify.config.ts
```
import {MongoDBConfig} from "bugfinder-commit-db-mongodb";
import {
    LOCALITY_B_TYPES,
    LocalityPreprocessor, LogConfig, FileAndConsoleLogger, SHARED_TYPES
} from "bugfinder-framework";
import {CommitPath} from "bugfinder-localityrecorder-commitpath";
import {
    BUGFINDER_COMMITPATH_LOCALITYPREPROCESSOR_COMMITSUBSET_TYPES,
    Predecessors
} from "bugfinder-commitpath-localitypreprocessor-commitsubset";
import {localityBContainer} from "bugFinder-framework-defaultContainer";
import {Logger} from "ts-log";
import {PathsHandling} from "bugfinder-commitpath-localitypreprocessor-commitsubset";

const container = localityBContainer;

const pathsOptions: PathsHandling = {
    injections: ["src"],
    injectOnEmptyPaths: false,
    //pathIncludes: /((.*\/)?src\/.*\.c$)|((.*\/)?src\/.*\.h$)|((.*\/)?src\/.*\.cc$)/
    //pathIncludes: /((.*\/)?src\/.*\.go$)|((.*\/)?src\/.*\.c$)|((.*\/)?src\/.*\.h$)/
    pathIncludes: /(.*\/)?src\/.*\.ts$/, // RegEx                                                
    pathExcludes: /(.*\/)?src\/.*\.d\.ts$/
}

const logOptions: LogConfig = {
    debugToConsole: false,
    errorToConsole: false,
    infoToConsole: true,
    traceToConsole: false,
    warnToConsole: false,
    logFile: "./log.txt",

}

const mongoDBConfig: MongoDBConfig = {
    url: "mongodb://localhost:27017",
    dbName: "TEST"
}

// localityPreprocessor and its config
container.bind<LocalityPreprocessor<CommitPath>>(LOCALITY_B_TYPES.localityPreprocessor).to(Predecessors);
container.bind<PathsHandling>(BUGFINDER_COMMITPATH_LOCALITYPREPROCESSOR_COMMITSUBSET_TYPES.pathsHandling).toConstantValue(pathsOptions)
container.bind<number>(BUGFINDER_COMMITPATH_LOCALITYPREPROCESSOR_COMMITSUBSET_TYPES.skip).toConstantValue(10000); // ignoring the first 10k Commits
container.bind<number>(BUGFINDER_COMMITPATH_LOCALITYPREPROCESSOR_COMMITSUBSET_TYPES.n).toConstantValue(20000); // iterating over 20k Commits after skip 

// binding logger 
container.bind<Logger>(BUGFINDER_COMMITPATH_LOCALITYPREPROCESSOR_COMMITSUBSET_TYPES.logger).to(FileAndConsoleLogger)
container.bind<LogConfig>(SHARED_TYPES.logConfig).toConstantValue(logOptions)

// db and its config 
container.bind<DB<CommitPath, any, any>>(LOCALITY_B_TYPES.db).to(CommitPathsMongoDB);
container.bind<MongoDBConfig>(BUGFINDER_DB_COMMITPATH_MONGODB_TYPES.mongoDBConfig).toConstantValue(mongoDBConfig)

export {container}
```
main.ts
```
import "reflect-metadata";
import {container} from "./inversify.config"
import {
    DB, LOCALITY_B_TYPES,
    LocalityPreprocessor,
    LocalityRecorder
} from "bugfinder-framework";
import {CommitPath} from "bugfinder-localityrecorder-commitpath";

async function topLevelAwaitWrapper() {
    const localityPreprocessor = container.get<LocalityPreprocessor<CommitPath>>(LOCALITY_B_TYPES.localityPreprocessor);
    const db = container.get<DB<CommitPath, any, any>>(LOCALITY_B_TYPES.db);
    const commitPaths = await db.readLocalities("CommitPaths")
    const preprocessedLocs = await localityPreprocessor.preprocess(commitPaths)
    await db.writeLocalities(commitPaths, "CommitPaths-skip12146-n10000")
}

topLevelAwaitWrapper();   
```

