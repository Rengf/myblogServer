const jwt = require('jsonwebtoken');
// 创建 token 类
class Jwt {
    constructor(data, key, minute) {
        this.data = data;
        this.keyword = key;
        this.minute = minute || 30
    }
    //生成token
    generateToken() {
        let data = this.data;
        let minute = this.minute
        let keyword = this.keyword
        let created = Math.floor(Date.now() / 1000);
        let exp = created + 60 * minute;
        let cert = "renguofeng"; //私钥 可以自己生成        
        let token = jwt.sign({
            data: {
                'id': data,
                "key": keyword
            },
            exp
        }, cert, {
            algorithm: 'HS256'
        });
        return token;
    }

    // 校验token
    verifyToken() {
        let token = this.data
        let cert = "renguofeng"; //公钥 可以自己生成
        let res;
        try {
            let result = jwt.verify(token, cert, {
                algorithm: ['HS256']
            }) || {};
            let {
                exp = 0
            } = result, current = Math.floor(Date.now() / 1000);
            if (current <= exp) {
                res = result.data || {};
            }
            return res;
        } catch (e) {
            res = 'err';
        }
    }
}

module.exports = Jwt;