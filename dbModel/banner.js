/**
 *
 *  @author: Mr_Wei
 *  @version: 1.0.0
 *  @description: banner模型
 *  @Date: 2019/10/16 11:05
 *
 */

// const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const bannerModel = new mongoose.Schema({
    title:{
        require:true,
        type:String
    },
    bannerImg:{
        require:true,
        type:String,
    },
    bannerImgName:{
        require:true,
        type:String,
    },
    content:{
        require:true,
        type:String
    },
    isStart:{
        require:true,
        type:Boolean,
    },
    region:{
        require:true,
        type:String,
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

module.exports = mongoose.model("banners", bannerModel)
