const Comment = require('../models/comment');

// getComments. 해당 게시글에 작성된 모든 댓글 가져오기
const getComments = async post_id => {
  try {
    const comments = await Comment.findAll({
      raw: true,
      where: {
        post_id,
        active: true
      },
      order: [['createdAt', 'desc']]
    });

    return comments;
  } catch (error) {
    console.log(error.message);
  }
};

// deleteComments. 게시글에 작성된 댓글 삭제
const deleteComments = async post_id => {
  try {
    // 댓글 삭제
    await Comment.update(
      {
        active: false
      },
      {
        where: {
          post_id
        }
      }
    );

    return;
  } catch (error) {
    console.log(error.message);
  }
};

// insertComment. 댓글 작성
const insertComment = async (user_id, post_id, content) => {
  try {
    await Comment.create({
      user_id,
      post_id,
      content
    });

    return;
  } catch (error) {
    console.log(error.message);
  }
};

// updateComment. 댓글 수정
const updateComment = async (content, commentId, user_id, post_id) => {
  try {
    // 댓글 수정
    await Comment.update(
      {
        content: content
      },
      {
        where: {
          id: commentId,
          user_id,
          post_id
        }
      }
    );

    return;
  } catch (error) {
    console.log(error.message);
  }
};

// deleteCommentUser. 댓글 삭제 (유저 로그인 시)
const deleteCommentUser = async (commentId, user_id, post_id) => {
  try {
    // 댓글 삭제
    await Comment.update(
      {
        active: false
      },
      {
        where: {
          id: commentId,
          user_id,
          post_id
        }
      }
    );

    return;
  } catch (error) {
    console.log(error.message);
  }
};

// deleteCommentAdmin. 댓글 삭제 (관리자 로그인 시)
const deleteCommentAdmin = async (commentId, post_id) => {
  try {
    // 댓글 삭제
    await Comment.update(
      {
        active: false
      },
      {
        where: {
          id: commentId,
          post_id
        }
      }
    );

    return;
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  getComments,
  deleteComments,
  insertComment,
  updateComment,
  deleteCommentUser,
  deleteCommentAdmin
};
