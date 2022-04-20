const express = require('express');
const { adminLogin } = require('../controllers/admin');

const adminRouter = express.Router();

// 관리자 로그인
adminRouter.route('/login').post(adminLogin);

module.exports = adminRouter;
