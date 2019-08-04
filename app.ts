import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as koaBody from 'koa-body';
import * as path from 'path';
import * as fs from 'fs';
import * as session from 'koa-session';
import * as koaStatic from 'koa-static';
import * as net from 'net';
import { historyApiFallback } from 'koa2-connect-history-api-fallback';
import frontendApi from './src/api/frontend.api';
import backendApi from './src/api/backend.api';
const app = new Koa();
const router = new Router();
let port:number = 4000;
const args:any[] = process.argv.slice(2);
args[0]&&(port = args[0]);
const isProd = args[1]==='production'
// 异常捕获
const catchError = async (ctx:any, next:any) => {
    try{
        await next()
    }catch(err){
        ctx.status = err.statusCode || err.status || 500;
        ctx.body = err.message
    }
}
app.use(catchError)

// 静态资源
app.use(koaStatic(path.join(__dirname,'./dist')));
app.use(koaStatic(path.join(__dirname,'./public')));
app.use(koaStatic(__dirname));

// 首页
router.get('/', ctx=>{
    const index = fs.readFileSync(path.resolve(__dirname,'./dist/index.html'))
    ctx.type = 'text/html'
    ctx.body = index
})

// history
app.use(historyApiFallback({
    index:'/'
}))

// 入参解析
app.use(koaBody({
    multipart:true, // 支持文件上传
    encoding:'utf-8',
    formidable:{
        multiples:false,
        uploadDir:path.join(__dirname,'./public/resource/'), // 设置文件上传目录
        keepExtensions: true,    // 保持文件的后缀
        maxFileSize:3 * 1024 * 1024, // 文件上传大小
        onFileBegin(name,file){
            const fileName = file.name;
            const picReg = /\.(png|jpe?g|gif|svg)$/i;
            if(!picReg.test(fileName)){
               return this._error('只能上传图片')
            }
        }
    },
    onError(err:any,ctx){
        ctx.throw(err)
    }
}));


app.use(async (ctx,next)=> {
    ctx.accepts('html', 'json');
    ctx.acceptsCharsets('utf-8');
    ctx.set({
        'Content-Type':'application/json;charset=utf-8'
    });
    await next();
})

// 配置CORS
const allowCrossDomain = async (ctx:any, next:any)=> {   
    ctx.set({
        'Access-Control-Allow-Origin': ctx.header.origin,
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
        'Access-Control-Allow-Credentials': true, 
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        'Content-Type': 'application/json;charset=utf-8'
    })
    if(ctx.method === 'OPTIONS'){
        return ctx.status = 200
    }
    await next()
}
if(!isProd){
    app.use(allowCrossDomain)
}

app.use(router.routes());
app.use(frontendApi.routes());;

// 鉴权
app.keys = ['some secret hurr'];
const CONFIG = {
  key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
  /** (number || 'session') maxAge in ms (default is 1 days) */
  /** 'session' will result in a cookie that expires when session/browser is closed */
  /** Warning: If a session cookie is stolen, this cookie will never expire */
  maxAge: 60*60*1000,
  autoCommit: true, /** (boolean) automatically commit headers (default true) */
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: true, /** (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
  rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
  renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
};
app.use(session(CONFIG, app));
const noNeedUrl = [
    '/back_manage/api/captcha',
    '/back_manage/api/login',
    '/back_manage/api/logout',
    '/back_manage/api/register'
]
const allowRequest = async function (ctx:any, next:any) {
    const requestPath = ctx.request.path
    if (requestPath.indexOf('front_manage') !== -1) {
        return await next()
    }
    for(const url of noNeedUrl) {
      if(url === requestPath) {
        return await next()
      }
    }
    if(ctx.session.name){
        return await next()
    }else{
        return ctx.body = {result:0,msg:'未登录'}
    }
}
app.use(allowRequest);
app.use(backendApi.routes());

function portIsOccupied (port:number) {
    const server = net.createServer().listen(port)
    server.on('listening', function () { // 执行这块代码说明端口未被占用
      server.close() // 关闭服务
      app.listen(port);
      console.log(`Server running on port ${port}`);
    })
    server.on('error', function (err:any) {
      if (err.code === 'EADDRINUSE') { // 端口已经被使用
        console.error(`The port ${port} is occupied, try to start on port ${++port} immediately.`)
        portIsOccupied(port);
      }
    })
}
portIsOccupied(port)