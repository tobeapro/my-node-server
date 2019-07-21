import * as Router from 'koa-router';
import models from '../schema';
import { createContext } from 'vm';
const router = new Router();
function returnErr(err:any){
	return { result:0, data:err }
}
// 获取文章
router.post('/front_manage/api/getArticles',async (ctx, next)=>{
	const tagReg = ctx.request.body.classify?new RegExp(ctx.request.body.classify):''
	try{
		const data = await models.article.find({
			user_name:ctx.request.body.name||'admin',
			classify:{ $regex: tagReg }
		}).sort({ create_time: -1 })
		.select('title create_time update_time classify face_img')
		ctx.body = { result:1, data }
	}catch(err){
		ctx.body = returnErr(err)
	}
})
// 获取最近文章
router.post('/front_manage/api/latestArticles',async (ctx,next)=>{
	const num = typeof(ctx.request.body.num)==='number'?ctx.request.body.num:5
	const tagReg = ctx.request.body.classify?new RegExp(ctx.request.body.classify):''
	try{
		const data = await models.article.find({
			user_name:ctx.request.body.name||'admin',
			classify:{ $regex: tagReg }
		})
		.sort({ create_time: -1 })
		.select('title')
		.limit(num)
		ctx.body = { result:1, data }
	}catch(err){
		ctx.body = returnErr(err)
	}
})
router.post('/front_manage/api/articleCount',async (ctx,next)=>{
	try{
		const data = await models.article.find().select('classify')
		const total = data.length
		interface groupCount {
			[propname:string]:number
		}
		let groupObj:groupCount = {}
		data.forEach((item:any)=>{
			const classify = item.classify
			let classifyAry = classify.split(',')
			classifyAry.forEach((key:string)=>{
				if(groupObj[key]){
					groupObj[key]++
				}else{
					groupObj[key] = 1
				}
			})
		})
		interface group {
			item:string,
			count:number
		}
		let groups:group[] = []; 
		Object.keys(groupObj).forEach(key=>{
			groups.push({
				item:key,
				count:groupObj[key]
			})
		})
		ctx.body = {
			result:1,
			data:{
				total,
				groups
			}
		}
	}catch(err){
		ctx.body = returnErr(err)
	}
})
// 获取文章详情
router.post('/front_manage/api/airticleDetail',async (ctx,next)=>{
	const objIdReg = /^[a-z0-9]{24}$/;
	if(!objIdReg.test(ctx.request.body.id)){
		return ctx.body = {result:2,msg:'文章不存在'}
	}
	try{
		const data = await models.article.findById(ctx.request.body.id)
		ctx.body = data ? { result:1, data } : { result:2, msg:'文章不存在' }
	}catch(err){
		ctx.body = returnErr(err)
	}
})
// 获取用户信息
router.post('/front_manage/api/getInfo',async (ctx,next)=>{
	try{
		const data = await models.user.findOne({name:ctx.request.body.name||'admin'},{password: 0})
		ctx.body = data ? { result:1, data } : { result:2, msg:'该用户不存在' }
	}catch(err){
		ctx.body = returnErr(err)
	}
})
// 获取新闻
router.get('/front_manage/api/getNews',async (ctx,next)=>{
	try{
		const data = await models.news.find()
		ctx.body = { result:1, data }
	}catch(err){
		ctx.body = returnErr(err)
	}
})
export default router