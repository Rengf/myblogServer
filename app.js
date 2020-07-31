var express = require("express");

var bodyParser = require("body-parser");
var session = require("express-session");
var cors = require("cors")
var Cookies = require("cookies");

const Jwt = require("./public/jwt");
var app = express();

app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

app.use(cors())
app.use(bodyParser.json());

var blacklist = ['/user/login', '/user/register', "/search/", ]

app.use(function (req, res, next) {
    var isblack = blacklist.some(val => {
        if (val == req.url.substr(0, val.length)) {
            return val == req.url.substr(0, val.length)
        }
    });

    if (!isblack) {
        let token = req.headers.authorization.substring(6);
        let jwt = new Jwt(token);
        let result = jwt.verifyToken();
        // 如果考验通过就next，否则就返回登陆信息不正确
        if (result == 'err' || result == undefined) {
            return res.json({
                code: -1,
                message: "登陆已过期，请重新登陆！"
            });

        } else {
            next();
        }
    } else {
        next();
    }
});


app.use(
    session({
        secret: "keyboard cat", //增加安全性
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 30 // 设置 session 的有效时间，单位毫秒
        }
    })
);

app.use("/user", require("./router/user"));
// app.use("/api", require("./router/api"));
app.use("/add", require("./router/add"));
app.use("/search", require("./router/search"));
// app.use("/delete", require("./router/delete"));
// app.use("/main", require("./router/main"));

app.listen(3000, function () {
    console.log("app is listening on port 3000.");
});