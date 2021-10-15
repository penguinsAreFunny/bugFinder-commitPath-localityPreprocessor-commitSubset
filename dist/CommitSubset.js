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
var bugfinder_framework_1 = require("bugfinder-framework");
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
        (0, inversify_1.inject)(bugfinder_framework_1.SHARED_TYPES.logger),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29tbWl0U3Vic2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0NvbW1pdFN1YnNldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwyREFBdUU7QUFDdkUsdUNBQXVEO0FBQ3ZELCtGQUFpRTtBQUNqRSxpQ0FBcUY7QUFDckYsdUZBQXNFO0FBSXRFLElBQU0sMEJBQTBCLEdBQzVCLDZFQUE2RSxDQUFBO0FBQ2pGLElBQU0sNEJBQTRCLEdBQzlCLDJGQUEyRixDQUFBO0FBQy9GLElBQU0sNEJBQTRCLEdBQzlCLGdGQUFnRixDQUFBO0FBQ3BGLElBQU0sNEJBQTRCLEdBQzlCLHNGQUFzRixDQUFBO0FBQzFGLElBQU0seUJBQXlCLEdBQzNCLGlHQUFpRyxDQUFBO0FBR3JHO0lBQUE7UUFRSSxTQUFJLEdBQVcsQ0FBQyxDQUFDO1FBS2pCOzs7V0FHRztRQUNLLHVCQUFrQixHQUFzRCxFQUFFLENBQUE7SUFzTHRGLENBQUM7SUFwTEc7OztPQUdHO0lBQ0csaUNBQVUsR0FBaEIsVUFBaUIsVUFBd0I7Ozs7O2dCQUMvQixXQUFXLEdBQUcsRUFBRSxDQUFBO2dCQUNoQixPQUFPLEdBQUcsRUFBRSxDQUFDO2dCQUNiLFNBQVMsR0FBRyxJQUFJLEdBQUcsRUFBa0IsQ0FBQTtnQkFDckMsYUFBYSxHQUFHLElBQUksR0FBRyxFQUF3QixDQUFBOztvQkFFckQsS0FBa0IsZUFBQSxTQUFBLFVBQVUsQ0FBQSxvR0FBRTt3QkFBbkIsR0FBRzt3QkFDVixJQUFJLENBQUMsY0FBYyxDQUFDLGFBQWEsRUFBRSxHQUFHLENBQUMsQ0FBQTt3QkFDdkMsSUFBSSxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSTs0QkFBRSxTQUFRO3dCQUVwRCxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQTt3QkFDMUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUE7cUJBQzNCOzs7Ozs7Ozs7Z0JBRUssVUFBVSxHQUFHLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUE7Z0JBQ3ZFLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7Z0JBQ3JDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxVQUFVLENBQUMsQ0FBQTtnQkFFNUMsS0FBUyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsVUFBVSxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUN6QyxJQUFJLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFO3dCQUNwQixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQywrREFBNkQsSUFBSSxDQUFDLElBQUksZ0JBQVcsSUFBSSxDQUFDLENBQUcsQ0FBQyxDQUFBO3dCQUM1RyxNQUFNLElBQUksS0FBSyxDQUFDLCtEQUE2RCxJQUFJLENBQUMsSUFBSSxnQkFBVyxJQUFJLENBQUMsQ0FBRyxDQUFDLENBQUE7cUJBQzdHO29CQUNLLEdBQUcsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3ZCLFdBQVcsQ0FBQyxJQUFJLE9BQWhCLFdBQVcsMkJBQVMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQUM7aUJBQ25EO2dCQUVELHNCQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXLENBQUMsRUFBQzs7O0tBQzlDO0lBRU8scUNBQWMsR0FBdEIsVUFBdUIsYUFBd0MsRUFBRSxHQUFlO1FBQzVFLElBQUksR0FBRyxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUM1QyxJQUFJLENBQUEsR0FBRyxhQUFILEdBQUcsdUJBQUgsR0FBRyxDQUFFLE1BQU0sSUFBRyxDQUFDO1lBQ2YsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUNqQixJQUFJLEdBQUcsSUFBSSxJQUFJO1lBQ1gsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUE7UUFDZixhQUFhLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFBO0lBQzNDLENBQUM7SUFFTyxtQ0FBWSxHQUFwQixVQUFxQixJQUFZOzs7WUFDN0IsS0FBc0IsSUFBQSxLQUFBLFNBQUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUEsZ0JBQUEsNEJBQUU7Z0JBQWxELElBQU0sT0FBTyxXQUFBO2dCQUNkLElBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7Z0JBQ2hDLElBQUksS0FBSztvQkFBRSxPQUFPLElBQUksQ0FBQTthQUN6Qjs7Ozs7Ozs7O1FBQ0QsT0FBTyxLQUFLLENBQUE7SUFDaEIsQ0FBQztJQUVPLG1DQUFZLEdBQXBCLFVBQXFCLElBQVk7OztZQUM3QixLQUFzQixJQUFBLEtBQUEsU0FBQSxJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQSxnQkFBQSw0QkFBRTtnQkFBbEQsSUFBTSxPQUFPLFdBQUE7Z0JBQ2QsSUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtnQkFDaEMsSUFBSSxLQUFLO29CQUFFLE9BQU8sSUFBSSxDQUFBO2FBQ3pCOzs7Ozs7Ozs7UUFDRCxPQUFPLEtBQUssQ0FBQTtJQUNoQixDQUFDO0lBRU0sd0NBQWlCLEdBQXhCLFVBQXlCLFVBQXdCO1FBQWpELGlCQStGQztRQTlGRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxnQ0FBOEIsVUFBVSxDQUFDLE1BQU0saUJBQWMsQ0FBQyxDQUFBO1FBQy9FLElBQUksT0FBTyxHQUFhLGtEQUFVLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBRTFELGdGQUFnRjtRQUNoRixJQUFNLGtCQUFrQixHQUE0QixVQUFDLFVBQXNCO1lBQ3ZFLElBQUksVUFBVSxDQUFDLElBQUksRUFBRTtnQkFDakIsSUFBTSxnQkFBZ0IsR0FBRyxLQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7Z0JBQ2hFLElBQUksQ0FBQyxnQkFBZ0I7b0JBQ2pCLEtBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsRUFBQyxVQUFVLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSw0QkFBNEIsRUFBQyxDQUFDLENBQUE7Z0JBRWhHLE9BQU8sZ0JBQWdCLENBQUE7YUFDMUI7WUFDRCxPQUFPLElBQUksQ0FBQztRQUNoQixDQUFDLENBQUE7UUFFRCxJQUFJLElBQUksQ0FBQyxhQUFhLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUNsRSxVQUFVLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1lBQ25ELElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLDJDQUEyQyxFQUFFLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQTtTQUNuRjtRQUVELGlDQUFpQztRQUNqQyxJQUFNLGtCQUFrQixHQUE0QixVQUFDLFVBQXNCO1lBQ3ZFLElBQUksVUFBVSxDQUFDLElBQUksRUFBRTtnQkFDakIsSUFBTSxTQUFTLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssK0NBQVcsQ0FBQyxPQUFPLENBQUM7Z0JBQy9ELElBQUksU0FBUztvQkFDVCxLQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEVBQUMsVUFBVSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsMEJBQTBCLEVBQUMsQ0FBQyxDQUFBO2dCQUU5RixPQUFPLENBQUMsU0FBUyxDQUFDO2FBQ3JCO1lBQ0QsT0FBTyxJQUFJLENBQUM7UUFDaEIsQ0FBQyxDQUFBO1FBQ0QsVUFBVSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUNuRCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQywyQ0FBMkMsRUFBRSxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUE7UUFFaEYsSUFBTSxXQUFXLEdBQUcsSUFBSSxHQUFHLEVBQXNCLENBQUM7UUFDbEQsVUFBVSxDQUFDLE9BQU8sQ0FBQyxVQUFBLENBQUM7WUFDaEIsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN0QyxDQUFDLENBQUMsQ0FBQTtRQUVGLHNCQUFzQjtRQUN0QixJQUFNLGtCQUFrQixHQUE0QixVQUFDLFVBQXNCO1lBQ3ZFLElBQUksVUFBVSxDQUFDLElBQUksRUFBRTtnQkFDakIsSUFBTSxnQkFBZ0IsR0FBRyxLQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7Z0JBQ2hFLElBQUksZ0JBQWdCO29CQUNoQixLQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEVBQUMsVUFBVSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsNEJBQTRCLEVBQUMsQ0FBQyxDQUFBO2dCQUVoRyxPQUFPLENBQUMsZ0JBQWdCLENBQUE7YUFDM0I7WUFDRCxPQUFPLElBQUksQ0FBQztRQUNoQixDQUFDLENBQUE7UUFDRCxVQUFVLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFBO1FBQ2xELElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLDBDQUEwQyxFQUFFLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUUvRSxzQ0FBc0M7UUFDdEMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFBLE1BQU07O1lBQ2xCLElBQU0sVUFBVSxHQUFHLFdBQVcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2hELElBQUksVUFBVSxJQUFJLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsQ0FBQSxNQUFBLEtBQUksQ0FBQyxhQUFhLDBDQUFFLGtCQUFrQixDQUFBLENBQUMsRUFBRTtnQkFDNUYsK0JBQStCO2dCQUMvQixPQUFNO2FBQ1Q7WUFDRCxNQUFBLE1BQUEsS0FBSSxDQUFDLGFBQWEsMENBQUUsVUFBVSwwQ0FBRSxPQUFPLENBQUMsVUFBQSxTQUFTO2dCQUM3QyxlQUFlO2dCQUNmLElBQU0sa0JBQWtCLEdBQUcsSUFBSSxrREFBVSxFQUFFLENBQUM7Z0JBQzVDLGtCQUFrQixDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7Z0JBQ25DLGtCQUFrQixDQUFDLElBQUksR0FBRztvQkFDdEIsSUFBSSxFQUFFLFNBQVM7b0JBQ2YsSUFBSSxFQUFFLCtDQUFXLENBQUMsUUFBUTtpQkFDN0IsQ0FBQztnQkFDRixVQUFVLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7Z0JBQ3BDLFdBQVcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxrQkFBa0IsQ0FBQyxDQUFBO1lBQ3BELENBQUMsQ0FBQyxDQUFBO1FBRU4sQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyw2Q0FBNkMsRUFBRSxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUE7UUFFbEYsb0NBQW9DO1FBQ3BDLElBQU0sZUFBZSxHQUFHLFVBQUMsVUFBc0I7WUFDM0MsSUFBSSxVQUFVLENBQUMsSUFBSSxJQUFJLElBQUk7Z0JBQUUsT0FBTyxJQUFJLENBQUE7WUFDeEMsS0FBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxFQUFDLFVBQVUsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLDRCQUE0QixFQUFDLENBQUMsQ0FBQTtRQUNoRyxDQUFDLENBQUE7UUFDRCxVQUFVLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQTtRQUMvQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQywrREFBK0Q7WUFDNUUsd0NBQXdDLEVBQUUsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBRWhFLFVBQVUsR0FBRyxJQUFJLENBQUMsMEJBQTBCLENBQUMsVUFBVSxDQUFDLENBQUE7UUFDeEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsbURBQW1ELEVBQUUsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBRXhGLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLHNCQUFvQixVQUFVLENBQUMsTUFBTSx5QkFBb0IsT0FBTyxDQUFDLE1BQU0sY0FBVyxDQUFDLENBQUE7UUFFcEcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxVQUFBLEVBQUU7O1lBQzlCLEtBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLE1BQUEsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLDBDQUFFLElBQUksQ0FBQyxDQUFBO1FBQ3pHLENBQUMsQ0FBQyxDQUFBO1FBRUYsT0FBTyxVQUFVLENBQUM7SUFDdEIsQ0FBQztJQUVPLGlEQUEwQixHQUFsQyxVQUFtQyxXQUF5Qjs7UUFBNUQsaUJBc0JDO1FBckJHLElBQU0sZUFBZSxHQUFpQixFQUFFLENBQUE7UUFDeEMsSUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLEVBQXdCLENBQUE7UUFFM0MsOERBQThEO1FBQzlELElBQU0sUUFBUSxHQUFHLFVBQUMsSUFBK0IsRUFBRSxFQUFjOztZQUM3RCxJQUFNLEdBQUcsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksSUFBRyxNQUFBLEVBQUUsQ0FBQyxJQUFJLDBDQUFFLElBQUksQ0FBQSxDQUFBO1lBQzFDLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUE7WUFDdkIsSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFO2dCQUNiLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTtnQkFDbkIsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTthQUMzQjtpQkFBTTtnQkFDSCxLQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEVBQUMsVUFBVSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUseUJBQXlCLEVBQUMsQ0FBQyxDQUFBO2FBQ3BGO1FBQ0wsQ0FBQyxDQUFBOztZQUVELEtBQWlCLElBQUEsZ0JBQUEsU0FBQSxXQUFXLENBQUEsd0NBQUEsaUVBQUU7Z0JBQXpCLElBQU0sRUFBRSx3QkFBQTtnQkFDVCxRQUFRLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFBO2FBQ3BCOzs7Ozs7Ozs7UUFFRCxPQUFPLGVBQWUsQ0FBQTtJQUUxQixDQUFDO0lBbk1EO1FBREMsSUFBQSxvQkFBUSxHQUFFO1FBQUUsSUFBQSxrQkFBTSxFQUFDLGtDQUFZLENBQUMsTUFBTSxDQUFDOztnREFDMUI7SUFHZDtRQURDLElBQUEsb0JBQVEsR0FBRTtRQUFFLElBQUEsa0JBQU0sRUFBQyxvRUFBNEQsQ0FBQyxhQUFhLENBQUM7O3VEQUNsRTtJQUc3QjtRQURDLElBQUEsa0JBQU0sRUFBQyxvRUFBNEQsQ0FBQyxJQUFJLENBQUM7OzhDQUN6RDtJQUdqQjtRQURDLElBQUEsb0JBQVEsR0FBRTtRQUFFLElBQUEsa0JBQU0sRUFBQyxvRUFBNEQsQ0FBQyxDQUFDLENBQUM7OzJDQUN6RTtJQVhELFlBQVk7UUFEeEIsSUFBQSxzQkFBVSxHQUFFO09BQ0EsWUFBWSxDQXVNeEI7SUFBRCxtQkFBQztDQUFBLEFBdk1ELElBdU1DO0FBdk1ZLG9DQUFZIn0=