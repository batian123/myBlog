/**
 *
 *  @author: Mr_Wei
 *  @version: 1.0.0
 *  @description: 标签模型
 *  @Date: 2019/10/16 11:05
 *
 */

const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const userModel = new mongoose.Schema({
    email:{
        require:true,
        type:String
    },
    username:{
        require:true,
        type:String
    },
    phone:{
        require:true,
        type:String
    },
    password:{
        require:true,
        type:String,
        set(val){
            return bcrypt.hashSync(val, 10)
        }
    },
    identity:{
        // require:true,
        type:String
    },
    ctime:{
        require:true,
        type:Date,
        default: Date.now
    },
})

module.exports = mongoose.model("user", userModel)
