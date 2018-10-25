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
  res.send(captcha).end()
})
// 登陆
router.post('/back_manage/api/login', (req, res, next) => {
  models.user.find({
    name: req.body.name,
    password: req.body.password
  }, (err, data) => {
    if (err) {
      res.send(err)
      next()
    }
    if (data.length) {
      if (req.session.name === req.body.name) {
        res.send({
          result: 1,
          msg: '欢迎回来'
        }).end()
      } else {
        // req.session.isLogin = true
        req.session.name = req.body.name
        res.send({
          result: 1,
          msg: '登陆成功'
        }).end()
      }
    } else {
      res.send({
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
      res.send(err)
      next()
    }
    if (data.length) {
      res.send({
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
          res.send({
            result: 1,
            msg: '注册成功,请登录'
          }).end()
        })
        .catch(err => {
          res.send(err)
        })
    }
  })
})
// 用户详情
router.get('/back_manage/api/getInfo', (req, res, next) => {
  models.user.findOne({ name: req.session.name }, { password: 0 }, (err, data) => {
    if (err) {
      res.send(err)
      next()
    }
    if (data) {
      delete data.password
      res.send({ result: 1, data: data })
    } else {
      res.send({ result: 2, msg: '用户不存在' })
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
  form.uploadDir = path.join(__dirname, './public/resource')
  form.maxFieldsSize = 1 * 1024 * 1024
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.send({ result: 2, msg: '上传失败' })
    }
    models.user.findById(fields.id, (err, doc) => {
      if (err) {
        return res.send({ result: 2, msg: '系统异常' })
      }
      if (doc) {
        const imgPath = files.file.path
        const imgData = fs.readFileSync(imgPath)
        fs.writeFile(imgPath, imgData, err => {
          if (err) {
            return res.send({ result: 2, msg: '上传失败' })
          }
          models.user.update({ _id: fields.id }, { avatar: 'public/resource/' + path.basename(imgPath) }, (err) => {
            if (err) {
              return res.send({ result: 2, msg: '上传失败' })
            }
            return res.send({ result: 1, msg: '上传成功', url: 'public/resource/' + path.basename(imgPath) })
          })
        })
      }else{
        return res.send({ result: 2, msg: '未找到该用户' })
      }
    })
  })
  form.on('error', err => {
    res.send({ result: 2, msg: err })
  })
})
// 修改密码
router.post('/back_manage/api/pwdUpdate', (req, res, next) => {
  models.user.findOne({ name: req.session.name }, (err, data) => {
    if (err) {
      res.send(err)
      next()
    }
    if (data) {
      if (data.password === req.body.oldPwd) {
        models.user.update({ _id: req.body.id }, { password: req.body.newPwd }, err => {
          if (err) {
            res.send({ result: 2, msg: '更新失败' })
          }
          res.send({ result: 1 })
        })
      } else {
        res.send({ result: 2, msg: '原密码输入有误' })
      }
    } else {
      res.send({ result: 2, msg: '该用户不存在' })
    }
  })
})
// 获取文章列表
router.get('/back_manage/api/articles', (req, res, next) => {
  models.article.find({ user_name: req.session.name }, (err, data) => {
    if (err) {
      res.send(err)
      next()
    }
    if (data) {
      // delete data.password
      res.send({ result: 1, data: data })
    } else {
      res.send({ result: 1, data: [] })
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
  form.parse(req, (err, fields, files) => {
    if (err) {
      res.send({ result: 2, msg: '上传失败' })
    }
    const imgPath = files.file.path
    const imgData = fs.readFileSync(imgPath)
    fs.writeFile(imgPath, imgData, err => {
      if (err) {
        res.send({ result: 2, msg: '上传失败' })
      }
      res.send({ result: 1, msg: '上传成功', url: 'public/resource/' + path.basename(imgPath) })
    })
  })
  form.on('error', err => {
    res.send({ result: 2, msg: err })
  })
})
// 添加文章
router.post('/back_manage/api/article/new', (req, res, next) => {
  const newArticle = models.article({
    user_name: req.session.name,
    title: req.body.title,
    content: req.body.content,
    contentHtml: req.body.contentHtml,
    create_time: req.body.create_time,
    update_time: req.body.create_time
  })
  newArticle.save(err => {
    if (err) {
      res.send({ result: 2, msg: '保存失败' })
    }
    res.send({ result: 1, msg: '保存成功', data: newArticle })
  })
})
// 文章明细
router.get('/back_manage/api/article/detail', (req, res, next) => {
  models.article.findById(req.query.id, (err, doc) => {
    if (err) {
      res.send({ result: 2, msg: '查看失败' })
    }
    if (doc) {
      res.send({ result: 1, data: doc })
    } else {
      res.send({ result: 2, msg: '文章不存在' })
    }
  })
})
// 编辑文章
router.post('/back_manage/api/article/update', (req, res, next) => {
  models.article.update({ _id: req.body._id }, { title: req.body.title, content: req.body.content, contentHtml: req.body.contentHtml, update_time: req.body.update_time }, err => {
    if (err) {
      res.send({ result: 2, msg: '更新失败' })
    }
    res.send({ result: 1, msg: '更新成功' })
  })
})
// 删除文章
router.get('/back_manage/api/article/delete', (req, res, next) => {
  models.article.remove({ _id: req.query.id }, err => {
    if (err) {
      res.send({ result: 2, msg: '删除失败' })
    }
    res.send({ result: 1, msg: '删除成功' })
  })
})

module.exports = router
