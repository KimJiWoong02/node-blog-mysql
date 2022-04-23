const jwt = require('jsonwebtoken');
const userService = require('../services/user');

// 유저 회원가입
const userRegister = async (req, res) => {
  try {
    const { nickname, password, imageUrl } = req.body;

    const existUsers = await userService.nicknameCheck(nickname);

    // 이미 가입된 회원이면 CODE:409
    if (existUsers.length) {
      res.status(409).send({
        message: '이미 가입된 회원입니다.'
      });
      return;
    }

    await userService.createUser(nickname, password, imageUrl);

    return res.status(201).send();
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

// 로그인
const userLogin = async (req, res) => {
  try {
    const { nickname, password } = req.body;

    const user = await userService.loginUser(nickname, password);

    if (!user) {
      res.status(400).send({
        message: '아이디 또는 패스워드가 잘못됐습니다.'
      });
      return;
    }

    const token = jwt.sign({ userId: user.id, isAdmin: false }, 'secretKey');
    return res
      .header('authorization', 'Bearer ' + token)
      .status(200)
      .send({
        nickname: user.nickname,
        isAdmin: false,
        token: token
      });
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

// 유저인증
const userAuth = async (req, res) => {
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

    const existUser = await userService.findUser(user.userId);

    // 해당 유저가 존재하지 않는 경우
    if (!existUser) {
      return res
        .status(400)
        .send({ message: '해당 유저가 존재하지 않습니다.' });
    }

    return res.status(200).send({
      nickname: existUser.nickname,
      isAdmin: false
    });
  } catch (err) {
    console.log(err.message);
    return;
  }
};

module.exports = {
  userRegister,
  userLogin,
  userAuth
};
