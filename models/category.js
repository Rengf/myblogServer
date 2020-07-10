var mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/myblog", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
var Schema = mongoose.Schema;

var categorySchema = new Schema({
    category_name: {
        type: String,
        required: true
    },
    category_content: {
        type: String,
        required: true
    },
    category_time: {
        type: Date,
        default: new Date()
    },
    category_count: {
        type: Number,
        default: 0,
    }
});

module.exports = mongoose.model("Category", categorySchema);