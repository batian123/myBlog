/**
 *
 *  @author: Mr_Wei
 *  @version: 1.0.0
 *  @description: 博客文章模型
 *  @Date: 2019/10/16 11:05
 *
 */

// const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const blogModel = new mongoose.Schema({
    title:{
        require:true,
        type:String
    },
    content:{
        require:true,
        type:String
    },
    author:{
        require:true,
        type:String
    },
    views:{
        require:true,
        type:Number,
    },
    tags:{
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
    },
    imgCover:{
        type:String
    },
    imgCoverName:{
        type:String
    },
    abstract:{
        type:String
    }
})

module.exports = mongoose.model("blogall", blogModel,'blogall')
