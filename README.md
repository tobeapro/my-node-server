## koa+ts重构博客服务端
原始项目在分支 [server@1.0](../../tree/server@1.0)
#### 主要项目依赖
+ koa
+ koa-router
+ koa-static,处理静态资源
+ koa-session,session身份鉴权
+ koa-body,参数解析及文件上传
+ mongoose,node操作MongoDB的模型工具
#### 主要功能
+ 登录,注销
+ 密码修改
+ 文章增删改查、评论
+ 图片上传
+ 用户管理
#### 项目使用
> 需要全局安装`typescript`和`nodemon`
+ yarn install
+ yarn dev,使用`nodemon`热更新启动
+ yarn build,打包代码
+ yarn source,打包代码并生成`sourcemap`文件
