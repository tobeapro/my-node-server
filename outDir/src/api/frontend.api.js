"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
var _this = this;
exports.__esModule = true;
var Router = require("koa-router");
var schema_1 = require("../schema");
var router = new Router();
function returnErr(err) {
    return { result: 0, data: err };
}
router.post('/front_manage/api/getArticles', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
    var tagReg, data, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                tagReg = ctx.request.body.classify ? new RegExp(ctx.request.body.classify) : '';
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4, schema_1["default"].article.find({
                        user_name: ctx.request.body.name || 'admin',
                        classify: { $regex: tagReg }
                    }).sort({ create_time: -1 })
                        .select('title create_time update_time classify face_img')];
            case 2:
                data = _a.sent();
                ctx.body = { result: 1, data: data };
                return [3, 4];
            case 3:
                err_1 = _a.sent();
                ctx.body = returnErr(err_1);
                return [3, 4];
            case 4: return [2];
        }
    });
}); });
router.post('/front_manage/api/latestArticles', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
    var num, tagReg, data, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                num = typeof (ctx.request.body.num) === 'number' ? ctx.request.body.num : 5;
                tagReg = ctx.request.body.classify ? new RegExp(ctx.request.body.classify) : '';
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4, schema_1["default"].article.find({
                        user_name: ctx.request.body.name || 'admin',
                        classify: { $regex: tagReg }
                    })
                        .sort({ create_time: -1 })
                        .select('title')
                        .limit(num)];
            case 2:
                data = _a.sent();
                ctx.body = { result: 1, data: data };
                return [3, 4];
            case 3:
                err_2 = _a.sent();
                ctx.body = returnErr(err_2);
                return [3, 4];
            case 4: return [2];
        }
    });
}); });
router.post('/front_manage/api/articleCount', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
    var data, total, groupObj_1, groups_1, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4, schema_1["default"].article.find().select('classify')];
            case 1:
                data = _a.sent();
                total = data.length;
                groupObj_1 = {};
                data.forEach(function (item) {
                    var classify = item.classify;
                    var classifyAry = classify.split(',');
                    classifyAry.forEach(function (key) {
                        if (groupObj_1[key]) {
                            groupObj_1[key]++;
                        }
                        else {
                            groupObj_1[key] = 1;
                        }
                    });
                });
                groups_1 = [];
                Object.keys(groupObj_1).forEach(function (key) {
                    groups_1.push({
                        item: key,
                        count: groupObj_1[key]
                    });
                });
                ctx.body = {
                    result: 1,
                    data: {
                        total: total,
                        groups: groups_1
                    }
                };
                return [3, 3];
            case 2:
                err_3 = _a.sent();
                ctx.body = returnErr(err_3);
                return [3, 3];
            case 3: return [2];
        }
    });
}); });
router.post('/front_manage/api/airticleDetail', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
    var objIdReg, data, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                objIdReg = /^[a-z0-9]{24}$/;
                if (!objIdReg.test(ctx.request.body.id)) {
                    return [2, ctx.body = { result: 2, msg: '文章不存在' }];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4, schema_1["default"].article.findById(ctx.request.body.id)];
            case 2:
                data = _a.sent();
                ctx.body = data ? { result: 1, data: data } : { result: 2, msg: '文章不存在' };
                return [3, 4];
            case 3:
                err_4 = _a.sent();
                ctx.body = returnErr(err_4);
                return [3, 4];
            case 4: return [2];
        }
    });
}); });
router.post('/front_manage/api/getInfo', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
    var data, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4, schema_1["default"].user.findOne({ name: ctx.request.body.name || 'admin' }, { password: 0 })];
            case 1:
                data = _a.sent();
                ctx.body = data ? { result: 1, data: data } : { result: 2, msg: '该用户不存在' };
                return [3, 3];
            case 2:
                err_5 = _a.sent();
                ctx.body = returnErr(err_5);
                return [3, 3];
            case 3: return [2];
        }
    });
}); });
router.get('/front_manage/api/getNews', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
    var data, err_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4, schema_1["default"].news.find()];
            case 1:
                data = _a.sent();
                ctx.body = { result: 1, data: data };
                return [3, 3];
            case 2:
                err_6 = _a.sent();
                ctx.body = returnErr(err_6);
                return [3, 3];
            case 3: return [2];
        }
    });
}); });
exports["default"] = router;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJvbnRlbmQuYXBpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwaS9mcm9udGVuZC5hcGkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsaUJBOEdxQjs7QUE5R3JCLG1DQUFxQztBQUNyQyxvQ0FBK0I7QUFFL0IsSUFBTSxNQUFNLEdBQUcsSUFBSSxNQUFNLEVBQUUsQ0FBQztBQUM1QixTQUFTLFNBQVMsQ0FBQyxHQUFPO0lBQ3pCLE9BQU8sRUFBRSxNQUFNLEVBQUMsQ0FBQyxFQUFFLElBQUksRUFBQyxHQUFHLEVBQUUsQ0FBQTtBQUM5QixDQUFDO0FBRUQsTUFBTSxDQUFDLElBQUksQ0FBQywrQkFBK0IsRUFBQyxVQUFPLEdBQUcsRUFBRSxJQUFJOzs7OztnQkFDckQsTUFBTSxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQSxDQUFDLENBQUEsSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUEsQ0FBQyxDQUFBLEVBQUUsQ0FBQTs7OztnQkFFbkUsV0FBTSxtQkFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7d0JBQ3RDLFNBQVMsRUFBQyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUUsT0FBTzt3QkFDeEMsUUFBUSxFQUFDLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRTtxQkFDM0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLFdBQVcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDO3lCQUMzQixNQUFNLENBQUMsaURBQWlELENBQUMsRUFBQTs7Z0JBSnBELElBQUksR0FBRyxTQUk2QztnQkFDMUQsR0FBRyxDQUFDLElBQUksR0FBRyxFQUFFLE1BQU0sRUFBQyxDQUFDLEVBQUUsSUFBSSxNQUFBLEVBQUUsQ0FBQTs7OztnQkFFN0Is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