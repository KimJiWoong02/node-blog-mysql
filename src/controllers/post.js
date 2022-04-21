const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like');

// 게시글 조회
const getPosts = async (req, res) => {
  try {
    const { authorization } = req.headers;

    let user;

    // 로그인한 상태인지 확인하여 user 정보 가져오기
    if (authorization) {
      const [tokenType, tokenValue] = authorization.split(' ');

      if (tokenType === 'Bearer') {
        user = jwt.verify(tokenValue, 'secretKey');
      }
    }

    // 삭제되지 않은 모든 게시글 가져오기
    const posts = await Post.findAll({
      raw: true,
      where: {
        active: true
      },
      order: [['createdAt', 'desc']]
    });

    // for문으로 돌면서 좋아요 수, 여부, 닉네임, 댓글 수 추가
    for (let post of posts) {
      // 좋아요수 확인
      const likes = await Like.findAll({
        where: {
          post_id: post.id
        }
      });
      post.likeCnt = likes.length;

      // 로그인 X 시 기본적으로 좋아요 여부를 false로 설정
      post.isLike = false;

      // 로그인된 상태라면 좋아요 여부 확인
      if (user) {
        const like = await Like.findOne({
          where: {
            user_id: user.userId,
            post_id: post.id
          }
        });

        // 로그인한 유저의 좋아요가 있다면 추가
        if (like) {
          post.isLike = true;
        }
      }

      // 작성자 닉네임 추가
      const postUser = await User.findOne({
        where: {
          id: post.user_id
        }
      });
      post.nickname = postUser.nickname;

      // 댓글 수 추가
      const comments = await Comment.findAll({
        where: {
          post_id: post.id
        }
      });
      post.commentCnt = comments.length;

      // id를 postId로 변경하여 반환
      post.postId = post.id;

      // 필요없는 값 삭제
      delete post.id;
      delete post.user_id;
      delete post.active;
    }

    return res.status(200).send({ posts });
  } catch (error) {
    console.log(error.message);
    return;
  }
};

// 게시글 추가
const insertPost = async (req, res) => {
  try {
    const { title, content, imgUrl, layout } = req.body;

    // 게시글 작성
    await Post.create({
      user_id: res.locals.userId,
      title,
      content,
      imgUrl,
      layout
    });

    return res.status(201).send();
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

// 특정 게시글 조회
const detailPost = async (req, res) => {
  try {
    const { authorization } = req.headers;
    const { postId } = req.params;

    let user;

    // 로그인한 상태인지 확인하여 user 정보 가져오기
    if (authorization) {
      const [tokenType, tokenValue] = authorization.split(' ');

      if (tokenType === 'Bearer') {
        user = jwt.verify(tokenValue, 'secretKey');
      }
    }

    // 특정 게시글 조회
    const post = await Post.findOne({
      raw: true,
      where: {
        id: postId,
        active: true
      }
    });

    // 좋아요수 확인
    const likes = await Like.findAll({
      where: {
        post_id: post.id
      }
    });
    post.likeCnt = likes.length;

    // 로그인 X 시 기본적으로 좋아요 여부를 false로 설정
    post.isLike = false;

    // 로그인된 상태라면 좋아요 여부 확인
    if (user) {
      const like = await Like.findOne({
        where: {
          user_id: user.userId,
          post_id: post.id
        }
      });

      // 로그인한 유저의 좋아요가 있다면 추가
      if (like) {
        post.isLike = true;
      }
    }

    // 작성자 닉네임 추가
    const postUser = await User.findOne({
      where: {
        id: post.user_id
      }
    });
    post.nickname = postUser.nickname;

    // id를 postId로 변경하여 반환
    post.postId = post.id;

    // 필요없는 값 삭제
    delete post.id;
    delete post.user_id;
    delete post.active;

    // 게시글에 작성된 댓글 추가
    const comments = await Comment.findAll({
      raw: true,
      where: {
        post_id: postId,
        active: true
      },
      order: [['createdAt', 'desc']]
    });

    for (let comment of comments) {
      // 댓글 유저 조회
      const commentUser = await User.findOne({
        raw: true,
        where: {
          id: comment.user_id
        }
      });

      // 필요한 값 추가
      comment.commentId = comment.id;
      comment.nickname = commentUser.nickname;
      comment.imageUrl = commentUser.imageUrl;

      // 필요없는 값 삭제
      delete comment.id;
      delete comment.active;
      delete comment.user_id;
      delete comment.post_id;
    }
    post.comments = comments;

    return res.status(200).send({ post: post });
  } catch (error) {
    console.log(error.message);
    return;
  }
};

// 게시글 수정
const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, content, imageUrl, layout } = req.body;

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

    // 해당 게시글 작성 유저가 아닐때 CODE:403
    if (post.user_id !== res.locals.userId) {
      return res
        .status(403)
        .send({ message: '해당 게시글을 작성한 유저만 수정이 가능합니다.' });
    }

    // 게시글 수정
    await Post.update(
      {
        title,
        content,
        imageUrl,
        layout
      },
      {
        where: {
          id: postId,
          user_id: res.locals.userId
        }
      }
    );

    return res.status(201).send();
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

// 게시글 삭제
const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

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

    // 관리자일 경우 조건없이 삭제 처리( delete가 아닌 active = false)
    if (res.locals.isAdmin) {
      await Post.update(
        {
          active: false
        },
        {
          where: {
            id: postId
          }
        }
      );
    }
    // 유저일 경우 유저가 작성한 것만 삭제 처리
    else {
      // 해당 게시글 작성 유저가 아닐때 CODE:403
      if (post.user_id !== res.locals.userId) {
        return res
          .status(403)
          .send({ message: '해당 게시글을 작성한 유저만 삭제가 가능합니다.' });
      }

      await Post.update(
        {
          active: false
        },
        {
          where: {
            id: postId,
            user_id: res.locals.userId
          }
        }
      );
    }

    // 삭제 처리 한 게시물의 댓글들도 모두 삭제 처리
    await Comment.update(
      {
        active: false
      },
      {
        where: {
          post_id: postId
        }
      }
    );

    return res.status(200).send();
  } catch (error) {
    console.log(error.message);
    return;
  }
};

// 좋아요 추가
const insertLike = async (req, res) => {
  try {
    const { postId } = req.params;

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

    // 좋아요 여부를 확인하기 위해 find
    const existLike = await Like.findOne({
      where: {
        user_id: res.locals.userId,
        post_id: postId
      }
    });

    // 좋아요를 하지 않았을 시 추가
    if (!existLike) {
      await Like.create({
        user_id: res.locals.userId,
        post_id: postId
      });
    }

    return res.status(201).send();
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

// 좋아요 삭제
const deleteLike = async (req, res) => {
  try {
    const { postId } = req.params;

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

    // 좋아요 취소
    await Like.destroy({
      where: {
        user_id: res.locals.userId,
        post_id: postId
      }
    });

    return res.status(200).send();
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

module.exports = {
  getPosts,
  insertPost,
  detailPost,
  updatePost,
  deletePost,
  insertLike,
  deleteLike
};
