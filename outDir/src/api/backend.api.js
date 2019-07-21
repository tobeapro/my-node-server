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
var svgCaptcha = require("svg-captcha");
var path = require("path");
var fs = require("fs");
var router = new Router();
function returnErr(err) {
    return { result: 0, data: err };
}
router.get('/back_manage/api/captcha', function (ctx, next) {
    var captcha = svgCaptcha.create({
        noise: 2,
        ignoreChars: '0o1i',
        width: 120,
        height: 36,
        fontSize: 40
    });
    captcha.result = 1;
    ctx.body = captcha;
});
router.post('/back_manage/api/login', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
    var data, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4, schema_1["default"].user.findOne({
                        name: ctx.request.body.name,
                        password: ctx.request.body.password
                    })];
            case 1:
                data = _a.sent();
                if (data) {
                    if (ctx.session.name === ctx.request.body.name) {
                        ctx.body = { result: 1, msg: '欢迎回来' };
                    }
                    else {
                        ctx.session.name = ctx.request.body.name;
                        ctx.body = { result: 1, msg: '登录成功' };
                    }
                }
                else {
                    ctx.body = { result: 2, msg: '账号或密码错误' };
                }
                return [3, 3];
            case 2:
                err_1 = _a.sent();
                ctx.body = returnErr(err_1);
                return [3, 3];
            case 3: return [2];
        }
    });
}); });
router.get('/back_manage/api/logout', function (ctx, next) {
    delete ctx.session.name;
    ctx.body = { result: 1 };
});
router.post('/back_manage/api/register', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
    var data, newUser, res, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                return [4, schema_1["default"].user.find({ name: ctx.request.body.name })];
            case 1:
                data = _a.sent();
                if (!data.length) return [3, 2];
                ctx.body = { result: 2, msg: '账号已存在' };
                return [3, 4];
            case 2:
                newUser = {
                    name: ctx.request.body.name,
                    password: ctx.request.body.password
                };
                return [4, (new schema_1["default"].user(newUser)).save()];
            case 3:
                res = _a.sent();
                if (res) {
                    ctx.body = { result: 1, msg: '注册成功,请登录' };
                }
                _a.label = 4;
            case 4: return [3, 6];
            case 5:
                err_2 = _a.sent();
                ctx.body = returnErr(err_2);
                return [3, 6];
            case 6: return [2];
        }
    });
}); });
router.get('/back_manage/api/getInfo', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
    var data, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4, schema_1["default"].user.findOne({ name: ctx.session.name }, { password: 0 })];
            case 1:
                data = _a.sent();
                if (data) {
                    ctx.body = { result: 1, data: data };
                }
                else {
                    ctx.body = { result: 2, msg: '用户不存在' };
                }
                return [3, 3];
            case 2:
                err_3 = _a.sent();
                ctx.body = returnErr(err_3);
                return [3, 3];
            case 3: return [2];
        }
    });
}); });
router.post('/back_manage/api/upload_avatar', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
    var files, user, data, err2_1, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!fs.existsSync(path.resolve(__dirname, '../../public/resource'))) {
                    fs.mkdirSync(path.resolve(__dirname, '../../public/resource'));
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 11, , 12]);
                if (!ctx.request.files) return [3, 9];
                files = ctx.request.files;
                return [4, schema_1["default"].user.findOne({ name: ctx.session.name })];
            case 2:
                user = _a.sent();
                if (!user) return [3, 7];
                _a.label = 3;
            case 3:
                _a.trys.push([3, 5, , 6]);
                return [4, schema_1["default"].user.updateOne({ name: ctx.session.name }, { avatar: '/public/resource/' + path.basename(files.file.path) })];
            case 4:
                data = _a.sent();
                if (data) {
                    ctx.body = { result: 1, msg: '上传成功', url: '/public/resource/' + path.basename(files.file.path) };
                }
                return [3, 6];
            case 5:
                err2_1 = _a.sent();
                ctx.body = { result: 2, data: err2_1, msg: '更新失败' };
                return [3, 6];
            case 6: return [3, 8];
            case 7:
                ctx.body = { result: 2, msg: '未找到该用户' };
                _a.label = 8;
            case 8: return [3, 10];
            case 9:
                ctx.body = { result: 2, msg: '上传失败' };
                _a.label = 10;
            case 10: return [3, 12];
            case 11:
                err_4 = _a.sent();
                ctx.body = returnErr(err_4);
                return [3, 12];
            case 12: return [2];
        }
    });
}); });
router.post('/back_manage/api/pwdUpdate', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
    var data, res, err2_2, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 8, , 9]);
                return [4, schema_1["default"].user.findOne({ name: ctx.session.name })];
            case 1:
                data = _a.sent();
                if (!data) return [3, 7];
                if (!(data.password === ctx.request.body.oldPwd)) return [3, 6];
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4, schema_1["default"].user.updateOne({ _id: ctx.request.body.id }, { password: ctx.request.body.newPwd })];
            case 3:
                res = _a.sent();
                ctx.body = { result: 1 };
                return [3, 5];
            case 4:
                err2_2 = _a.sent();
                ctx.body = { result: 2, msg: '更新失败' };
                return [3, 5];
            case 5: return [3, 7];
            case 6:
                ctx.body = { result: 2, msg: '原密码输入有误' };
                _a.label = 7;
            case 7: return [3, 9];
            case 8:
                err_5 = _a.sent();
                ctx.body = returnErr(err_5);
                return [3, 9];
            case 9: return [2];
        }
    });
}); });
router.post('/back_manage/api/articles', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
    var queryTitle, queryClasify, data, err_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                queryTitle = new RegExp(ctx.request.body.title);
                queryClasify = new RegExp(ctx.request.body.classify);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4, schema_1["default"].article.find({
                        user_name: ctx.session.name,
                        title: { $regex: queryTitle },
                        classify: { $regex: queryClasify }
                    })];
            case 2:
                data = _a.sent();
                ctx.body = { result: 1, data: data || [] };
                return [3, 4];
            case 3:
                err_6 = _a.sent();
                ctx.body = returnErr(err_6);
                return [3, 4];
            case 4: return [2];
        }
    });
}); });
router.post('/back_manage/api/upload_img', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
    var files;
    return __generator(this, function (_a) {
        if (!fs.existsSync(path.resolve(__dirname, '../../public/resource'))) {
            fs.mkdirSync(path.resolve(__dirname, '../../public/resource'));
        }
        try {
            if (ctx.request.files) {
                files = ctx.request.files;
                ctx.body = { result: 1, msg: '上传成功', url: '/public/resource/' + path.basename(files.file.path) };
            }
            else {
                ctx.body = { result: 2, msg: '上传失败' };
            }
        }
        catch (err) {
            ctx.body = returnErr(err);
        }
        return [2];
    });
}); });
router.post('/back_manage/api/article/new', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
    var currentTime, articleLive, newArticle, data, err_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                currentTime = new Date().getTime();
                articleLive = {
                    user_name: ctx.session.name,
                    title: ctx.request.body.title,
                    face_img: ctx.request.body.face_img,
                    classify: ctx.request.body.classify,
                    content: ctx.request.body.content,
                    create_time: currentTime,
                    update_time: currentTime
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                newArticle = new schema_1["default"].article(articleLive);
                return [4, newArticle.save()];
            case 2:
                data = _a.sent();
                if (data) {
                    ctx.body = { result: 1, msg: '保存成功', data: newArticle };
                }
                else {
                    ctx.body = { result: 2, msg: '保存失败' };
                }
                return [3, 4];
            case 3:
                err_7 = _a.sent();
                ctx.body = returnErr(err_7);
                return [3, 4];
            case 4: return [2];
        }
    });
}); });
router.get('/back_manage/api/article/detail', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
    var data, err_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4, schema_1["default"].article.findById(ctx.query.id).select('classify content face_img title')];
            case 1:
                data = _a.sent();
                ctx.body = data ? { result: 1, data: data } : { result: 2, msg: '文章不存在' };
                return [3, 3];
            case 2:
                err_8 = _a.sent();
                ctx.body = returnErr(err_8);
                return [3, 3];
            case 3: return [2];
        }
    });
}); });
router.post('/back_manage/api/article/update', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
    var err_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4, schema_1["default"].article.updateOne({ _id: ctx.request.body._id }, {
                        title: ctx.request.body.title,
                        content: ctx.request.body.content,
                        classify: ctx.request.body.classify,
                        face_img: ctx.request.body.face_img,
                        update_time: new Date().getTime()
                    })];
            case 1:
                _a.sent();
                ctx.body = { result: 1, msg: '更新成功' };
                return [3, 3];
            case 2:
                err_9 = _a.sent();
                ctx.body = returnErr(err_9);
                return [3, 3];
            case 3: return [2];
        }
    });
}); });
router.get('/back_manage/api/article/delete', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
    var err_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4, schema_1["default"].article.remove({ _id: ctx.query.id })];
            case 1:
                _a.sent();
                ctx.body = { result: 1, msg: '删除成功' };
                return [3, 3];
            case 2:
                err_10 = _a.sent();
                ctx.body = returnErr(err_10);
                return [3, 3];
            case 3: return [2];
        }
    });
}); });
router.get('/back_manage/api/user/list', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
    var data, err_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4, schema_1["default"].user.find().select('name avatar')];
            case 1:
                data = _a.sent();
                ctx.body = { result: 1, data: data, msg: '获取成功' };
                return [3, 3];
            case 2:
                err_11 = _a.sent();
                ctx.body = returnErr(err_11);
                return [3, 3];
            case 3: return [2];
        }
    });
}); });
router.post('/back_manage/api/user/delete', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
    var authname, username, data, err_12;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                authname = ctx.session.name;
                username = ctx.request.body.name;
                if (username === 'admin') {
                    return [2, ctx.body = { result: 2, msg: '管理员账号不能删除' }];
                }
                else if (authname === username) {
                    return [2, ctx.body = { result: 2, msg: '不能删除自己的账号' }];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4, schema_1["default"].user.deleteOne({ name: username })];
            case 2:
                data = _a.sent();
                if (data.ok === 1 && data.deletedCount === 1) {
                    return [2, ctx.body = { result: 1, msg: '删除成功' }];
                }
                ctx.body = { result: 2, msg: '该用户不存在' };
                return [3, 4];
            case 3:
                err_12 = _a.sent();
                ctx.body = returnErr(err_12);
                return [3, 4];
            case 4: return [2];
        }
    });
}); });
exports["default"] = router;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2VuZC5hcGkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBpL2JhY2tlbmQuYXBpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGlCQXFQQTs7QUFyUEEsbUNBQXFDO0FBQ3JDLG9DQUErQjtBQUMvQix3Q0FBMEM7QUFDMUMsMkJBQTZCO0FBQzdCLHVCQUF5QjtBQUN6QixJQUFNLE1BQU0sR0FBRyxJQUFJLE1BQU0sRUFBRSxDQUFDO0FBQzVCLFNBQVMsU0FBUyxDQUFDLEdBQU87SUFDekIsT0FBTyxFQUFFLE1BQU0sRUFBQyxDQUFDLEVBQUUsSUFBSSxFQUFDLEdBQUcsRUFBRSxDQUFBO0FBQzlCLENBQUM7QUFFRCxNQUFNLENBQUMsR0FBRyxDQUFDLDBCQUEwQixFQUFFLFVBQUMsR0FBRyxFQUFFLElBQUk7SUFDL0MsSUFBSSxPQUFPLEdBQU8sVUFBVSxDQUFDLE1BQU0sQ0FBQztRQUNsQyxLQUFLLEVBQUUsQ0FBQztRQUNSLFdBQVcsRUFBRSxNQUFNO1FBQ25CLEtBQUssRUFBRSxHQUFHO1FBQ1YsTUFBTSxFQUFFLEVBQUU7UUFDVixRQUFRLEVBQUUsRUFBRTtLQUNiLENBQUMsQ0FBQTtJQUNGLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFBO0lBQ2xCLEdBQUcsQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFBO0FBQ3BCLENBQUMsQ0FBQyxDQUFBO0FBRUYsTUFBTSxDQUFDLElBQUksQ0FBQyx3QkFBd0IsRUFBQyxVQUFPLEdBQUcsRUFBRSxJQUFJOzs7Ozs7Z0JBRWxDLFdBQU0sbUJBQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO3dCQUNyQyxJQUFJLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSTt3QkFDM0IsUUFBUSxFQUFFLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVE7cUJBQ3BDLENB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