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
// 获取最近文章
router.post('/front_manage/api/latestArticles',(req,res,next)=>{
	const num = typeof(req.body.num)==='number'?req.body.num:5
	models.article.find()
	.sort({ create_time: -1 })
	.select('title')
	.limit(num)
	.exec((err,data)=>{
		if(err){
			return res.send(err)
		}
		return res.send({
			result:1,
			data
		})
	})
})
router.post('/front_manage/api/articleCount',(req,res,next)=>{
	models.article.find()
	.select('classify')
	.exec((err,data)=>{
		if(err){
			return res.send(err)
		}
		const total = data.length
		let groupObj = {}
		data.forEach(item=>{
			const classify = item.classify
			let classifyAry = classify.split(',')
			classifyAry.forEach(key=>{
				if(groupObj[key]){
					groupObj[key]++
				}else{
					groupObj[key] = 1
				}
			})
		})
		let groups = [] 
		Object.keys(groupObj).forEach(key=>{
			groups.push({
				item:key,
				count:groupObj[key]
			})
		})
		res.send({
			result:1,
			data:{
				total,
				groups
			}
		})

	})
})
// 获取文章详情
router.post('/front_manage/api/airticleDetail',(req,res,next)=>{
	const objIdReg = /^[a-z0-9]{24}$/;
	if(!objIdReg.test(req.body.id)){
		return res.send({result:2,msg:'文章不存在'})
	}
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