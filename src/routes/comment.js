const express = require('express');
const { authMiddleware } = require('../middlewares/auth-middleware');
const {
  insertComment,
  updateComment,
  deleteComment
} = require('../controllers/comment');

const commentRouter = express.Router();

// 댓글 작성 라우터
commentRouter.route('/').post(authMiddleware, insertComment);

// 댓글 수정, 삭제 라우터
commentRouter
  .route('/:commentId')
  .put(authMiddleware, updateComment)
  .delete(authMiddleware, deleteComment);

module.exports = commentRouter;
