var express = require("express");
var router = express.Router();
var User = require("../models/user");
var Category = require("../models/category");

var Article = require("../models/article")


/**获取用户列表 */
router.post("/getuserlist", function (req, res) {
    var cdata = req.body.data;
    var page = cdata.page;
    var limit = cdata.limit;
    var is_admin = cdata.is_admin;
    var searchCondition = {};
    if (is_admin > -1) {
        searchCondition.is_admin = is_admin
    }
    var count = 0;
    User.find(searchCondition)
        .countDocuments()
        .then(function (data) {
            count = data;
        });

    User.find(searchCondition, {
            password: 0
        })
        .sort({
            created_time: -1
        })
        .skip((page - 1) * limit)
        .limit(limit)
        .then(function (userlist) {
            if (!userlist) {
                res.json({
                    code: 1,
                    message: "服务器发生错误"
                });
            } else {
                res.json({
                    code: 0,
                    message: "获取成功",
                    data: {
                        userlist,
                        count: count
                    }
                });
            }
        });
});

//获取文章类别列表
router.post("/getcategorylist", function (req, res) {
    var count = 0;
    Category.find()
        .countDocuments()
        .then(function (data) {
            count = data;
        });
    Category.find()
        .sort({
            created_time: -1
        })
        .then(function (categorylist) {
            if (!categorylist) {
                res.json({
                    code: 1,
                    message: "服务器发生错误"
                });
            } else {
                res.json({
                    code: 0,
                    message: "获取成功",
                    data: {
                        categorylist,
                        count: count
                    }
                });
            }
        });
});

//获取文章列表
router.post("/getarticlelist", function (req, res) {
    var cdata = req.body.data;
    var limit = cdata.limit;
    var page = cdata.page;
    var status = cdata.status;
    var article_category = cdata.article_category
    var count = 0;
    var searchCondition = {}
    if (status >= -1) {
        searchCondition.status = status
    }
    if (article_category) {
        searchCondition.article_category = article_category
    }
    Article.find(searchCondition)
        .countDocuments()
        .then(function (data) {
            count = data;
        });
    Article.find(searchCondition).populate('article_category', {
            category_name: 1,
            _id: 1
        }).sort({
            article_time: -1
        }).skip((page - 1) * limit).limit(limit)
        .then(function (articlelist) {
            if (!articlelist) {
                res.json({
                    code: 1,
                    message: "服务器发生错误"
                });
            } else {
                res.json({
                    code: 0,
                    message: "获取成功",
                    data: {
                        articlelist,
                        count: count
                    }
                });
            }
        });
});

//获取最新文章列表
router.get("/getnewarticlelist", function (req, res) {

    Article.find({
            status: 1
        }, {
            article_title: 1,
        }).sort({
            article_time: -1
        }).skip(0).limit(5)
        .then(function (newarticlelist) {
            if (!newarticlelist) {
                res.json({
                    code: 1,
                    message: "服务器发生错误"
                });
            } else {

                res.json({
                    code: 0,
                    message: "获取成功",
                    data: {
                        newarticlelist: newarticlelist,
                    }
                });
            }
        });
});

//获取文章
router.get("/getarticle", function (req, res) {
    var cdata = req.query;
    var id = cdata.id;
    Article.findById(id).populate('article_category', {
        category_name: 1,
        _id: 1
    }).then(function (article) {
        if (!article) {
            res.json({
                code: 1,
                message: "服务器发生错误"
            });
        } else {
            res.json({
                code: 0,
                message: "获取成功",
                data: {
                    article
                }
            });
        }
    });
});

//获取类别
router.get("/getcategory", function (req, res) {
    var cdata = req.query;
    var id = cdata.id;
    Category.findById(id).then(function (category) {
        if (!category) {
            res.json({
                code: 1,
                message: "服务器发生错误"
            });
        } else {
            res.json({
                code: 0,
                message: "获取成功",
                data: {
                    category
                }
            });
        }
    });
});

module.exports = router;