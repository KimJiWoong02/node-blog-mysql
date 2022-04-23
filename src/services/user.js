const User = require('../models/user');

// findUser. id로 User를 찾는다, raw값도 받아 변경가능한 값으로 돌려줄지 결정(default = false)
const findUser = async (findId, rawOption = false) => {
  try {
    const user = await User.findOne({
      raw: rawOption,
      where: {
        id: findId
      }
    });
    return user;
  } catch (error) {
    console.log(error.message);
  }
};

// loginUser. ID, Password를 받아 User 테이블의 동일한 정보를 찾기
const loginUser = async (nickname, password) => {
  try {
    const user = await User.findOne({ where: { nickname, password } });
    return user;
  } catch (error) {
    console.log(error.message);
  }
};

// nicknameCheck. 유저 nickname 중복 체크
const nicknameCheck = async nickname => {
  try {
    const existUsers = await User.findAll({
      where: {
        nickname: nickname
      }
    });
    return existUsers;
  } catch (error) {
    console.log(error.message);
  }
};

// createUser. 유저 데이터 생성(회원가입)
const createUser = async (nickname, password, imageUrl) => {
  try {
    await User.create({ nickname, password, imageUrl });
    return;
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  findUser,
  loginUser,
  nicknameCheck,
  createUser
};
