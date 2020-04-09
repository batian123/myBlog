/**
 *
 *  @author: Mr_Wei
 *  @version: 1.0.0
 *  @description: 管理员管理歌曲
 *  @Date: 2019/10/13 23:05
 *
 */

const router = require("express").Router(); //创建一个routes目录，专门用于放置路由文件，通过module.exports导出供外部使用。  https://www.cnblogs.com/jkko123/p/10295052.html
const bcryptjs = require("bcryptjs"); // 加密解密
const jwt = require("jsonwebtoken");//基于 Token 的身份验证：JSON Web Token  https://www.cnblogs.com/cangqinglang/p/10646558.html
const jwt_key = require("../tool/jwtkey").KEYORSECRET;
const passport = require("passport");//使用 Passport.js 做 Node.js 身份验证 https://www.jianshu.com/p/9e0c4696b972
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");

const banners = require("../dbModel/banner");
const blogall = require("../dbModel/blog");
const comments = require("../dbModel/comments");
const links = require("../dbModel/links");
const tagBlogId = require("../dbModel/tag_blog");
const tags = require("../dbModel/tags");
const user = require("../dbModel/user");
const access = require("../dbModel/access");


const uploadImg = require('../tool/uploadImg');

// 获取博客列表
router.get('/queryAllBlog',async (req,res)=>{

    await blogall.find().sort({ctime: -1})
        .then(blogList=>{
            if(blogList.length>0){
                res.send(blogList)
            }
            // res.send(blogList)
            res.end();
        })
        .catch(err=>{
            console.log(err)
        })
})
// 分页查询博客列表
// router.get('/queryPageBlog',passport.authenticate("jwt", {session: false,failureRedirect: '/api/web/auth' }),async (req,res)=>{
    router.get('/queryPageBlog',async (req,res)=>{
    let bodyInfo = {
        pageSize:req.query.pageSize,
        pageIndex:(parseInt(req.query.pageIndex)-1)*(req.query.pageSize)
    }
    let info =req.query.tags;
    if(info){
        let pp = await  blogall.find({tags:{$regex:info}});
        await blogall.find({tags:{$regex:info}}).limit(parseInt(bodyInfo.pageSize)).skip(parseInt(bodyInfo.pageIndex))
            .then(blogList=>{
                if(blogList.length>0){
                    blogall.find({tags:{$regex:info}}).countDocuments()
                        .then(data=>{
                            res.send({
                                massage:'查询成功',
                                status:1,
                                bloglist:blogList,
                                total:pp.length,
                                pp:data
                            })
                        })

                }else{
                    res.send({
                        massage:'未查到数据',
                        status:10001,
                        bloglist:[],
                        total:0
                    })
                }
            })
            .catch(err=>{
                console.log(err)
            })
    }else{
        await blogall.find().sort({ctime:-1}).limit(parseInt(bodyInfo.pageSize)).skip(parseInt(bodyInfo.pageIndex))
            .then(blogList=>{
                if(blogList.length>0){
                    blogall.find().countDocuments()
                        .then(data=>{
                            res.send({
                                massage:'查询成功',
                                status:1,
                                bloglist:blogList,
                                total:data
                            })
                        })

                }
            })
            .catch(err=>{
                console.log(err)
            })
    }

})
// 查找一条博客
router.get('/queryOneBlog',async (req,res)=>{
    let blogId = req.query.id;
    await blogall.find({_id:blogId})
        .then(data=>{
            if(data.length>0){
                res.send(data)
            }
            else{
                res.send('没有这条数据')
            }
            // res.send(blogList)
            res.end();
        })
        .catch(err=>{
            console.log(err)
        })
})
// 更新一条博客
router.post('/updateOneBlog',async (req,res)=>{
    let info = req.body;
    await blogall.updateOne({_id:info.id},{$set:{title:info.title,content:info.content,tags:info.tags,imgCover:info.imgCover,abstract:info.abstract}})
        .then(data=>{
            if(data.nModified!=0){
                res.send(data)
            }
            else{
                // res.send(402,'更新失败')
                res.status(404).send('更新失败')
            }
            // res.send(blogList)
            res.end();
        })
        .catch(err=>{
            console.log(err)
        })
})
// 新增一条博客
router.post('/insertBlog',async (req,res)=>{
    let arrop = new blogall(req.body)
    await arrop.save()
        .then(blogList=>{
            res.send('添加成功')
        })
})
// 一条删除
router.post('/dellBlog',async (req,res)=>{
    let arrop = req.body.id;
    await blogall.deleteOne({_id:arrop})
        .then(blogList=>{
            res.send(blogList)
        })
})
// 批量删除
router.post('/dellBatchBlog',async (req,res)=>{
    let arrop = req.body.idArr;
    await blogall.remove({_id:{ $in: arrop }})
        .then(blogList=>{
            res.send('批量删除成功')
        })
})
const multer = require('multer')
const upload = multer({dest: __dirname + '/../uploads'})
router.post('/upload',upload.single('file'),async (req,res)=>{

    const file = req.file;
    file.url = `http://www.bxwblog.cn/uploads/${file.filename}`
    res.status(200).send({status:200,data:{url:file.url,pp:file }})
})

