const express = require('express');
const { adminLogin, adminAuth } = require('../controllers/admin');
const { alreadyAuthMiddleware } = require('../middlewares/auth-middleware');

const adminRouter = express.Router();

// 관리자 로그인
adminRouter.route('/login').post(alreadyAuthMiddleware, adminLogin);

// 관리자인증
adminRouter.route('/auth').get(adminAuth);

module.exports = adminRouter;
