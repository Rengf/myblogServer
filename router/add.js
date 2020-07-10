var express = require("express");
var router = express.Router();
var date = require("../public/fmt");
const Category = require("../models/category");
const Article = require("../models/article")

// var multipart = require('connect-multiparty');
// var multipartMiddleware = multipart();
// var fs = require('fs');
// var path = require('path');

//添加文章类别
router.post("/addcategory", (req, res, next) => {
    var cdata = req.body.data;
    var category_time = date("yyyy-MM-dd HH:mm:ss");
    Category.findOne({
            category_name: cdata.category_name
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
                    message: "该类别已经存在！"
                });
            }
            new Category({
                category_name: cdata.category_name,
                category_time: category_time,
                category_content: cdata.category_content
            }).save(function (err) {
                if (err) {
                    return res.json({
                        code: 1,
                        message: "服务端发送错误"
                    });
                }

                res.json({
                    code: 0,
                    message: "添加成功！"
                });
            });
        }
    );
});

//添加文章
router.post("/addarticle", (req, res, next) => {
    var cdata = req.body.data;
    var article_time = date("yyyy-MM-dd HH:mm:ss");
    Article.findOne({
            article_title: cdata.article_title
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
                    code: 0,
                    success: true,
                    message: "该文章已经存在！"
                });
            }
            new Article({
                article_title: cdata.article_title,
                article_time: article_time,
                article_content: cdata.article_content,
                article_category: cdata.category_id,
                status: cdata.status
            }).save(function (err) {
                if (err) {
                    return res.json({
                        code: 1,
                        message: "服务端发送错误"
                    });
                }

                res.json({
                    code: 0,
                    message: "添加文章成功！"
                });
            });
        }
    );
});

module.exports = router;