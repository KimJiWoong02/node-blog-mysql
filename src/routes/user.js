const express = require('express');
const { alreadyAuthMiddleware } = require('../middlewares/auth-middleware');
const { signupValidator } = require('../middlewares/validator-middleware');
const { userRegister, userLogin } = require('../controllers/user');

const userRouter = express.Router();

// 유저 회원가입
userRouter
  .route('/register')
  .post(alreadyAuthMiddleware, signupValidator, userRegister);

// 유저 로그인
userRouter.route('/login').post(alreadyAuthMiddleware, userLogin);

module.exports = userRouter;
