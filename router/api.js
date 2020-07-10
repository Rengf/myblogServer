var express = require("express");
var router = express.Router();
// var multipart = require('connect-multiparty');
// var multipartMiddleware = multipart();
// var fs = require('fs');
// var path = require('path');

var svgCaptcha = require("svg-captcha");

//验证码生成
router.get("/getcaptcha", (req, res, next) => {
    var codeConfig = {
        size: 5, // 验证码长度
        ignoreChars: "0o1i", // 验证码字符中排除 0o1i
        noise: 2, // 干扰线条的数量
        height: 44
    };
    var captcha = svgCaptcha.create(codeConfig);
    req.session.captcha = captcha.text.toLowerCase(); //存session用于验证接口获取文字码
    var codeData = {
        img: captcha.data
    };
    return res.json({
        code: 0,
        result: codeData,
        message: "验证码"
    });
});

module.exports = router;