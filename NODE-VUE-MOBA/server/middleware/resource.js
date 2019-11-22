module.exports = options => {
    const inflection = require('inflection')

    return async(req, res, next) => {

        // 这里是一个中间件的处理，先对前面的路径做一下这样的处理，当遇到next()函数的时候，继续执行下面的操作。
        const modelName = inflection.classify(req.params.resource)
            // 这里表示把得到的饿模型名称挂载到 req 对象上面去，这样后续的请求处理中就可以使用上面的req.Model
        req.Model = require(`../models/${modelName}`)
        next()
    }
}