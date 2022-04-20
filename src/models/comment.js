'use strict';
const { DataTypes, Model } = require('sequelize');
const moment = require('moment');

class Comment extends Model {
  static init(sequelize) {
    return super.init(
      {
        content: {
          type: DataTypes.TEXT,
          Comment: '댓글 내용'
        },
        createdAt: {
          type: DataTypes.DATE,
          Comment: '댓글 작성한 시간',
          get() {
            return moment(this.getDataValue('createdAt')).format(
              'YYYY-MM-DD HH:mm:ss'
            );
          }
        },
        updatedAt: {
          type: DataTypes.DATE,
          Comment: '댓글 수정한 시간',
          get() {
            return moment(this.getDataValue('updatedAt')).format(
              'YYYY-MM-DD HH:mm:ss'
            );
          }
        },
        active: {
          type: DataTypes.TINYINT,
          defaultValue: true
        }
      },
      {
        sequelize, //해당 부분에 db.sequelize 객체가 들어간다.
        timestamps: true, //true로 하면 createdAt과 updatedAt을 생성한다.
        underscored: false, //기본적으로 테이블명과 컬럼명을 CamelCase로 바꾸는데 snake case로 변경해준다
        modelName: 'Comment', //모델 이름을 설정할 수있다
        tableName: 'comments', //기본적으로 모델이름을 소문자및 복수형으로 만드는데 모델이 User면 users가된다
        paranoid: false, // true로 설정하면 deletedAt 컬럼이 생긴다. 삭제시 완전히 지워지지 않고 deletedAt에 지운시각이 기록된다.
        charset: 'utf8mb4', //이모티콘까지 입력되게하려면 utf8mb4와 utf8mb4_general_ci오입력한다
        collate: 'utf8mb4_general_ci'
      }
    );
  }

  static associate(db) {
    db.Comment.belongsTo(db.User, { foreignKey: 'user_id', sourceKey: 'id' });
    db.Comment.belongsTo(db.Post, { foreignKey: 'post_id', sourceKey: 'id' });
  }
}

module.exports = Comment;