router.post("/uploadImg",  async (req, res) => {
    console.log(req)
    await uploadImg(req, res);
})

// 获取标签列表
router.get('/queryAllTags',async (req,res)=>{
    await tags.find()
        .then(data=>{
            if(data.length>0){
                res.send(data)
            }
            res.end();
        })
        .catch(err=>{
            console.log(err)
        })
})
// 新增一个标签
router.post('/insertTags',async (req,res)=>{
    let arrop = new tags(req.body)
    await arrop.save()
        .then(blogList=>{
            res.send('添加成功')
        })
})
// 标签一条删除
router.post('/dellTags',async (req,res)=>{
    let arrop = req.body.id;
    await tags.deleteOne({_id:arrop})
        .then(data=>{
            res.send(data)
        })
})
// 标签批量删除
router.post('/dellBatchTags',async (req,res)=>{
    let arrop = req.body.idArr;
    await tags.remove({_id:{ $in: arrop }})
        .then(blogList=>{
            res.send('批量删除成功')
        })
})
// 更新一个标签
router.post('/updateOneTags',async (req,res)=>{
    let info = req.body;
    console.log('这是查询的id：',info)
    await tags.updateOne({_id:info.id},{$set:{tag:info.tag,uptime:info.uptime}})
        .then(data=>{
            if(data.nModified!=0){
                res.send(data)
            }
            else{
                // res.send(402,'更新失败')
                res.status(404).send('更新失败')
            }
            // res.send(blogList)
            res.end();
        })
        .catch(err=>{
            console.log(err)
        })
})


//每条文章的浏览量
router.post('/viewsNum',async (req,res)=>{
    let info = req.body;
    let blogId = req.body.id;
    await blogall.find({_id:blogId})
        .then(data=>{
            let newViews = data[0].views+1;
            blogall.updateOne({_id:blogId},{$set:{views:newViews}})
                .then(blogList=>{
                    res.send('更新成功')
                })
        })
})
//按照浏览数倒序查询
router.get('/viewsSort',async (req,res)=>{
    await blogall.find().sort({views:-1})
        .then(data=>{
            if(data.length>0){
                res.send(data)
            }
            // res.end();
        })
        .catch(err=>{
            console.log(err)
        })
})
//通过标签查询博客
router.post('/tagsFind',async (req,res)=>{
    let info = new RegExp(req.body.tags);
    await blogall.find({tags:/info/})
        .then(data=>{
            if(data.length>0){
                res.send(data)
            }
            // res.end();
        })
        .catch(err=>{
            console.log(err)
        })
})

//通过标签Id查询标签信息
router.post('/tagsByIdInfo',async (req,res)=>{
    let info = new RegExp(req.body.tagId);
    let blogId = req.body.tagId
    await tags.find({_id:blogId})
        .then(data=>{

            if(data.length>0){
                res.send(data)
            }
            res.end();
        })
        .catch(err=>{
            console.log(err)
        })
})


