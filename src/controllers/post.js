const jwt = require('jsonwebtoken');
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
      where: {
        active: true
      }
    });

    for (let post of posts) {
      // 좋아요수 확인
      const likes = await Like.findAll({
        where: {
          post_id: post.getDataValue('id')
        }
      });
      post.setDataValue('likeCnt', likes.length);

      // 로그인된 상태라면 좋아요 여부 확인
      if (user) {
        const like = await Like.findAll({
          where: {
            user_id: user.user_id,
            post_id: post.getDataValue('id')
          }
        });

        // 로그인한 유저의 좋아요가 있다면 추가
        if (like) {
          post.setDataValue('isLike', true);
        }
      }

      // 댓글수 확인
      const comments = await Comment.findAll({
        where: {
          post_id: post.getDataValue('id')
        }
      });
      post.setDataValue('commentCnt', comments.length);
    }

    return res.status(200).send({ posts });
  } catch (error) {
    return res.status(400).send({ message: error.message });
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
      where: {
        id: postId,
        active: true
      }
    });

    // 게시글이 없으면 404 Return
    if (!post) {
      return res.status(404).send({ message: '찾는 게시글이 없습니다' });
    }

    // 좋아요수 확인
    const likes = await Like.findAll({
      where: {
        post_id: post.getDataValue('id')
      }
    });
    post.setDataValue('likeCnt', likes.length);

    // 로그인된 상태라면 좋아요 여부 확인
    if (user) {
      const like = await Like.findAll({
        where: {
          user_id: user.user_id,
          post_id: post.getDataValue('id')
        }
      });

      // 로그인한 유저의 좋아요가 있다면 추가
      if (like) {
        post.setDataValue('isLike', true);
      }
    }

    // 게시글에 작성된 댓글 추가
    const comments = await Comment.findAll({
      where: {
        post_id: postId,
        active: true
      }
    });
    post.setDataValue('comments', comments);

    return res.status(200).send(post);
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

// 게시글 수정
const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, content, image_url } = req.body;

    // 게시글 수정
    await Post.update(
      {
        title,
        content,
        image_url,
        updated: Date.now()
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

    // 관리자일 경우 조건없이 삭제 처리( delete가 아닌 active = false)
    if (res.locals.isAdmin) {
      await Post.update(
        {
          active: false,
          updated: Date.now()
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
      await Post.update(
        {
          active: false,
          updated: Date.now()
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
        active: false,
        updated: Date.now()
      },
      {
        where: {
          post_id: postId
        }
      }
    );

    return res.status(200).send();
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

// 좋아요 추가
const insertLike = async (req, res) => {
  try {
    const { postId } = req.params;

    // 좋아요 추가
    await Like.create({
      user_id: res.locals.userId,
      post_id: postId
    });

    return res.status(201).send();
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

// 좋아요 삭제
const deleteLike = async (req, res) => {
  try {
    const { postId } = req.params;

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
