var express = require('express');
var router = express.Router();
const UserController = require('../controller/userController');

/* 登入 */
router.post('/sign-in', function(req, res, next) {
    /**
      * #swagger.tags = ['Sign-in']
      * #swagger.summary = '登入'
    */
    /**
    #swagger.parameters['parameter_name'] = {
      in: 'body',
      description: '登入資料',
      schema: {
        $email: 'test@gmail.com',
        $phone: '0912345678',
        $firstName: '王',
        $lastName: '小明',
        "nickName": "Wang",
        $password: 'a1234567',
        "confirmPassword": "a1234567"
      }
    }
    */
  /**
    #swagger.responses[201] = {
      description: '登入成功',
      schema: { $ref: '#/definitions/Sign' }
    }
    #swagger.responses[400] = {
      description: '登入失敗',
      schema: { $ref: '#/definitions/Error' }
    }
    #swagger.responses[404] = {
      description: '無此路由',
      schema: { $ref: '#/definitions/Error' }
    }
    #swagger.responses[500] = {
      description: '系統錯誤',
      schema: { $ref: '#/definitions/Error' }
    }
  */
  const posts = UserController.signUp(req, res, next);
});

module.exports = router;
