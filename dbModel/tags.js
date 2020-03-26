/**
 *
 *  @author: Mr_Wei
 *  @version: 1.0.0
 *  @description: 标签模型
 *  @Date: 2019/10/16 11:05
 *
 */

// const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const tagsModel = new mongoose.Schema({
    tag:{
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

module.exports = mongoose.model("tags", tagsModel)
