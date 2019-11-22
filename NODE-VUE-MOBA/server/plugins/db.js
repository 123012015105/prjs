module.exports = db => {
  const mongoose = require('mongoose')
  mongoose.connect('mongodb://127.0.0.1:27017/node-vue-moba', {
      useNewUrlParser: true
  })

  // 把某一个文件夹下面的所有文件都引用进来，没有做任何操作
  require('require-all')(__dirname + '/../models')

}