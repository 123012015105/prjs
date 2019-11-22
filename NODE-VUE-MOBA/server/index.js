const express = require('express')
const path = require('path')

const app = express()

// *set*表示在当前express实例--app上设置一个变量
app.set('secret', '123456')

// 处理跨域请求
app.use(require('cors')())

// 解决post请求体解析，之前的做法是导入body-parser
app.use(express.json())

// 静态文件托管
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

require('./plugins/db')(app)
require('./routes/admin/index')(app)
require('./routes/web/index')(app)

app.listen(3000, () => {
    console.log('http://localhost:3000')
})