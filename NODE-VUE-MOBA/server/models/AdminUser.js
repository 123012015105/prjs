const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: {
        type: String
    },
    password: {
        type: String,
        // 这个字段表示，数据库查询的时候不查该字段，，而且如果密码为空则不会被散列，
        // 当这个字段为true的时候，编辑管理员，密码即使不修改也是重新被散列之后的字符串，
        // 现在不设置为false，界面上级有显示密码字段的表单也是空值，空值不会被散列
        select: false,
        // 这里做密码的散列加密,bcyrpt的散列是不可逆的，md5加密是可逆的
        // set表示一填入就做散列操作,范围一般在10-12之间
        // 这里了使用同步散列
        set(val) {

                return require('bcrypt').hashSync(val, 10)
            }
            // $2b$10$Lox.6iT9CpzpoNugOJQcXOvdkYr3mcciD295dhTTVX01ImSaM2INS
            // $2b$10$Ff5uHan5BwHopD9XCRC8xe2pzEyZHRCX2WihgwNPbj8KDGoGAoOWi
    }
})

module.exports = mongoose.model('AdminUser', schema)