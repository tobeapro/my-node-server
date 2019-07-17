const express = require('express')
const models = require('./schema')
const svgCaptcha = require('svg-captcha')
const formidable = require('formidable')
const path = require('path')
const fs = require('fs')
const router = express.Router()
router.get('/', (req, res) => {
  res.sendfile('./dist/index.html')
})
// 生成验证码
router.get('/back_manage/api/captcha', (req, res, next) => {
  let captcha = svgCaptcha.create({
    noise: 2,
    ignoreChars: '0o1i',
    width: 120,
    height: 36,
    fontSize: 40
  })
  captcha.result = 1
  return res.send(captcha).end()
})
// 登陆
router.post('/back_manage/api/login', (req, res, next) => {
  models.user.find({
    name: req.body.name,
    password: req.body.password
  }, (err, data) => {
    if (err) {
     return res.send(err)
    }
    if (data.length) {
      if (req.session.name === req.body.name) {
        res.send({
          result: 1,
          msg: '欢迎回来'
        }).end()
      } else {
        req.session.name = req.body.name
        return res.send({
          result: 1,
          msg: '登陆成功'
        }).end()
      }
    } else {
      return res.send({
        result: 2,
        msg: '账号或密码错误'
      }).end()
    }
  })
})
// 登出
router.get('/back_manage/api/logout', (req, res, next) => {
  delete req.session.name
  return res.send({ result: 1 })
})
// 注册
router.post('/back_manage/api/register', (req, res, next) => {
  models.user.find({
    name: req.body.name
  }, (err, data) => {
    if (err) {
      return res.send(err)
    }
    if (data.length) {
      return res.send({
        result: 2,
        msg: '该账号已存在'
      }).end()
    } else {
      let newUser = {
        name: req.body.name,
        password: req.body.password
      }
      models.user(newUser).save()
        .then(() => {
          return res.send({
            result: 1,
            msg: '注册成功,请登录'
          }).end()
        })
        .catch(err => {
          return res.send(err)
        })
    }
  })
})
// 用户详情
router.get('/back_manage/api/getInfo', (req, res, next) => {
  models.user.findOne({ name: req.session.name }, { password: 0 }, (err, data) => {
    if (err) {
      return res.send(err)
    }
    if (data) {
      return res.send({ result: 1, data: data })
    } else {
      return res.send({ result: 2, msg: '用户不存在' })
    }
  })
})
// 上传头像
router.post('/back_manage/api/upload_avatar', (req, res, next) => {
  if (!fs.existsSync(path.join(__dirname, '/public/resource'))) {
    fs.mkdirSync(path.join(__dirname, '/public/resource'))
  }
  const form = new formidable.IncomingForm()
  form.encoding = 'utf-8'
  form.keepExtensions = true
  form.uploadDir = path.join(__dirname, '/public/resource')
  form.maxFieldsSize = 2 * 1024 * 1024
  form.maxFileSize = 2 * 1024 * 1024
  form.parse(req, function(err, fields, files) {
    if (err) {
      return res.send({ result: 2, msg: '上传失败' })
    }
    models.user.findOne({ name: req.session.name }, (err, doc) => {
      if (err) {
        return res.send({ result: 2, msg: '系统异常' })
      }
      if (doc) {
        const imgPath = files.file.path
        models.user.update({ name: req.session.name }, { avatar: '/public/resource/' + path.basename(imgPath) }, (err) => {
          if (err) {
            return res.send({ result: 2, msg: '更新失败' })
          }
          return res.send({ result: 1, msg: '上传成功', url: '/public/resource/' + path.basename(imgPath) })
        })
      }else{
        return res.send({ result: 2, msg: '未找到该用户' })
      }
    })
  })
})
// 修改密码
router.post('/back_manage/api/pwdUpdate', (req, res, next) => {
  models.user.findOne({ name: req.session.name }, (err, data) => {
    if (err) {
      return res.send(err)
    }
    if (data) {
      if (data.password === req.body.oldPwd) {
        models.user.update({ _id: req.body.id }, { password: req.body.newPwd }, err => {
          if (err) {
            return res.send({ result: 2, msg: '更新失败' })
          }
          return res.send({ result: 1 })
        })
      } else {
        return res.send({ result: 2, msg: '原密码输入有误' })
      }
    } else {
      return res.send({ result: 2, msg: '该用户不存在' })
    }
  })
})
// 获取文章列表
router.post('/back_manage/api/articles', (req, res, next) => {
   const queryTitle = new RegExp(req.body.title)
   const queryClasify = new RegExp(req.body.classify)
   models.article.find(
    { 
      user_name: req.session.name,
      title: { $regex: queryTitle }, 
      classify: { $regex: queryClasify }
    }, (err, data) => {
    if (err) {
      return res.send(err)
    }
    if (data) {
      return res.send({ result: 1, data: data })
    } else {
      return res.send({ result: 1, data: [] })
    }
  })
})
// 上传图片
router.post('/back_manage/api/upload_img', (req, res, next) => {
  if (!fs.existsSync(path.join(__dirname, '/public/resource'))) {
    fs.mkdirSync(path.join(__dirname, '/public/resource'))
  }
  const form = new formidable.IncomingForm()
  form.encoding = 'utf-8'
  form.keepExtensions = true
  form.uploadDir = path.join(__dirname, './public/resource')
  form.maxFieldsSize = 2 * 1024 * 1024
  form.maxFileSize = 2 * 1024 * 1024
  form.parse(req, (err, fields, files) => {
    if (err) {
      return  res.send({ result: 2, msg: '上传失败' })
    }
    const imgPath = files.file.path
    return res.send({ result: 1, msg: '上传成功', url: '/public/resource/' + path.basename(imgPath) })
  })
})
// 添加文章
router.post('/back_manage/api/article/new', (req, res, next) => {
  const currentTime = new Date().getTime()
  const newArticle = models.article({
    user_name: req.session.name,
    title: req.body.title,
    face_img: req.body.face_img,
    classify: req.body.classify,
    content: req.body.content,
    create_time: currentTime,
    update_time: currentTime
  })
  newArticle.save(err => {
    if (err) {
      return res.send({ result: 2, msg: '保存失败' })
    }
    return res.send({ result: 1, msg: '保存成功', data: newArticle })
  })
})
// 文章明细
router.get('/back_manage/api/article/detail', (req, res, next) => {
  models.article.findById(req.query.id)
    .select('classify content face_img title')
    .exec((err, doc) => {
      if (err) {
        return res.send({ result: 2, msg: '查看失败' })
      }
      if (doc) {
        return res.send({ result: 1, data: doc })
      } else {
        return res.send({ result: 2, msg: '文章不存在' })
      }
    })
})
// 编辑文章
router.post('/back_manage/api/article/update', (req, res, next) => {
  models.article.update({ _id: req.body._id }, { 
    title: req.body.title, 
    content: req.body.content,
    classify: req.body.classify,
    face_img: req.body.face_img,
    update_time: new Date().getTime() 
  }, err => {
    if (err) {
      return res.send({ result: 2, msg: '更新失败' })
    }
    return res.send({ result: 1, msg: '更新成功' })
  })
})
// 删除文章
router.get('/back_manage/api/article/delete', (req, res, next) => {
  models.article.remove({ _id: req.query.id }, err => {
    if (err) {
      return res.send({ result: 2, msg: '删除失败' })
    }
    return res.send({ result: 1, msg: '删除成功' })
  })
})
router.get('/back_manage/api/user/list', (req, res, next) => {
  models.user.find()
  .select('name avatar')
  .exec((err,data)=>{
    if (err) {
      return res.send({ result: 2, msg: '获取失败' })
    }
    return res.send({ result: 1, data:data||[], msg: '获取成功' })
  })
})
// 删除用户
router.post('/back_manage/api/user/delete', (req, res, next) => {
  const authname = req.session.name
  const username = req.body.name
  if(username==='admin'){
    return res.send({result:2,msg:'管理员账号不能删除'})
  }else if(authname===username){
    return res.send({result:2,msg:'不能删除自己的账号'})
  }
  models.user.deleteOne({name:username})
  .exec((err,data)=>{
    if(err){
      return res.send({result:2,msg:'删除失败'})
    }
    if(data.ok===1&&data.deletedCount===1){
      return res.send({result:1,msg:'删除成功'})
    }
    return res.send({result:2,msg:'该用户不存在'})
  })
})
module.exports = router
