const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    title: {
        type: String
    },
    categories: [{
        type: mongoose.SchemaTypes.ObjectId, // 这里不使用String，而是mongoose。SchemaTypes.ObjectId表示这个字段是mongodb数据库里面的id,
        ref: 'Category' // 表示关联时的一个模型，这样的目的是为了，之后涉及到关联查询这个分类的父级分类时，可以知道要查询的模型是哪个
    }],
    body: {
        type: String
    }
},{
    timestamps: true
})

module.exports = mongoose.model('Article', schema)