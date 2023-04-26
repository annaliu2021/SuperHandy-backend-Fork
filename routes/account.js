var express = require('express')
var router = express.Router()
const User = require('../models/userModel')
const accounts = require('../controller/accountController')

router.get('/profile', async function (req, res, next) {
  req.user = req.user || req.query.uid || '64469189880b866621b40eeb' //'6444b5a30dc68dc4fd63a1ea'
  /**
   * #swagger.tags = ['Account']
   * #swagger.summary = '取得使用者資料概要'
   */
  /**
    #swagger.security=[{"jwt": []}],
    #swagger.parameters['uid'] = {
      in: 'query',
      description: '[dev]如果沒有token，可以用uid取得資料',
      schema: {
        'uid': '64469189880b866621b40eeb'
      }
    },
    #swagger.responses[200] = {
      description: 'OK',
      schema: { 
        "firstName": "John",
        "lastName": "Doe",
        "email": "abc123@gmail.com",
        "avatarPath": "http://"
      }
    }    
    */
  accounts.getProfile(req, res, next)
})
router.get('/info-form', async function (req, res, next) {
  req.user = req.user || req.query.uid || '64469189880b866621b40eeb' //'6444b5a30dc68dc4fd63a1ea'
  /**
   * #swagger.tags = ['Account']
   * #swagger.summary = '取得使用者表單資料'
   */
  /**
    #swagger.security=[{"jwt": []}],
    #swagger.parameters['uid'] = {
      in: 'query',
      description: '[dev]如果沒有token，可以用uid取得資料',
      schema: {
        'uid': '64469189880b866621b40eeb'
      }
    },
    #swagger.responses[200] = {
      description: 'OK',
      schema: {
        '_id':'uhf8vufbv88fv8hf8v',
        'nickName': 'Erik',
        'email': 'erik@gmail.com'
        'phone': '0912345678',
        'address': '台北市',
        'posterIntro': '我是海報人',
        'helperIntro': '我是幫手人',
        'updatedAt': '2021-05-20T08:00:00.000Z'
      }
    }    
    */
  accounts.getInfoForm(req, res, next)
})
router.patch('/info-form', async function (req, res, next) {
  req.user = req.user || req.query.uid || '64469189880b866621b40eeb' //'6444b5a30dc68dc4fd63a1ea'
  /**
   * #swagger.tags = ['Account']
   * #swagger.summary = '更新使用者表單資料'
   */
  /**
    #swagger.security=[{"jwt": []}],
    #swagger.parameters['uid'] = {
      in: 'query',
      description: '[dev]如果沒有token，可以用uid取得資料',
      schema: {
        'uid': '64469189880b866621b40eeb'
      }
    },
    #swagger.parameters['parameter_name'] = {
      in: 'body',
      description: '可僅更新部分欄位',
      schema: {
        'nickName': 'Erik',
        'phone': '0912345678',
        'address': '台北市',
        'posterIntro': '我是海報人',
        'helperIntro': '我是幫手人'
      }
    }
    #swagger.responses[200] = {
      description: 'OK',
      schema: {
        '_id':'uhf8vufbv88fv8hf8v',
        'nickName': 'Erik',
        'email': 'erik@gmail.com'
        'phone': '0912345678',
        'address': '台北市',
        'posterIntro': '我是海報人',
        'helperIntro': '我是幫手人',
        'updatedAt': '2021-05-20T08:00:00.000Z'
      }
    }    
    */
  accounts.updateInfoForm(req, res, next)
})

router.post('/testSignup', async function (req, res, next) {
  /**
   * #swagger.tags = ['Dev']
   * #swagger.summary = 'dev 註冊user帳號'
   */
  /**
  #swagger.parameters['parameter_name'] = {
    in: 'body',
    description: 'nickName is optional, while all the others are required.',
    schema: {
      $account: 'test@gmail.com',
      $password: 'a1234567'
    }
  }
  */
  try {
    const newUser = await User.create(req.body)
    res.status(200).json({
      newUser
    })
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errorObj = {}
      const { errors } = err
      Object.keys(errors).forEach((col) => (errorObj[col] = errors[col].message))
      return res.status(400).json({
        message: 'Validation Error',
        errorObj
      })
    }
    next(err)
  }
})
router.get('/testFindAllUser', async function (req, res, next) {
  /**
   * #swagger.tags = ['Dev']
   * #swagger.summary = 'dev 取得所有user帳號'
   */
  console.log('check point req.body', req.body)
  try {
    const allUser = await User.find({}, '_id, lastName,firstName, email, password')
    res.status(200).json({
      allUser
    })
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errorObj = {}
      const { errors } = err
      Object.keys(errors).forEach((col) => (errorObj[col] = errors[col].message))
      return res.status(400).json({
        message: 'Validation Error',
        errorObj
      })
    }
    next(err)
  }
})

module.exports = router
