const Admin = require('../models/admin');

// findAdmin. id로 Admin을 찾는다, raw값도 받아 변경가능한 값으로 돌려줄지 결정(default = false)
const findAdmin = async findId => {
  try {
    const admin = await Admin.findOne({
      where: {
        id: findId
      }
    });
    return admin;
  } catch (error) {
    console.log(error.message);
  }
};

// loginAdmin. ID, Password를 받아 Admin 테이블의 동일한 정보를 찾기
const loginAdmin = async (nickname, password) => {
  try {
    const admin = await Admin.findOne({ where: { nickname, password } });
    return admin;
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  findAdmin,
  loginAdmin
};
