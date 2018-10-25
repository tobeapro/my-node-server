const express = require('express')
const models = require('./schema')
const router = express.Router()
// 获取文章
router.post('/front_manage/api/getArticles',(req,res,next)=>{
	models.article.find({user_name:req.body.name},(err,data)=>{
		if(err){
			res.send(err)
			next()
		}
		if(data){
			res.send({result:1,list:data})
		}else{
			res.send({result:1,list:[]})
		}
	})
})
// 获取用户信息
router.post('/front_manage/api/getInfo',(req,res,next)=>{
	models.user.findOne({name:req.body.name},{password: 0},(err,data)=>{
		if(err){
			res.send(err)
			next()
		}
		if(data){
			res.send({result:1,data:data})
		}else{
			res.send({result:2})
		}
	})
})
// 获取新闻
router.get('/front_manage/api/getNews',(req,res,next)=>{
	models.news.find({},(err,data)=>{
		if(err){
			res.send(err)
			next()
		}
		if(data){
			res.send({result:1,data:data})
		}else{
			res.send({result:1,data:[]})
		}
	})
})
module.exports = router