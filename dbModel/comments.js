/**
 *
 *  @author: Mr_Wei
 *  @version: 1.0.0
 *  @description: 博客回复留言
 *  @Date: 2019/10/16 11:05
 *
 */

// const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const commentsModel = new mongoose.Schema({
    blog_id:{
        require:true,
        type:String
    },
    root_id:{
        require:true,
        type:String
    },
    childre:{
        type:Array
    },
    parent:{
        require:true,
        type:String
    },
    parentname:{
        require:true,
        type:String,
    },
    user_name:{
        require:true,
        type:String
    },
    comments:{
        require:true,
        type:String,
    },
    email:{
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

module.exports = mongoose.model("comments", commentsModel)
