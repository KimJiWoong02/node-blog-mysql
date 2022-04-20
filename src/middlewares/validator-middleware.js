const Joi = require('joi');

// 회원가입 입력값 검사
const signupValidator = (req, res, next) => {
  const { nickname, password } = req.body;

  try {
    if (password.includes(nickname))
      throw new Error('비밀번호에 닉네임을 포함할 수 없습니다.');
  } catch (error) {
    // 닉네임과 같은 값이 포함된 경우 회원가입에 실패
    return res.status(400).send({ message: error.message });
  }

  const userSchema = Joi.object({
    // 최소 3자 이상, 알파벳 대소문자(a~z, A~Z), 숫자(0~9)로 구성
    nickname: Joi.string().alphanum().min(3).required(),
    // 최소 4자 이상
    password: Joi.string().min(4).required(),
    // password와 같은지 확인
    confirmPassword: Joi.any().valid(Joi.ref('password')).required(),
    imageUrl: Joi.string()
  });

  // 한 번에 모든 에러를 확인하기 위해 에러가 발생해도 계속 진행
  const options = {
    abortEarly: false
  };

  const { error, value } = userSchema.validate(req.body, options);

  if (error) {
    if (error.message === '"confirmPassword" must be [ref:password]') {
      return res
        .status(400)
        .send({ message: '비밀번호와 비밀번호 확인란이 같은지 확인해주세요.' });
    } else {
      return res.status(400).send({ message: '입력 형식이 잘못되었습니다.' });
    }
  } else {
    req.body = value;
    next();
  }
};

module.exports = {
  signupValidator
};
