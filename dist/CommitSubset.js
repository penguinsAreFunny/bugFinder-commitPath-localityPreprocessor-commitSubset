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
var REMOVED_BECAUSE_REDUNDANT = "CommitPath has been removed, because it was redundant. This might occur due to path injections.";
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
    CommitSubset.prototype.includeMatch = function (path) {
        var e_2, _a;
        try {
            for (var _b = __values(this.pathsHandling.pathIncludes), _c = _b.next(); !_c.done; _c = _b.next()) {
                var matcher = _c.value;
                var match = matcher.test(path);
                if (match)
                    return true;
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return false;
    };
    CommitSubset.prototype.excludeMatch = function (path) {
        var e_3, _a;
        try {
            for (var _b = __values(this.pathsHandling.pathExcludes), _c = _b.next(); !_c.done; _c = _b.next()) {
                var matcher = _c.value;
                var match = matcher.test(path);
                if (match)
                    return true;
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return false;
    };
    CommitSubset.prototype.applyPathHandling = function (localities) {
        var _this = this;
        this.logger.info("Applying path handling for " + localities.length + " localities.");
        var commits = bugfinder_localityrecorder_commitpath_1.CommitPath.getCommits(localities);
        // pathsHandling: filter commitPath which do not comply the pathIncludes pattern
        var filterPathIncludes = function (commitPath) {
            if (commitPath.path) {
                var pathIncludeMatch = _this.includeMatch(commitPath.path.path);
                if (!pathIncludeMatch)
                    _this.removedCommitPaths.push({ commitPath: commitPath, reason: REMOVED_BECAUSE_PATH_INCLUDE });
                return pathIncludeMatch;
            }
            return true;
        };
        if (this.pathsHandling && this.pathsHandling.pathIncludes.length > 0) {
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
                var pathExcludeMatch = _this.excludeMatch(commitPath.path.path);
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
                // inject paths
                var injectedCommitPath = new bugfinder_localityrecorder_commitpath_1.CommitPath();
                injectedCommitPath.commit = commit;
                injectedCommitPath.path = {
                    path: injection,
                    type: bugfinder_localityrecorder_commit_1.GitFileType.injected
                };
                localities.push(injectedCommitPath);
                localityMap.set(commit.hash, injectedCommitPath);
            });
        });
        this.logger.info("localities after injecting pathInjections: ", localities.length);
        // delete commitPaths without a path
        var removeEmptyPath = function (commitPath) {
            if (commitPath.path != null)
                return true;
            _this.removedCommitPaths.push({ commitPath: commitPath, reason: REMOVED_BECAUSE_EMPTY_COMMIT });
        };
        localities = localities.filter(removeEmptyPath);
        this.logger.info("Localities after removing CommitPaths not containing a path. " +
            "These were used to reconstruct commits", localities.length);
        localities = this.removeRedundantCommitPaths(localities);
        this.logger.info("Localities after removing redundant CommitPaths: ", localities.length);
        this.logger.info("PathHandling got " + localities.length + " localities from " + commits.length + " commits.");
        this.removedCommitPaths.forEach(function (cp) {
            var _a;
            _this.logger.debug(cp.reason, cp.commitPath.commit.hash, cp.commitPath.path, (_a = cp.commitPath.path) === null || _a === void 0 ? void 0 : _a.type);
        });
        return localities;
    };
    CommitSubset.prototype.removeRedundantCommitPaths = function (commitPaths) {
        var e_4, _a;
        var _this = this;
        var nonRedundantCPs = [];
        var map = new Map();
        // adding cp to map. If element already exists it is redundant
        var addToMap = function (map2, cp) {
            var _a;
            var key = cp.commit.hash + ((_a = cp.path) === null || _a === void 0 ? void 0 : _a.path);
            var cps = map2.get(key);
            if (cps == null) {
                map2.set(key, [cp]);
                nonRedundantCPs.push(cp);
            }
            else {
                _this.removedCommitPaths.push({ commitPath: cp, reason: REMOVED_BECAUSE_REDUNDANT });
            }
        };
        try {
            for (var commitPaths_1 = __values(commitPaths), commitPaths_1_1 = commitPaths_1.next(); !commitPaths_1_1.done; commitPaths_1_1 = commitPaths_1.next()) {
                var cp = commitPaths_1_1.value;
                addToMap(map, cp);
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (commitPaths_1_1 && !commitPaths_1_1.done && (_a = commitPaths_1.return)) _a.call(commitPaths_1);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return nonRedundantCPs;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29tbWl0U3Vic2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0NvbW1pdFN1YnNldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSx1Q0FBdUQ7QUFDdkQsK0ZBQWlFO0FBQ2pFLGlDQUFxRjtBQUNyRix1RkFBc0U7QUFJdEUsSUFBTSwwQkFBMEIsR0FDNUIsNkVBQTZFLENBQUE7QUFDakYsSUFBTSw0QkFBNEIsR0FDOUIsMkZBQTJGLENBQUE7QUFDL0YsSUFBTSw0QkFBNEIsR0FDOUIsZ0ZBQWdGLENBQUE7QUFDcEYsSUFBTSw0QkFBNEIsR0FDOUIsc0ZBQXNGLENBQUE7QUFDMUYsSUFBTSx5QkFBeUIsR0FDM0IsaUdBQWlHLENBQUE7QUFHckc7SUFBQTtRQVFJLFNBQUksR0FBVyxDQUFDLENBQUM7UUFLakI7OztXQUdHO1FBQ0ssdUJBQWtCLEdBQXNELEVBQUUsQ0FBQTtJQXNMdEYsQ0FBQztJQXBMRzs7O09BR0c7SUFDRyxpQ0FBVSxHQUFoQixVQUFpQixVQUF3Qjs7Ozs7Z0JBQy9CLFdBQVcsR0FBRyxFQUFFLENBQUE7Z0JBQ2hCLE9BQU8sR0FBRyxFQUFFLENBQUM7Z0JBQ2IsU0FBUyxHQUFHLElBQUksR0FBRyxFQUFrQixDQUFBO2dCQUNyQyxhQUFhLEdBQUcsSUFBSSxHQUFHLEVBQXdCLENBQUE7O29CQUVyRCxLQUFrQixlQUFBLFNBQUEsVUFBVSxDQUFBLG9HQUFFO3dCQUFuQixHQUFHO3dCQUNWLElBQUksQ0FBQyxjQUFjLENBQUMsYUFBYSxFQUFFLEdBQUcsQ0FBQyxDQUFBO3dCQUN2QyxJQUFJLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJOzRCQUFFLFNBQVE7d0JBRXBELFNBQVMsQ0FBQyxHQUFH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