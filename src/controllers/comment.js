const Post = require('../models/post');
const Comment = require('../models/comment');

// 댓글 추가
const insertComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    // 게시글 조회
    const post = await Post.findOne({
      where: {
        id: postId,
        active: true
      }
    });

    // 해당 게시글이 존재하지 않을때 CODE:404
    if (post === null) {
      return res
        .status(404)
        .send({ message: '해당 게시글이 존재하지 않습니다.' });
    }

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

    // 게시글 조회
    const post = await Post.findOne({
      where: {
        id: postId,
        active: true
      }
    });

    // 해당 게시글이 존재하지 않을때 CODE:404
    if (post === null) {
      return res
        .status(404)
        .send({ message: '해당 게시글이 존재하지 않습니다.' });
    }

    // 관리자일 경우 조건없이 삭제 처리
    if (res.locals.isAdmin) {
      await Comment.update(
        {
          active: false
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
      // 해당 댓글 작성 유저가 아닐때 CODE:403
      if (post.user_id !== res.locals.userId) {
        return res
          .status(403)
          .send({ message: '해당 댓글을 작성한 유저만 삭제가 가능합니다.' });
      }

      await Comment.update(
        {
          active: false
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
    console.log(error.message);
    return;
  }
};

// 댓글 수정
const updateComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { content } = req.body;

    // 게시글 조회
    const post = await Post.findOne({
      where: {
        id: postId,
        active: true
      }
    });

    // 해당 게시글이 존재하지 않을때 CODE:404
    if (post === null) {
      return res
        .status(404)
        .send({ message: '해당 게시글이 존재하지 않습니다.' });
    }

    // 해당 댓글 작성 유저가 아닐때 CODE:403
    if (post.user_id !== res.locals.userId) {
      return res
        .status(403)
        .send({ message: '해당 댓글을 작성한 유저만 수정이 가능합니다.' });
    }

    // 댓글 수정
    await Comment.update(
      {
        content: content
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
