const jwt = require('jsonwebtoken');
const User = require('../models/user');

// 유저 회원가입
const userRegister = async (req, res) => {
  try {
    const { nickname, password, imageUrl } = req.body;

    // 유저 검색
    const existUsers = await User.findAll({
      where: {
        nickname: nickname
      }
    });

    // 이미 가입된 회원이면 CODE:400
    if (existUsers.length) {
      res.status(400).send({
        message: '이미 가입된 회원입니다.'
      });
      return;
    }

    await User.create({ nickname, password, imageUrl });

    return res.status(201).send();
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

// 로그인
const userLogin = async (req, res) => {
  try {
    const { nickname, password } = req.body;

    const user = await User.findOne({ where: { nickname, password } }); // email과 password가 둘 다 맞아야한다.

    if (!user) {
      res.send(400).send({
        message: '이메일 또는 패스워드가 잘못됐습니다.'
      });
      return;
    }

    const token = jwt.sign(
      { userId: user.getDataValue('id'), isAdmin: false },
      'secretKey'
    );
    return res
      .header('authorization', 'Bearer ' + token)
      .status(200)
      .send({
        nickname: user.nickname,
        isAdmin: false
      });
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

module.exports = {
  userRegister,
  userLogin
};
