const express = require('express');
const bodyParser = require("body-parser");
const passport = require("passport");
const app = express();
app.use(passport.initialize());
// 配置
// require("./config/http")(app);   // 跨域
require("./mongodb/mongodb");  // 数据库
require("./tool/passport")(passport);  // 验证token

// 中间件
app.use(express.json());
app.use(bodyParser.urlencoded({extended:false}));
var pp = bodyParser.urlencoded({ extended: false });
app.use(bodyParser.json());
// app.use(passport.initialize());
// app.use(passport.initialize());
// app.use(passport.session());
// console.log(passport)

app.use('/uploads', express.static(__dirname + '/uploads'))

app.use(bodyParser.json());
// app.use(passport.initialize());
app.all("*", (req, res, next) => {
    // res.header('Access-Control-Allow-Credentials',true)
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials',true);
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    if(req.method == 'OPTIONS') {
        res.sendStatus(200); // 让options请求快速返回
    }
    else{
        next();
    }
})


// 路由
const web = require("./api/web");
app.use("/api/web", web);  // 音乐相关路由
// console.log(web);

// 创建服务器







const port = process.env.PORT || 8633;
app.listen(port, err => {
    if(err) throw err;
    console.log(`Server is running on port [${port}].`);

})

