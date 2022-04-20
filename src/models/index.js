'use strict';

const Sequelize = require('sequelize');
const User = require('./user');
const Admin = require('./admin');
const Post = require('./post');
const Comment = require('./comment');
const Like = require('./like');

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '../../config/config.json')[env];
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;

db.User = User;
db.Admin = Admin;
db.Post = Post;
db.Comment = Comment;
db.Like = Like;

User.init(sequelize); // 테이블이 모델과 연결된다.
Admin.init(sequelize);
Post.init(sequelize);
Comment.init(sequelize);
Like.init(sequelize);

User.associate(db); // 테이블과의 관계를 설정
Admin.associate(db);
Post.associate(db);
Comment.associate(db);
Like.associate(db);

module.exports = db;
