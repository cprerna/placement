"use strict";
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var drizzle_1 = require("./db/drizzle");
var schema_1 = require("./db/schema");
var data_json_1 = require("./data/data.json");
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var studentsToInsert, batchSize, batches, i, i, result, batchError_1, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, , 8]);
                    studentsToInsert = data_json_1.default.map(function (student) {
                        var id = student.id, studentWithoutId = __rest(student, ["id"]);
                        return studentWithoutId;
                    });
                    console.log("Preparing to insert ".concat(studentsToInsert.length, " students..."));
                    batchSize = 100;
                    batches = [];
                    for (i = 0; i < studentsToInsert.length; i += batchSize) {
                        batches.push(studentsToInsert.slice(i, i + batchSize));
                    }
                    console.log("Splitting into ".concat(batches.length, " batches of ").concat(batchSize, " records each..."));
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < batches.length)) return [3 /*break*/, 6];
                    console.log("Inserting batch ".concat(i + 1, "/").concat(batches.length, "..."));
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, drizzle_1.db.insert(schema_1.studentsTable).values(batches[i])];
                case 3:
                    result = _a.sent();
                    console.log("Batch ".concat(i + 1, " inserted successfully!"));
                    return [3 /*break*/, 5];
                case 4:
                    batchError_1 = _a.sent();
                    console.error("Error inserting batch ".concat(i + 1, ":"), batchError_1);
                    // Log the first record of the failed batch for debugging
                    console.log('First record in failed batch:', JSON.stringify(batches[i][0], null, 2));
                    return [3 /*break*/, 6];
                case 5:
                    i++;
                    return [3 /*break*/, 1];
                case 6:
                    console.log('All students inserted successfully!');
                    return [3 /*break*/, 8];
                case 7:
                    error_1 = _a.sent();
                    console.error('Error inserting students:', error_1);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
main();
