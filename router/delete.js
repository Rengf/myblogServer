var express = require("express");
var router = express.Router();

var User = require("../models/user.js");

//删除用户
router.post("/deleteuser", (req, res, next) => {
    var _id = req.body.id;
    User.deleteOne({
        _id: _id
    }).then(function(data, err) {
        if (err) {
            return res.json({
                code: 1,
                message: "服务端发送错误"
            });
        }
        res.json({
            code: 0,
            message: "删除成功!"
        });
    });
});

module.exports = router;