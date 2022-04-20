const express = require('express');
const { authMiddleware } = require('../middlewares/auth-middleware');
const {
  getPosts,
  insertPost,
  detailPost,
  updatePost,
  deletePost,
  insertLike,
  deleteLike
} = require('../controllers/post');

const postRouter = express.Router();

// 게시글 전체 조회, 게시글 작성 라우터
postRouter
  .route('/')
  .get(getPosts) // 로그인하지 않은 사용자도, 게시글 목록 조회 가능
  .post(authMiddleware, insertPost); // 로그인을 한 사람만 글쓰기 권한

// 게시글 상세 조회, 수정, 삭제 라우터
postRouter
  .route('/:post_id')
  .get(detailPost)
  .put(authMiddleware, updatePost)
  .delete(authMiddleware, deletePost);

// 게시글 좋아요 라우터
postRouter
  .route('/:post_id/like')
  .post(authMiddleware, insertLike)
  .delete(authMiddleware, deleteLike);

module.exports = postRouter;
