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
var TYPES_1 = require("./TYPES");
var CommitSubset = /** @class */ (function () {
    function CommitSubset() {
        this.skip = 0;
    }
    /**
     * Returns the CommitPaths of the n Commits after the Skip commit
     * @param localities
     */
    CommitSubset.prototype.preprocess = function (localities) {
        return __awaiter(this, void 0, void 0, function () {
            var commitPaths, commits, commitMap, commitPathMap, localities_1, localities_1_1, loc, i, cur;
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
                for (i = this.skip; i < this.skip + this.n; i++) {
                    if (i > commits.length)
                        throw new Error("There are not enough commits in localities for used skip: " + this.skip + " and n: " + this.n);
                    cur = commits[i];
                    commitPaths.push.apply(commitPaths, __spreadArray([], __read(commitPathMap.get(cur.hash)), false));
                }
                return [2 /*return*/, commitPaths];
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
    __decorate([
        (0, inversify_1.inject)(TYPES_1.BUGFINDER_COMMITPATH_LOCALITYPREPROCESSOR_COMMITSUBSET_TYPES.skip),
        __metadata("design:type", Number)
    ], CommitSubset.prototype, "skip", void 0);
    __decorate([
        (0, inversify_1.inject)(TYPES_1.BUGFINDER_COMMITPATH_LOCALITYPREPROCESSOR_COMMITSUBSET_TYPES.n),
        __metadata("design:type", Number)
    ], CommitSubset.prototype, "n", void 0);
    CommitSubset = __decorate([
        (0, inversify_1.injectable)()
    ], CommitSubset);
    return CommitSubset;
}());
exports.CommitSubset = CommitSubset;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29tbWl0U3Vic2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0NvbW1pdFN1YnNldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSx1Q0FBNkM7QUFFN0MsaUNBQXFGO0FBSXJGO0lBQUE7UUFHSSxTQUFJLEdBQVcsQ0FBQyxDQUFDO0lBMENyQixDQUFDO0lBckNHOzs7T0FHRztJQUNHLGlDQUFVLEdBQWhCLFVBQWlCLFVBQXdCOzs7OztnQkFDL0IsV0FBVyxHQUFHLEVBQUUsQ0FBQTtnQkFDaEIsT0FBTyxHQUFHLEVBQUUsQ0FBQztnQkFDYixTQUFTLEdBQUcsSUFBSSxHQUFHLEVBQWtCLENBQUE7Z0JBQ3JDLGFBQWEsR0FBRyxJQUFJLEdBQUcsRUFBd0IsQ0FBQTs7b0JBRXJELEtBQWtCLGVBQUEsU0FBQSxVQUFVLENBQUEsb0dBQUU7d0JBQW5CLEdBQUc7d0JBQ1YsSUFBSSxDQUFDLGNBQWMsQ0FBQyxhQUFhLEVBQUUsR0FBRyxDQUFDLENBQUE7d0JBQ3ZDLElBQUksU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUk7NEJBQUUsU0FBUTt3QkFFcEQsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUE7d0JBQzFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFBO3FCQUMzQjs7Ozs7Ozs7O2dCQUVELEtBQVMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDakQsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU07d0JBQ2xCLE1BQU0sSUFBSSxLQUFLLENBQUMsK0RBQTZELElBQUksQ0FBQyxJQUFJLGdCQUFXLElBQUksQ0FBQyxDQUFHLENBQUMsQ0FBQTtvQkFDeEcsR0FBRyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDdkIsV0FBVyxDQUFDLElBQUksT0FBaEIsV0FBVywyQkFBUyxhQUFhLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBQztpQkFDbkQ7Z0JBRUQsc0JBQU8sV0FBVyxFQUFDOzs7S0FDdEI7SUFFTyxxQ0FBYyxHQUF0QixVQUF1QixhQUF3QyxFQUFFLEdBQWU7UUFDNUUsSUFBSSxHQUFHLEdBQUcsYUFBYSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQzVDLElBQUksQ0FBQSxHQUFHLGFBQUgsR0FBRyx1QkFBSCxHQUFHLENBQUUsTUFBTSxJQUFHLENBQUM7WUFDZixHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ2pCLElBQUksR0FBRyxJQUFJLElBQUk7WUFDWCxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUNmLGFBQWEsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUE7SUFDM0MsQ0FBQztJQXhDRDtRQURDLElBQUEsa0JBQU0sRUFBQyxvRUFBNEQsQ0FBQyxJQUFJLENBQUM7OzhDQUN6RDtJQUdqQjtRQURDLElBQUEsa0JBQU0sRUFBQyxvRUFBNEQsQ0FBQyxDQUFDLENBQUM7OzJDQUM3RDtJQU5ELFlBQVk7UUFEeEIsSUFBQSxzQkFBVSxHQUFFO09BQ0EsWUFBWSxDQTZDeEI7SUFBRCxtQkFBQztDQUFBLEFBN0NELElBNkNDO0FBN0NZLG9DQUFZIn0=