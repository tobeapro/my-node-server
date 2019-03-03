const express = require('express')
const models = require('./schema')
const router = express.Router()
// 获取文章
router.post('/front_manage/api/getArticles',(req,res,next)=>{
	const tagReg = req.body.classify?new RegExp(req.body.classify):''
	models.article.find({
		user_name:req.body.name||'admin',
		classify:{ $regex: tagReg }
	}).
	sort({ create_time: -1 }).
	select('title create_time update_time classify face_img').
	exec((err,data)=>{
		if(err){
			return res.send(err)
		}
		if(data){
			res.send({result:1,data})
		}else{
			res.send({result:1,data:[]})
		}
	})
})
// 获取文章详情
router.post('/front_manage/api/airticleDetail',(req,res,next)=>{
	models.article.findById(req.body.id,(err,data)=>{
		if(err){
			return res.send(err)
		}
		if(data){
			res.send({result:1,data})
		}else{
			res.send({result:2,msg:'文章不存在'})
		}
	})
})
// 获取用户信息
router.post('/front_manage/api/getInfo',(req,res,next)=>{
	models.user.findOne({name:req.body.name||'admin'},{password: 0},(err,data)=>{
		if(err){
			return res.send(err)
		}
		if(data){
			res.send({result:1,data:data})
		}else{
			res.send({result:1})
		}
	})
})
// 获取新闻
router.get('/front_manage/api/getNews',(req,res,next)=>{
	models.news.find({},(err,data)=>{
		if(err){
			return res.send(err)
		}
		if(data){
			res.send({result:1,data:data})
		}else{
			res.send({result:1,data:[]})
		}
	})
})
module.exports = router