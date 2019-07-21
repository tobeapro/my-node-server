import * as Router from 'koa-router';
import models from '../schema';
import * as svgCaptcha from 'svg-captcha';
import * as path from 'path';
import * as fs from 'fs';
const router = new Router();
function returnErr(err:any){
	return { result:0, data:err }
}
// 生成验证码
router.get('/back_manage/api/captcha', (ctx, next) => {
  let captcha:any = svgCaptcha.create({
    noise: 2,
    ignoreChars: '0o1i',
    width: 120,
    height: 36,
    fontSize: 40
  })
  captcha.result = 1
  ctx.body = captcha
})
// 登录
router.post('/back_manage/api/login',async (ctx, next) => {
  try{
      const data = await models.user.findOne({
        name: ctx.request.body.name,
        password: ctx.request.body.password
      })
      if (data) {
        if (ctx.session.name === ctx.request.body.name) {
          ctx.body = { result: 1, msg: '欢迎回来' }
        } else {
          ctx.session.name = ctx.request.body.name
          ctx.body = { result: 1, msg: '登录成功' }
        }
      } else {
        ctx.body = { result: 2, msg: '账号或密码错误' }
      }
  }catch(err){
    ctx.body = returnErr(err)
  }
})
// 登出
router.get('/back_manage/api/logout', (ctx, next) => {
  delete ctx.session.name
  ctx.body  = { result: 1 }
})
// 注册
router.post('/back_manage/api/register',async (ctx, next) => {
  try{
    const data = await models.user.find({ name: ctx.request.body.name})
    if (data.length) {
      ctx.body = { result:2, msg:'账号已存在' }
    } else {
      let newUser:any = {
        name: ctx.request.body.name,
        password: ctx.request.body.password
      }
      const res = await (new models.user(newUser)).save()
      if(res){
        ctx.body = { result:1, msg:'注册成功,请登录' }
      }
    }
  }catch(err){
    ctx.body = returnErr(err)
  }
})
// 用户详情
router.get('/back_manage/api/getInfo',async (ctx, next) => {
  try{
    const data = await models.user.findOne({ name: ctx.session.name }, { password: 0 })
      if (data) {
        ctx.body = { result: 1, data }
      } else {
        ctx.body = { result: 2, msg: '用户不存在' }
      }
  }catch(err){
    ctx.body = returnErr(err)
  }
})
// 上传头像
router.post('/back_manage/api/upload_avatar',async (ctx, next) => {
  if (!fs.existsSync(path.resolve(__dirname, '../../public/resource'))) {
    fs.mkdirSync(path.resolve(__dirname, '../../public/resource'))
  }
  try{
    if(ctx.request.files){
      const files:any = ctx.request.files;
      const user = await models.user.findOne({ name: ctx.session.name })
      if(user){
        try{
        const data = await models.user.updateOne({ name: ctx.session.name }, { avatar: '/public/resource/' + path.basename(files.file.path) })
        if(data){
          ctx.body = { result: 1, msg: '上传成功', url: '/public/resource/' + path.basename(files.file.path) }
        }
        }catch(err2){
          ctx.body = { result: 2, data: err2, msg: '更新失败' }
        }
      }else{
        ctx.body = { result: 2, msg: '未找到该用户' }
      }
    }else{
      ctx.body = { result:2, msg:'上传失败' }
    }
  }catch(err){
    ctx.body = returnErr(err)
  }
})
// 修改密码
router.post('/back_manage/api/pwdUpdate',async (ctx, next) => {
  try{
    const data:any = await models.user.findOne({ name: ctx.session.name })
    if(data) {
      if (data.password === ctx.request.body.oldPwd) {
        try{
          const res = await models.user.updateOne({ _id: ctx.request.body.id }, { password: ctx.request.body.newPwd })
          ctx.body = { result:1 }
        }catch(err2){
          ctx.body = { result: 2, msg: '更新失败' }
        }
      } else {
        ctx.body = { result: 2, msg: '原密码输入有误' }
      }
    }
  }catch(err){
    ctx.body = returnErr(err)
  }
})
// 获取文章列表
router.post('/back_manage/api/articles',async (ctx, next) => {
   const queryTitle = new RegExp(ctx.request.body.title)
   const queryClasify = new RegExp(ctx.request.body.classify)
   try{
     const data = await models.article.find({ 
       user_name: ctx.session.name,
       title: { $regex: queryTitle }, 
       classify: { $regex: queryClasify }
     })
     ctx.body = { result: 1, data: data||[] }
   }catch(err){
     ctx.body = returnErr(err)
   }
})
// 上传图片
router.post('/back_manage/api/upload_img',async (ctx, next) => {
  if (!fs.existsSync(path.resolve(__dirname, '../../public/resource'))) {
    fs.mkdirSync(path.resolve(__dirname, '../../public/resource'))
  }
  try{
    if(ctx.request.files){
      const files:any = ctx.request.files;
      ctx.body = { result: 1, msg: '上传成功', url: '/public/resource/' + path.basename(files.file.path) }
    }else{
      ctx.body = { result:2, msg:'上传失败' }
    }
  }catch(err){
    ctx.body = returnErr(err)
  }
})
// 添加文章
router.post('/back_manage/api/article/new',async (ctx, next) => {
  const currentTime = new Date().getTime()
  let articleLive:any = {
    user_name: ctx.session.name,
    title: ctx.request.body.title,
    face_img: ctx.request.body.face_img,
    classify: ctx.request.body.classify,
    content: ctx.request.body.content,
    create_time: currentTime,
    update_time: currentTime
  }
  try{
    const newArticle = new models.article(articleLive)
    const data = await newArticle.save()
    if(data){
      ctx.body = { result: 1, msg: '保存成功', data: newArticle }
    }else{
      ctx.body = { result: 2, msg: '保存失败' }
    }
  }catch(err){
    ctx.body = returnErr(err)
  }
})
// 文章明细
router.get('/back_manage/api/article/detail',async (ctx, next) => {
  try{
    const data = await models.article.findById(ctx.query.id).select('classify content face_img title')
    ctx.body = data ? { result: 1, data } : { result: 2, msg: '文章不存在' }
  }catch(err){
    ctx.body = returnErr(err)
  }
})
// 编辑文章
router.post('/back_manage/api/article/update',async (ctx, next) => {
  try{
    await models.article.updateOne({ _id: ctx.request.body._id }, { 
      title: ctx.request.body.title, 
      content: ctx.request.body.content,
      classify: ctx.request.body.classify,
      face_img: ctx.request.body.face_img,
      update_time: new Date().getTime() 
    })
    ctx.body = { result: 1, msg: '更新成功' }
  }catch(err){
    ctx.body = returnErr(err)
  }
})
// 删除文章
router.get('/back_manage/api/article/delete',async (ctx, next) => {
  try{
    await models.article.remove({ _id: ctx.query.id })
    ctx.body = { result: 1, msg: '删除成功' }
  }catch(err){
    ctx.body = returnErr(err)
  }
})
router.get('/back_manage/api/user/list',async (ctx, next) => {
  try{
    const data = await models.user.find().select('name avatar')
    ctx.body = { result: 1, data, msg: '获取成功' }
  }catch(err){
    ctx.body = returnErr(err)
  }
})
// 删除用户
router.post('/back_manage/api/user/delete',async (ctx, next) => {
  const authname = ctx.session.name
  const username = ctx.request.body.name
  
  if(username==='admin'){
    return ctx.body = { result:2, msg:'管理员账号不能删除' }
  }else if(authname===username){
    return ctx.body = { result:2, msg:'不能删除自己的账号' }
  }
  try{
    const data:any = await models.user.deleteOne({name:username})
    if(data.ok===1&&data.deletedCount===1){
      return ctx.body = { result:1, msg:'删除成功' }
    }
    ctx.body = { result:2, msg:'该用户不存在' }
  }catch(err){
    ctx.body = returnErr(err)
  }
})
export default router
