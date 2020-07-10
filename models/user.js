var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/myblog", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
var Schema = mongoose.Schema;

var userSchema = new Schema({
    user_name: {
        type: String,
        default: "新用户"
    },
    user_tel: {
        type: String,
        required: true
    },
    user_email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    registed_time: {
        type: Date,
        default: new Date()
    },
    last_modified_time: {
        type: Date,
        default: new Date()
    },
    avatar: {
        type: String,
        default: "../../static/image/timg.jpg"
    },
    is_admin: {
        type: Number,
        enum: [0, 1, 2],
        default: 0
    },
    last_logined_time: {
        type: Date,
        default: new Date()
    },
    bio: {
        type: String,
        default: ""
    },
    gender: {
        type: Number,
        enum: [-1, 0, 1],
        default: -1
    },
    birthday: {
        type: Date,
        default: new Date()
    },
    status: {
        type: Number,
        enum: [0, 1, 2],
        default: 0
    },
});

module.exports = mongoose.model("User", userSchema);