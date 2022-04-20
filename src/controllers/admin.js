const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');

// 관리자 로그인
const adminLogin = async (req, res) => {
  try {
    const { nickname, password } = req.body;

    const user = await Admin.findOne({ where: { nickname, password } }); // email과 password가 둘 다 맞아야한다.

    if (!user) {
      res.send(400).send({
        message: '이메일 또는 패스워드가 잘못됐습니다.'
      });
      return;
    }

    const token = jwt.sign({ userId: user.id, isAdmin: true }, 'secretKey');
    return res
      .header('authorization', 'Bearer ' + token)
      .status(200)
      .send({
        nickname: user.nickname,
        isAdmin: true
      });
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

module.exports = {
  adminLogin
};