// 新增一条评论
router.post('/addComment',async (req,res)=>{
    let aa = {
        ...req.body,
        ctime:new Date()
    }
    let arrop = new comments(aa)
    await arrop.save()
        .then(blogList=>{
            res.send({
                massage:'添加成功',
                status:1,
            })
        })
})

// 根据博客id获取评论列表
router.post('/queryAllCommentByBlogId',async (req,res)=>{
    let blogIdBox = req.body.blogId
    await comments.find({blog_id:blogIdBox}).sort({ctime:-1})
        .then(item=>{
            if(item.length>0){
                let arrComments = []
               item.forEach((itemBox,index)=>{
                    if(!itemBox.parent){
                        arrComments.push(itemBox)
                    }
                })
                arrComments.forEach((pp)=>{
                    item.forEach((aa)=>{
                        if(aa.root_id==pp._id){
                            pp.childre.unshift(aa)
                        }
                    })
                })
                res.send({
                    massage:'查询成功',
                    status:1,
                    rows:arrComments,
                    pp:arrComments,
                    cont:item.length
                })
            }
            res.end();
        })
        .catch(err=>{
            console.log(err)
        })
})
// 获取所有评论列表
router.get('/queryAllComment',async (req,res)=>{
    // let blogIdBox = req.body.blogId;
    let bodyInfo = {
        pageSize:req.query.pageSize,
        pageIndex:(parseInt(req.query.pageIndex)-1)*(req.query.pageSize)
    }
    let count = '';
    await comments.find().count().then(item=>{
        count=item;
    })
    await comments.find().sort({ctime:-1}).limit(parseInt(bodyInfo.pageSize)).skip(parseInt(bodyInfo.pageIndex))
        .then(item=>{
            if(item.length>0){
                let arrComments = []
                res.send({
                    massage:'查询成功',
                    status:1,
                    rows:item,
                    cont:count
                })
            }
            // res.send(blogList)
            res.end();
        })
        .catch(err=>{
            console.log(err)
        })
})

const captcha = require('svg-captcha');
//生成验证码
router.post('/queryCode', (req,res)=>{
    const cap = captcha.createMathExpr({fontSize:50, width:100, height:34});
    // req.session.captcha = cap.text; // session 存储
    res.type('svg'); // 响应的类型
    res.send({
        aa:cap.data,
        text:cap.text
    });
})

// 新增一个banner
router.post('/addBanner',async (req,res)=>{
    let dataArr = {
        ...req.body,
        ctime:new Date()
    }
    let arrop = new banners(dataArr)
    await arrop.save()
        .then(blogList=>{
            res.send({
                massage:'添加成功',
                status:1,
            })
        })
})
// 获取banner列表
router.get('/queryAllBanner',async (req,res)=>{
    await banners.find().sort({ctime:-1})
        .then(item=>{
            if(item.length>0){
                let arrComments = []
                res.send({
                    massage:'查询成功',
                    status:1,
                    rows:item,
                })
            }else{
                res.send({
                    massage:'0条banner信息',
                    status:2,
                    rows:[],
                })
            }
            // res.send(blogList)
            res.end();
        })
        .catch(err=>{
            console.log(err)
        })
})
// 获取banner列表
router.get('/queryAllBannerIsTrue',async (req,res)=>{
    await banners.find({isStart:true}).sort({ctime:-1})
        .then(item=>{
            if(item.length>0){
                let arrComments = []
                res.send({
                    massage:'查询成功',
                    status:1,
                    rows:item,
                })
            }else{
                res.send({
                    massage:'0条banner信息',
                    status:2,
                    rows:[],
                })
            }
            // res.send(blogList)
            res.end();
        })
        .catch(err=>{
            console.log(err)
        })
})
// 一条删除
router.post('/dellBanner',async (req,res)=>{
    let arrop = req.body.id;
    await banners.deleteOne({_id:arrop})
        .then(blogList=>{
            res.send(blogList)
        })
})
// 更新一个banner
router.post('/updateOneBanner',async (req,res)=>{
    let info = req.body;
    await banners.updateOne({_id:info.id},{title:info.title,bannerImg:info.bannerImg,bannerImgName:info.bannerImgName,content:info.content,isStart:info.isStart,region:info.region})
        .then(data=>{
            if(data.nModified!=0){
                res.send(data)
            }
            else{
                // res.send(402,'更新失败')
                res.status(404).send('更新失败')
            }
            // res.send(blogList)
            res.end();
        })
        .catch(err=>{
            console.log(err)
        })
})

