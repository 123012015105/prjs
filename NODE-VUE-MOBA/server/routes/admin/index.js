module.exports = app => {
    const express = require('express')
    const path = require('path')
    const router = express.Router({
        mergeParams: true // 表示合并url参数
    })
    const jwt = require('jsonwebtoken')
    const AdminUser = require('../../models/AdminUser')
    const assert = require('http-assert')

    // 登录校验授权中间件
    const authMiddleWare = require('../../middleware/auth')

    // 获取资源名称中间件
    const resourceMiddleWare = require('../../middleware/resource')

    router.post('/', async(req, res) => {
        const model = await req.Model.create(req.body)
        res.send(model)
    })

    router.put('/:id', async(req, res) => {
        const model = await req.Model.findByIdAndUpdate(req.params.id, req.body)
        res.send(model)
    })

    // 资源列表
    router.get('/', async(req, res) => {

        // 所有的通用接口都需要做这样的处理，所以我们把他设置成为一个中间件，
        // 即先对请求的路径做一下inflection处理，在执行下面的操作
        // 所以我们把这段代码直接放在app.use('/admin/api/rest/:resource', router)这里面，具体在最下面
        // const modelName = infelction.classify(req.params.resource)
        // const Model = require(`../../models/${modelName}`)

        // 关联字段：在model模型中有设置“ref”字段的属性值
        // populate根据关联字段查询处一个完整的对象
        // populate:表示具有关联字段的对象，因为这里要求查询到的结果不只是一个字段，而是一个对象

        // 这里的查询字段parent并不是所有的模型都会使用到，所以在这里加一个判断  ，判断拿到的模型是否是Category
        const queryOptions = {}
        if (req.Model.modelName === 'Category') {
            queryOptions.populate = 'parent'
        }
        const model = await req.Model.find().setOptions(queryOptions).limit(100)
        res.send(model)
    })

    router.get('/:id', async(req, res) => {
        const model = await req.Model.findById(req.params.id)
        res.send(model)
    })

    router.delete('/:id', async(req, res) => {
        const model = await req.Model.findByIdAndDelete(req.params.id)
        res.send({
            success: true
        })
    })

    // 这个路径是为了构建一套通用的接口，动态获取模型值，这里的resource ，通过inflection将其转换成类名格式后就得到对应的模型名称，这个是设计的规范
    app.use('/admin/api/rest/:resource', authMiddleWare(), resourceMiddleWare(), router)

    const multer = require('multer')
    const upload = multer({ dest: path.join(__dirname, '/../../uploads') })
    app.post('/admin/api/upload', authMiddleWare(), upload.single('file'), async(req, res, next) => {
        // upload.single('file')  这一操作把file资源挂在到req上。可以通过req.file使用
        const file = req.file
        file.url = `http://localhost:3000/uploads/${file.filename}`
        res.send(file)
    })

    // 获取用户名
    router.get('/admin/api/main/:id', async(req, res) => {
        const model = await AdminUser.findById(req.params.id)
        console.log('server', model)
        res.send(model)
    })

    app.post('/admin/api/login', async(req, res) => {

        const { name, password } = req.body

        // 实现用户登陆的步骤：
        // 1、根据用户名找用户
        const user = await AdminUser.findOne({ name }).select('+password')

        // 校验用户名
        assert(user, 422, '用户不存在')
            // if (!user) {
            //     return res.status(422).send({
            //         message: "用户不存在"
            //     })
            // }

        // 2、校验密码
        let isValide = require('bcrypt').compareSync(password, user.password)
        assert(isValide, 422, '密码输入错误')
            // if (!isValide) {
            //     return res.status(422).send({
            //         message: '密码输入错误'
            //     })
            // }

        // 3、返回token
        const token = jwt.sign({ id: user._id, name: user.name }, app.get('secret'))
        res.send({ token, user })
    })

    // 统一错误处理--这里捕获assert抛出的错误处理
    app.use(async(err, req, res, next) => {
        res.status(err.statusCode || 500).send({
            message: err.message
        })
    })
}