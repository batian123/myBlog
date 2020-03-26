/**
 *
 *  @author: Mr_Wei
 *  @version: 1.0.0
 *  @description: 博客标签关联模型
 *  @Date: 2019/10/16 11:05
 *
 */

// const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const tagBlogIdModel = new mongoose.Schema({
    tag_id:{
        require:true,
        type:String
    },
    blog_id:{
        require:true,
        type:String
    },
    ctime:{
        require:true,
        type:Date,
        default: Date.now
    },
    uptime:{
        require:true,
        type:Date,
        default: Date.now
    }
})

module.exports = mongoose.model("tagBlogId", tagBlogIdModel)