// 新增一个友情链接
// router.post('/addLink',async (req,res)=>{
//     console.log('传来信息',req.body)
//     let dataArr = {
//         ...req.body,
//         ctime:new Date()
//     }
//     let arrop = new banners(dataArr)
//     await arrop.save()
//         .then(blogList=>{
//             console.log('添加时返回的值：',blogList)
//             res.send({
//                 massage:'添加成功',
//                 status:1,
//             })
//         })
// })
// 一条删除友情链接
router.post('/dellLink',async (req,res)=>{
    let arrop = req.body.id;
    await links.deleteOne({_id:arrop})
        .then(blogList=>{
            res.send(blogList)
        })
    console.log(444)
})
// 获取友情链接列表
router.get('/queryAllLink',async (req,res)=>{
    await links.find().sort({ctime:-1})
        .then(item=>{
            if(item.length>0){
                let arrComments = []
                res.send({
                    massage:'查询成功',
                    status:1,
                    rows:item,
                })
            }else{
                res.send({
                    massage:'0条banner信息',
                    status:2,
                    rows:[],
                })
            }
            // res.send(blogList)
            res.end();
        })
        .catch(err=>{
            console.log(err)
        })
})

//友情链接
router.post('/addLink', async(req,res)=>{
    let linkDetail = {
        ...req.body,
        codeType:0,
        ctime:new Date()
    }
    let arrop = new links(linkDetail)
    await arrop.save()
        .then(blogList=>{
            res.send({
                massage:'添加成功',
                status:1,
            })
        })
})
//友情链接已通过
router.get('/queryAllLinkPass',async (req,res)=>{
    await links.find({codeType:1}).sort({ctime:-1})
        .then(item=>{
            if(item.length>0){
                let arrComments = []
                res.send({
                    massage:'查询成功',
                    status:1,
                    rows:item,
                })
            }else{
                res.send({
                    massage:'0条banner信息',
                    status:2,
                    rows:[],
                })
            }
            // res.send(blogList)
            res.end();
        })
        .catch(err=>{
            console.log(err)
        })
})
// 审核友情链接
router.post('/updateOneLink',async (req,res)=>{
    let info = req.body;
    await links.updateOne({_id:info.id},{$set:{codeType:info.codeType}})
        .then(data=>{
            if(data.nModified!=0){
                res.send(data)
            }
            else{
                res.status(404).send('更新失败')
            }
            // res.send(blogList)
            res.end();
        })
        .catch(err=>{
            console.log(err)
        })
})

// 获取用户列表
router.get('/queryAllUser',async (req,res)=>{
    await user.find().sort({ctime:-1})
        .then(item=>{
            if(item.length>0){
                let arrComments = []
                res.send({
                    massage:'查询成功',
                    status:1,
                    rows:item,
                })
            }else{
                res.send({
                    massage:'0条banner信息',
                    status:2,
                    rows:[],
                })
            }
            // res.send(blogList)
            res.end();
        })
        .catch(err=>{
            console.log(err)
        })
})
// 新增一个用户
router.post('/addUser',async (req,res)=>{
    let dataArr = {
        ...req.body,
        ctime:new Date(),
        password:'123456',
    }
    let arrop = new user(dataArr)
    await arrop.save()
        .then(blogList=>{
            res.send({
                massage:'添加成功',
                status:1,
            })
        })
})
//删除用户
router.post('/dellUser',async (req,res)=>{
    let arrop = req.body.id;
    await user.deleteOne({_id:arrop})
        .then(blogList=>{
            res.send(blogList)
        })
})


