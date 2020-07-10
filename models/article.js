var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/myblog", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
var Schema = mongoose.Schema;

var articleSchema = new Schema({
    article_title: {
        type: String,
        required: true
    },
    article_category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    article_content: {
        type: String,
        required: true
    },
    article_views: {
        type: Number,
        default: 0
    },
    article_comment_count: {
        type: Number,
        default: 0
    },
    article_time: {
        type: Date,
        default: new Date()
    },
    last_modified_time: {
        type: Date,
        default: new Date()
    },
    article_like_count: {
        type: Number,
        default: 0
    },
    status: {
        type: Number,
        enum: [-1, 0, 1],
        default: 0
    }
});

module.exports = mongoose.model("Article", articleSchema);