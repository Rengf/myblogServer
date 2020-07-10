var express = require("express");
var md5 = require("md5");
var router = express.Router();
var User = require("../models/user.js");
var date = require("../public/fmt");
var Jwt = require("../public/jwt")

/*  判断是否登录  */
router.get("/", function (req, res, next) {
    var data = req.query.data;
    var jwt = new Jwt(data);
    var user_data = jwt.verifyToken()
    var id = user_data.id;

    User.findById(id, {
        password: 0
    }, function (err, data) {
        if (err) {
            return res.json({
                code: 1,
                message: err.message
            });
        }
        if (!data) {
            return res.json({
                code: 1,
                message: "该用户不存在！"
            });
        }
    }).then(function (data, err) {
        if (err) {
            return res.json({
                code: 1,
                message: "服务端发送错误"
            });
        }
        res.json({
            code: 0,
            message: "获取成功！",
            data: data
        });
    })
});

//登录
router.post("/login", function (req, res) {
    var userdata = req.body.data;
    var user_name = userdata.user_name;
    var password = userdata.password;
    // var captcha = userdata.captchatext;
    var last_logined_time = date("yyyy-MM-dd HH:mm:ss");
    if (user_name == "" || password == "") {
        return res.json({
            code: 1,
            message: "信息不能为空！"
        });
    } else {
        User.findOne({
                $or: [{
                    user_tel: user_name,
                    password: md5(md5(password + "myblog") + "myblog")
                }, {
                    user_email: user_name,
                    password: md5(md5(password + "myblog") + "myblog")
                }, {
                    user_name: user_name,
                    password: md5(md5(password + "myblog") + "myblog")
                }]
            },
            function (err, user) {
                if (err) {
                    return res.json({
                        code: 1,
                        message: err.message
                    });
                }
                if (!user) {
                    return res.json({
                        code: 1,
                        message: "电话号码或密码错误！"
                    });
                }
            }
        ).then(function (data, err) {
            var jwt = new Jwt(data._id, "rgf", 60);
            var token = jwt.generateToken();
            User.updateOne({
                _id: data._id
            }, {
                last_logined_time: last_logined_time
            }).then(function (data, err) {
                if (err) {
                    return res.json({
                        code: 1,
                        message: "服务端发送错误"
                    });
                }
                res.json({
                    code: 0,
                    message: "登录成功！",
                    token: token
                });
            });
        });
    }
});

//注册
router.post("/register", function (req, res) {
    var userdata = req.body.data;
    var user_tel = userdata.user_tel;
    var password = userdata.password;
    var user_email = userdata.user_email;
    // var captcha = userdata.captchatext;
    var registed_time = date("yyyy-MM-dd HH:mm:ss");
    if (user_tel == "" || password == "" || user_email == "") {
        return res.json({
            code: 1,
            message: "信息不能为空！"
        });
    } else {
        User.findOne({
                $or: [{
                        user_tel: user_tel
                    },
                    {
                        user_email: user_email
                    }
                ]
            },
            function (err, data) {
                if (err) {
                    return res.json({
                        code: 1,
                        message: "服务端发送错误！"
                    });
                }
                if (data) {
                    return res.json({
                        success: true,
                        message: "邮箱或电话已注册！"
                    });
                }
                new User({
                    user_tel: user_tel,
                    user_email: user_email,
                    password: md5(md5(password + "myblog") + "myblog"),
                    nickname: user_tel,
                    registed_time: registed_time
                }).save(function (err, user) {
                    if (err) {
                        return res.json({
                            code: 1,
                            message: "服务端发送错误"
                        });
                    }

                    res.json({
                        code: 0,
                        message: "注册成功！",
                    });
                });
            }
        );
    }
});

//退出登录
router.get("/logout", function (req, res) {
    req.session.user = null;
    res.status(200).json({
        code: 200,
        message: "退出成功"
    });
});
module.exports = router;