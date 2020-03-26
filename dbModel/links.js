/**
 *
 *  @author: Mr_Wei
 *  @version: 1.0.0
 *  @description: 友情链接模型
 *  @Date: 2019/10/16 11:05
 *
 */

// const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const linkModel = new mongoose.Schema({
    nickname:{
        require:true,
        type:String
    },
    email:{
        require:true,
        type:String
    },
    webName:{
        require:true,
        type:String,
    },
    wenLink:{
        require:true,
        type:String,
    },
    linkType:{
        require:true,
        type:String,
    },
    remark:{
        require:true,
        type:String,
    },
    codeType:{
        require:true,
        type:String,
    },
    ctime:{
        require:true,
        type:Date,
        default: Date.now
    }
})

module.exports = mongoose.model("links", linkModel)
