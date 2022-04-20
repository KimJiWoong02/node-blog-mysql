const jwt = require('jsonwebtoken');
const { User } = require('../models');

// 로그인여부 확인 미들웨어
const authMiddleware = (req, res, next) => {
  const { authorization } = req.headers;
  const [tokenType, tokenValue] = (authorization || '').split(' ');

  if (!tokenValue || tokenType !== 'Bearer') {
    res.status(401).send({
      message: '로그인이 필요합니다.'
    });
    return;
  }

  try {
    const { userId, isAdmin } = jwt.verify(tokenValue, 'secretKey');

    User.findByPk(userId).then(user => {
      res.locals.userId = user.id;
      res.locals.isAdmin = isAdmin;
      next();
    });
  } catch (error) {
    res.status(401).send({
      message: '로그인이 필요합니다.'
    });
    return;
  }
};

// 로그인 한 사용자가 로그인 or 회원가입 페이지 접속한 경우 체크하는 미들웨어
const alreadyAuthMiddleware = (req, res, next) => {
  const { authorization } = req.headers;
  const [tokenType, tokenValue] = (authorization || '').split(' ');

  if (!tokenValue || tokenType !== 'Bearer') {
    return next();
  } else {
    return res.status(400).send({ message: '이미 로그인이 되어있습니다.' });
  }
};

module.exports = {
  authMiddleware,
  alreadyAuthMiddleware
};