// 修改密码
router.post('/updatePassword',async (req,res)=>{
    let info = req.body;
    await user.updateOne({_id:info.id},{password:info.password})
        .then(data=>{
            if(data.nModified!=0){
                res.status(200).send({message:'修改成功',status:1})
            }
            else{
                res.status(404).send('更新失败')
            }
            res.end();
        })
})
// 用户登录
router.post('/login',async (req,res)=>{
    let info = req.body;
    await user.find({username:info.userName})
        .then(data=>{
                if(data.length>0){
                let backData = data[0]
                const isValidPassword = bcrypt.compareSync(info.password, backData.password);
                if(isValidPassword) {
                    // 设置token
                    const rule = {
                        id: String(backData._id),
                        email: backData.email,
                        username: backData.username,
                        phone: backData.phone,
                    };
                    jwt.sign(rule, jwt_key, {expiresIn:'1h'}, (err, token) =>{
                        if(err){
                            return res.status(500).json({status:"500",result:"未知错误"});
                        }else{
                           res.status(200).send({
                                message:'登录成功',
                                status:1,
                                rows:{
                                    userName:backData.username,
                                    email:backData.email,
                                    phone:backData.phone,
                                    token:'Bearer ' + token
                                }
                            })
                        }
                    })

                }else{
                    res.status(200).send({message:'密码错误',status:2})
                }
            }else{
                res.status(200).send({message:'没有此用户',status:3})
            }

            // res.end();
        }).catch(err=> {
            console.log(err)
            res.status(404).send('登录失败')
        })
})


//过期处理
router.get('/auth', (req, res, next) => {

    let header = req.headers;
    let rawToken = header.authorization;
    if(rawToken==undefined){
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json({success: true, status: '1001',magess:'用户未登陆请登录'});
        return ;
    }
    if (!rawToken.split(' ').length) {
        res.json({ // 统一的数据结构方便前端使用
            code: 403,
            data: {},
            message: 'error for get token'
        })
    } else {
        let token = rawToken.split(' ')[1]
        jwt.verify(token, jwt_key, err => { // 这里用到jsonwebtoken/config。注意引用
            switch (err.name) {
                case 'TokenExpiredError':
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'application/json')
                    res.json({success: true, status: '1001',magess:'token已过期需要从新登录'})
                    break
                case 'NotBeforeError':
                    // let payload = jwt.decode(token)
                    // console.log('ppp',payload)
                    // token = authenticate.getToken({_id: payload._id})
                    // res.statusCode = 200
                    // res.setHeader('Content-Type', 'application/json')
                    // res.json({success: true, token: token, status: '已经刷新token'})
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'application/json')
                    res.json({success: true, token: token, status: '402',magess:'与服务器时间不符'})
                    break
                case 'JsonWebTokenError':
                default:
                    res.statusCode = 401
                    res.json({
                        code: 401,
                        data: {
                            error: err
                        },
                        message: 'token错误'
                    })
                    break
            }
        })
    }
})

// 获取访问数
router.get('/queryAllAccess',async (req,res)=>{
    await access.find()
        .then(data=>{
            if(data.length>0){
                res.send(data)
            }
            res.end();
        })
        .catch(err=>{
            console.log(err)
        })
})
// 新增一个访问数
router.post('/insertAccess',async (req,res)=>{
    let arrop = new access(req.body)
    await arrop.save()
        .then(blogList=>{
            res.send('添加成功')
        })
})
// 更新一个访问数
router.post('/updateOneAccess',async (req,res)=>{
    let info = req.body;
    console.log('这是查询的id：',info)
    await access.updateOne({_id:info._id},{$set:{count:info.count}})
        .then(data=>{
            console.log(data)
            if(data.nModified!=0){
                res.send(data)
            }
            else{
                // res.send(402,'更新失败')
                res.status(404).send('更新失败')
            }
            // res.send(blogList)
            res.end();
        })
        .catch(err=>{
            console.log(err)
        })
})
router.get('/isPass',passport.authenticate("jwt", {session: false,failureRedirect: '/api/web/auth' }),async (req,res)=>{
    res.send({
        massage:'通过',
        status:1,
    })
})


module.exports = router;
