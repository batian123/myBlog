/**
 *
 *  @author: Mr_Wei
 *  @version: 1.0.0
 *  @description: 数据库的搭建
 *  @Date: 2019/10/14 17:51
 *
 */

const mongoose = require("mongoose");
// const mongodbURI = require("../secret/mongodbURI").mongodbURI;

mongoose.connect('mongodb://localhost:27017/My_blog', {
    useNewUrlParser:true,
    useFindAndModify:false,
    useUnifiedTopology: true
}).then(() => {
    console.log(`Mongodb is Connected.Please have a great coding.`);
})
