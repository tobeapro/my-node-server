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
var Koa = require("koa");
var Router = require("koa-router");
var koaBody = require("koa-body");
var path = require("path");
var session = require("koa-session");
var koaStatic = require("koa-static");
var net = require("net");
var history = require('koa2-history-api-fallback');
var frontend_api_1 = require("./src/api/frontend.api");
var backend_api_1 = require("./src/api/backend.api");
var app = new Koa();
var router = new Router();
app.use(koaStatic(path.join(__dirname, './public')));
app.use(koaStatic(path.join(__dirname, './dist')));
app.use(koaBody({
    multipart: true,
    encoding: 'utf-8',
    formidable: {
        multiples: false,
        uploadDir: path.join(__dirname, './public/resource/'),
        keepExtensions: true,
        maxFieldsSize: 2 * 1024 * 1024
    }
}));
var port = 4000;
var allowCrossDomain = function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ctx.set({
                    'Access-Control-Allow-Origin': ctx.header.origin,
                    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
                    'Access-Control-Allow-Credentials': true,
                    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
                    'Content-Type': 'application/json;charset=utf-8'
                });
                if (ctx.method === 'OPTIONS') {
                    return [2, ctx.status = 200];
                }
                return [4, next()];
            case 1:
                _a.sent();
                return [2];
        }
    });
}); };
app.use(allowCrossDomain);
app.use(function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ctx.accepts('html', 'json');
                ctx.acceptsCharsets('utf-8');
                ctx.set({
                    'Content-Type': 'application/json;charset=utf-8'
                });
                return [4, next()];
            case 1:
                _a.sent();
                return [2];
        }
    });
}); });
app.use(history({
    index: '/index.html'
}));
app.use(router.routes());
app.use(frontend_api_1["default"].routes());
;
app.keys = ['some secret hurr'];
var CONFIG = {
    key: 'koa:sess',
    maxAge: 60 * 60 * 1000,
    autoCommit: true,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: false,
    renew: false
};
app.use(session(CONFIG, app));
var noNeedUrl = [
    '/back_manage/api/captcha',
    '/back_manage/api/login',
    '/back_manage/api/logout',
    '/back_manage/api/register'
];
var allowRequest = function (ctx, next) {
    return __awaiter(this, void 0, void 0, function () {
        var requestPath, _i, noNeedUrl_1, url;
        return __generator(this, function (_a) {
            requestPath = ctx.request.path;
            if (requestPath.indexOf('front_manage') !== -1) {
                return [2, next()];
            }
            for (_i = 0, noNeedUrl_1 = noNeedUrl; _i < noNeedUrl_1.length; _i++) {
                url = noNeedUrl_1[_i];
                if (url === requestPath) {
                    return [2, next()];
                }
            }
            if (ctx.session.name) {
                return [2, next()];
            }
            else {
                return [2, ctx.body = { result: 0, msg: '未登录' }];
            }
            return [2];
        });
    });
};
app.use(allowRequest);
app.use(backend_api_1["default"].routes());
;
function portIsOccupied(port) {
    var server = net.createServer().listen(port);
    server.on('listening', function () {
        server.close();
        app.listen(port);
        console.log("Server running on port " + port);
    });
    server.on('error', function (err) {
        if (err.code === 'EADDRINUSE') {
            console.error("The port " + port + " is occupied, try to start on port " + ++port + " immediately.");
            portIsOccupied(port);
        }
    });
}
portIsOccupied(port);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGlCQWdIb0I7O0FBaEhwQix5QkFBMkI7QUFDM0IsbUNBQXFDO0FBQ3JDLGtDQUFvQztBQUNwQywyQkFBNkI7QUFDN0IscUNBQXVDO0FBQ3ZDLHNDQUF3QztBQUN4Qyx5QkFBMkI7QUFDM0IsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLDJCQUEyQixDQUFDLENBQUM7QUFDckQsdURBQWlEO0FBQ2pELHFEQUErQztBQUMvQyxJQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ3RCLElBQU0sTUFBTSxHQUFHLElBQUksTUFBTSxFQUFFLENBQUM7QUFFNUIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BELEdBQUcsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUVsRCxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQztJQUNaLFNBQVMsRUFBQyxJQUFJO0lBQ2QsUUFBUSxFQUFDLE9BQU87SUFDaEIsVUFBVSxFQUFDO1FBQ1AsU0FBUyxFQUFDLEtBQUs7UUFDZixTQUFTLEVBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUMsb0JBQW9CLENBQUM7UUFDbkQsY0FBYyxFQUFFLElBQUk7UUFDcEIsYUFBYSxFQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsSUFBSTtLQUNoQztDQUNKLENBQUMsQ0FBQyxDQUFDO0FBQ0osSUFBSSxJQUFJLEdBQVUsSUFBSSxDQUFDO0FBR3ZCLElBQU0sZ0JBQWdCLEdBQUcsVUFBTyxHQUFPLEVBQUUsSUFB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