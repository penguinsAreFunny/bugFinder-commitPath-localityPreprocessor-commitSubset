"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommitSubset = void 0;
var inversify_1 = require("inversify");
var bugfinder_localityrecorder_commitpath_1 = require("bugfinder-localityrecorder-commitpath");
var TYPES_1 = require("./TYPES");
var bugfinder_localityrecorder_commit_1 = require("bugfinder-localityrecorder-commit");
var REMOVED_BECAUSE_GITDELETED = "CommitPath has been removed, because the given path was deleted with commit";
var REMOVED_BECAUSE_PATH_INCLUDE = "CommitPath has been removed, because the give path did not match the path-include-pattern";
var REMOVED_BECAUSE_EMPTY_COMMIT = "CommitPath has been removed, because there were no paths given for that commit";
var REMOVED_BECAUSE_PATH_EXCLUDE = "CommitPath has been removed, because the given path matched the path-exclude-pattern";
var CommitSubset = /** @class */ (function () {
    function CommitSubset() {
        this.skip = 0;
        /**
         * All removed CommitPaths with reason why they have been removed
         * @private
         */
        this.removedCommitPaths = [];
    }
    /**
     * Returns the CommitPaths of the n Commits after the Skip commit
     * @param localities
     */
    CommitSubset.prototype.preprocess = function (localities) {
        return __awaiter(this, void 0, void 0, function () {
            var commitPaths, commits, commitMap, commitPathMap, localities_1, localities_1_1, loc, upperLimit, i, cur;
            var e_1, _a;
            return __generator(this, function (_b) {
                commitPaths = [];
                commits = [];
                commitMap = new Map();
                commitPathMap = new Map();
                try {
                    for (localities_1 = __values(localities), localities_1_1 = localities_1.next(); !localities_1_1.done; localities_1_1 = localities_1.next()) {
                        loc = localities_1_1.value;
                        this.setCommitPaths(commitPathMap, loc);
                        if (commitMap.get(loc.commit.hash) != null)
                            continue;
                        commitMap.set(loc.commit.hash, loc.commit);
                        commits.push(loc.commit);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (localities_1_1 && !localities_1_1.done && (_a = localities_1.return)) _a.call(localities_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                upperLimit = this.n == null ? commits.length : this.skip + this.n;
                this.logger.info("Skip :", this.skip);
                this.logger.info("Upperlimit: ", upperLimit);
                for (i = this.skip; i < upperLimit; i++) {
                    if (i > commits.length) {
                        this.logger.error("There are not enough commits in localities for used skip: " + this.skip + " and n: " + this.n);
                        throw new Error("There are not enough commits in localities for used skip: " + this.skip + " and n: " + this.n);
                    }
                    cur = commits[i];
                    commitPaths.push.apply(commitPaths, __spreadArray([], __read(commitPathMap.get(cur.hash)), false));
                }
                return [2 /*return*/, this.applyPathHandling(commitPaths)];
            });
        });
    };
    CommitSubset.prototype.setCommitPaths = function (commitPathMap, loc) {
        var cps = commitPathMap.get(loc.commit.hash);
        if ((cps === null || cps === void 0 ? void 0 : cps.length) > 0)
            cps.push(loc);
        if (cps == null)
            cps = [loc];
        commitPathMap.set(loc.commit.hash, cps);
    };
    CommitSubset.prototype.applyPathHandling = function (localities) {
        var _this = this;
        this.logger.info("Applying path handling for " + localities.length + " localities.");
        var commits = bugfinder_localityrecorder_commitpath_1.CommitPath.getCommits(localities);
        // pathsHandling: filter commitPath which do not comply the pathIncludes pattern
        var filterPathIncludes = function (commitPath) {
            if (commitPath.path) {
                var pathIncludeMatch = _this.pathsHandling.pathIncludes.test(commitPath.path.path);
                if (!pathIncludeMatch)
                    _this.removedCommitPaths.push({ commitPath: commitPath, reason: REMOVED_BECAUSE_PATH_INCLUDE });
                return pathIncludeMatch;
            }
            return true;
        };
        if (this.pathsHandling && this.pathsHandling.pathIncludes) {
            localities = localities.filter(filterPathIncludes);
            this.logger.info("localities after filtering pathIncludes: ", localities.length);
        }
        // remove paths which are deleted
        var removeDeletedPaths = function (commitPath) {
            if (commitPath.path) {
                var isDeleted = commitPath.path.type === bugfinder_localityrecorder_commit_1.GitFileType.deleted;
                if (isDeleted)
                    _this.removedCommitPaths.push({ commitPath: commitPath, reason: REMOVED_BECAUSE_GITDELETED });
                return !isDeleted;
            }
            return true;
        };
        localities = localities.filter(removeDeletedPaths);
        this.logger.info("localities after removing deleted paths: ", localities.length);
        var localityMap = new Map();
        localities.forEach(function (l) {
            localityMap.set(l.commit.hash, l);
        });
        // remove pathExcludes
        var removePathExcludes = function (commitPath) {
            if (commitPath.path) {
                var pathExcludeMatch = _this.pathsHandling.pathExcludes.test(commitPath.path.path);
                if (pathExcludeMatch)
                    _this.removedCommitPaths.push({ commitPath: commitPath, reason: REMOVED_BECAUSE_PATH_EXCLUDE });
                return !pathExcludeMatch;
            }
            return true;
        };
        localities = localities.filter(removePathExcludes);
        this.logger.info("localities after removing path excludes ", localities.length);
        // inject paths for each unique commit
        commits.forEach(function (commit) {
            var _a, _b, _c;
            var commitPath = localityMap.get(commit.hash);
            if (commitPath == null || (commitPath.path == null && !((_a = _this.pathsHandling) === null || _a === void 0 ? void 0 : _a.injectOnEmptyPaths))) {
                // do not inject on empty paths
                return;
            }
            (_c = (_b = _this.pathsHandling) === null || _b === void 0 ? void 0 : _b.injections) === null || _c === void 0 ? void 0 : _c.forEach(function (injection) {
                var injectedCommitPath = new bugfinder_localityrecorder_commitpath_1.CommitPath();
                injectedCommitPath.commit = commit;
                injectedCommitPath.path = {
                    path: injection,
                    type: bugfinder_localityrecorder_commit_1.GitFileType.other
                };
                localities.push(injectedCommitPath);
                localityMap.set(commit.hash, injectedCommitPath);
            });
        });
        // delete commitPaths without a path
        var removeEmptyPath = function (commitPath) {
            if (commitPath.path != null)
                return true;
            _this.removedCommitPaths.push({ commitPath: commitPath, reason: REMOVED_BECAUSE_EMPTY_COMMIT });
        };
        localities = localities.filter(removeEmptyPath);
        this.logger.info("Localities after removing CommitPaths not containing a path. " +
            "These were used to reconstruct commits");
        this.logger.info("localities after injecting pathInjections: ", localities.length);
        this.logger.info("PathHandling got " + localities.length + " localities from " + commits.length + " commits.");
        this.removedCommitPaths.forEach(function (cp) {
            var _a;
            _this.logger.debug(cp.reason, cp.commitPath.commit.hash, cp.commitPath.path, (_a = cp.commitPath.path) === null || _a === void 0 ? void 0 : _a.type);
        });
        return localities;
    };
    __decorate([
        (0, inversify_1.optional)(),
        (0, inversify_1.inject)(TYPES_1.BUGFINDER_COMMITPATH_LOCALITYPREPROCESSOR_COMMITSUBSET_TYPES.logger),
        __metadata("design:type", Object)
    ], CommitSubset.prototype, "logger", void 0);
    __decorate([
        (0, inversify_1.optional)(),
        (0, inversify_1.inject)(TYPES_1.BUGFINDER_COMMITPATH_LOCALITYPREPROCESSOR_COMMITSUBSET_TYPES.pathsHandling),
        __metadata("design:type", Object)
    ], CommitSubset.prototype, "pathsHandling", void 0);
    __decorate([
        (0, inversify_1.inject)(TYPES_1.BUGFINDER_COMMITPATH_LOCALITYPREPROCESSOR_COMMITSUBSET_TYPES.skip),
        __metadata("design:type", Number)
    ], CommitSubset.prototype, "skip", void 0);
    __decorate([
        (0, inversify_1.optional)(),
        (0, inversify_1.inject)(TYPES_1.BUGFINDER_COMMITPATH_LOCALITYPREPROCESSOR_COMMITSUBSET_TYPES.n),
        __metadata("design:type", Number)
    ], CommitSubset.prototype, "n", void 0);
    CommitSubset = __decorate([
        (0, inversify_1.injectable)()
    ], CommitSubset);
    return CommitSubset;
}());
exports.CommitSubset = CommitSubset;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29tbWl0U3Vic2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0NvbW1pdFN1YnNldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSx1Q0FBdUQ7QUFDdkQsK0ZBQWlFO0FBQ2pFLGlDQUFxRjtBQUNyRix1RkFBc0U7QUFJdEUsSUFBTSwwQkFBMEIsR0FDNUIsNkVBQTZFLENBQUE7QUFDakYsSUFBTSw0QkFBNEIsR0FDOUIsMkZBQTJGLENBQUE7QUFDL0YsSUFBTSw0QkFBNEIsR0FDOUIsZ0ZBQWdGLENBQUE7QUFDcEYsSUFBTSw0QkFBNEIsR0FDOUIsc0ZBQXNGLENBQUE7QUFHMUY7SUFBQTtRQVFJLFNBQUksR0FBVyxDQUFDLENBQUM7UUFLakI7OztXQUdHO1FBQ0ssdUJBQWtCLEdBQXNELEVBQUUsQ0FBQTtJQTBJdEYsQ0FBQztJQXhJRzs7O09BR0c7SUFDRyxpQ0FBVSxHQUFoQixVQUFpQixVQUF3Qjs7Ozs7Z0JBQy9CLFdBQVcsR0FBRyxFQUFFLENBQUE7Z0JBQ2hCLE9BQU8sR0FBRyxFQUFFLENBQUM7Z0JBQ2IsU0FBUyxHQUFHLElBQUksR0FBRyxFQUFrQixDQUFBO2dCQUNyQyxhQUFhLEdBQUcsSUFBSSxHQUFHLEVBQXdCLENBQUE7O29CQUVyRCxLQUFrQixlQUFBLFNBQUEsVUFBVSxDQUFBLG9HQUFFO3dCQUFuQixHQUFHO3dCQUNWLElBQUksQ0FBQyxjQUFjLENBQUMsYUFBYSxFQUFFLEdBQUcsQ0FBQyxDQUFBO3dCQUN2QyxJQUFJLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJOzRCQUFFLFNBQVE7d0JBRXBELFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUs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