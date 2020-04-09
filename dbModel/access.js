/**
 *
 *  @author: Mr_Wei
 *  @version: 1.0.0
 *  @description: 标签模型
 *  @Date: 2019/10/16 11:05
 *
 */

const mongoose = require("mongoose");
const accessModel = new mongoose.Schema({
    count:{
        require:true,
        type:Number
    },
})

module.exports = mongoose.model("access", accessModel)
