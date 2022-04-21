const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');

// 관리자 로그인
const adminLogin = async (req, res) => {
  try {
    const { nickname, password } = req.body;

    const admin = await Admin.findOne({ where: { nickname, password } }); // nickname과 password가 둘 다 맞아야한다.

    if (!admin) {
      res.status(400).send({
        message: '이메일 또는 패스워드가 잘못됐습니다.'
      });
      return;
    }

    const token = jwt.sign({ userId: admin.id, isAdmin: true }, 'secretKey');
    return res
      .header('authorization', 'Bearer ' + token)
      .status(200)
      .send({
        nickname: admin.nickname,
        isAdmin: true
      });
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

// 관리자 인증
const adminAuth = async (req, res) => {
  try {
    const { authorization } = req.headers;

    let user;

    // 토큰 디코딩
    if (authorization) {
      const [tokenType, tokenValue] = authorization.split(' ');

      if (tokenType === 'Bearer') {
        user = jwt.verify(tokenValue, 'secretKey');
      }
    }

    // 해당 토큰 관리자가 있는지 검색
    const existAdmin = await Admin.findOne({
      where: {
        id: user.userId
      }
    });

    // 해당 유저가 존재하지 않는 경우
    if (!existAdmin) {
      return res
        .status(400)
        .send({ message: '해당 관리자가 존재하지 않습니다.' });
    }

    return res.status(200).send({
      nickname: existAdmin.nickname,
      isAdmin: false
    });
  } catch (err) {
    console.log(err.message);
    return;
  }
};

module.exports = {
  adminLogin,
  adminAuth
};
