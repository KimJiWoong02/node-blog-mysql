const Comment = require('../models/comment');

// 댓글 추가
const insertComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    // 댓글 생성
    await Comment.create({
      user_id: res.locals.userId,
      post_id: postId,
      content
    });

    return res.status(201).send();
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

// 댓글 삭제
const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    // 관리자일 경우 조건없이 삭제 처리
    if (res.locals.isAdmin) {
      await Comment.update(
        {
          active: false,
          updated: Date.now()
        },
        {
          where: {
            id: commentId,
            post_id: postId
          }
        }
      );
    }
    // 유저일 경우 유저가 작성한 것만 삭제 처리
    else {
      await Comment.update(
        {
          active: false,
          updated: Date.now()
        },
        {
          where: {
            id: commentId,
            user_id: res.locals.userId,
            post_id: postId
          }
        }
      );
    }

    return res.status(200).send();
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

// 댓글 수정
const updateComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { content } = req.body;

    // 댓글 수정
    await Comment.update(
      {
        content: content,
        updated: Date.now()
      },
      {
        where: {
          id: commentId,
          user_id: res.locals.userId,
          post_id: postId
        }
      }
    );

    return res.status(201).send();
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

module.exports = {
  insertComment,
  deleteComment,
  updateComment
};
