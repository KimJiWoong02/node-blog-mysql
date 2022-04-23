const Post = require('../models/post');
const Like = require('../models/like');

// getPosts. 삭제되지 않은 모든 게시글 가져오기
const getPosts = async () => {
  try {
    const posts = await Post.findAll({
      raw: true,
      where: {
        active: true
      },
      order: [['createdAt', 'desc']]
    });

    return posts;
  } catch (error) {
    console.log(error.message);
  }
};

// insertPost. 게시글 작성
const insertPost = async (user_id, title, content, imageUrl, layout) => {
  try {
    const post = await Post.create({
      user_id,
      title,
      content,
      imageUrl,
      layout
    });

    return post;
  } catch (error) {
    console.log(error.message);
  }
};

// findPost. 특정 게시글 조회
const findPost = async (postId, rawOption = false) => {
  try {
    const post = await Post.findOne({
      raw: rawOption,
      where: {
        id: postId,
        active: true
      }
    });

    return post;
  } catch (error) {
    console.log(error.message);
  }
};

// updatePost. 게시글 수정
const updatePost = async (
  title,
  content,
  imageUrl,
  layout,
  postId,
  user_id
) => {
  try {
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
          user_id
        }
      }
    );

    return;
  } catch (error) {
    console.log(error.message);
  }
};

// deletePostUser. 특정 게시글 삭제 처리 (유저 로그인 시)
const deletePostUser = async (postId, user_id) => {
  try {
    await Post.update(
      {
        active: false
      },
      {
        where: {
          id: postId,
          user_id
        }
      }
    );

    return;
  } catch (error) {
    console.log(error.message);
  }
};

// deletePostAdmin. 특정 게시글 삭제 처리 (관리자 로그인 시)
const deletePostAdmin = async postId => {
  try {
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

    return;
  } catch (error) {
    console.log(error.message);
  }
};

// getLikes. 좋아요수 확인을 위해 모든 좋아요 조회
const getLikes = async post_id => {
  try {
    const likes = await Like.findAll({
      where: {
        post_id
      }
    });

    return likes;
  } catch (error) {
    console.log(error.message);
  }
};

// findLike. 좋아요 여부 확인 (로그인 된 상태)
const findLike = async (user_id, post_id) => {
  try {
    const like = await Like.findOne({
      where: {
        user_id,
        post_id
      }
    });

    return like;
  } catch (error) {
    console.log(error.message);
  }
};

// insertLike. 좋아요 추가
const insertLike = async (user_id, post_id) => {
  try {
    await Like.create({
      user_id,
      post_id
    });

    return;
  } catch (error) {
    console.log(error.message);
  }
};

// deleteLike. 좋아요 삭제
const deleteLike = async (user_id, post_id) => {
  try {
    await Like.destroy({
      where: {
        user_id,
        post_id
      }
    });

    return;
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  getPosts,
  insertPost,
  findPost,
  updatePost,
  deletePostUser,
  deletePostAdmin,
  getLikes,
  findLike,
  insertLike,
  deleteLike
};
