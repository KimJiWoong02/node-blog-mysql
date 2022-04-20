const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const userRouter = require('./routes/user');
const adminRouter = require('./routes/admin');
const postRouter = require('./routes/post');
const commentRouter = require('./routes/comment');
const port = 3000;

const app = express();

// Mysql 연결
sequelize
  .sync({ force: false }) // true => 테이블 드랍후 재생성(배포시 false)
  .then(() => {
    console.log('DB connected');
  })
  .catch(err => {
    console.log(err);
  });

// API 호출 경로 및 시간 출력 미들웨어
const requestMiddleware = (req, res, next) => {
  console.log('Request URL:', req.originalUrl, ' - ', new Date());
  next();
};

// cors 처리
app.use(cors());
app.use(express.json);
app.use(express.urlencoded({ extended: true }));
app.use(requestMiddleware);

app.use('/api/users', [userRouter]);
app.use('/api/admins', [adminRouter]);
app.use('/api/posts', [postRouter]);
app.use('/api/posts/:postId/comments', [commentRouter]);

app.get('/', (req, res) => {
  return res.send('Hello');
});

// 서버 실행 성공 시
app.listen(port, () => {
  console.log(port, '포트로 서버가 준비됐습니다.');
});
