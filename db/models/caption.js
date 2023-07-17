'use strict';

/**
 * @swagger
 *  components:
 *    schemas:
 *      CreateCaptionInput:
 *        type: object
 *        required:
 *          - photo_id
 *          - comment
 *        properties:
 *          photo_id:
 *            type: integer
 *            description: fk of the photo this comment is captioning
 *          comment:
 *            type: string
 *            description: caption for the photo
 *        example:
 *           photo_id: 2
 *           comment: This is a great photo!
 * @swagger
 *  components:
 *    schemas: 
 *      UpdateCaptionInput:
 *        type: object
 *        properties:
 *          photo_id:
 *            type: integer
 *            description: fk of the photo this comment is captioning
 *          comment:
 *            type: string
 *            description: caption for the photo
 *        example:
 *           photo_id: 2
 *           comment: This is a great photo!
 * @swagger
 *  components:
 *    schemas: 
 *      CaptionOutput:
 *        type: object
 *        properties:
 *          photo_id:
 *            type: integer
 *            description: fk of the photo this comment is captioning
 *          user_id:
 *            type: integer
 *            description: fk of the user who created the comment
 *          comment:
 *            type: string
 *            description: caption for the photo
 *          user:
 *            type: '#/components/schemas/AllPhotoOutput'
 *            description: photo this caption is for 
 *          photo:
 *            type: '#/components/schemas/AllUserOutput'
 *            description: user who make this caption
 *        example:
 *           photo_id: 2
 *           comment: This is a great photo!
 *           user: {"name":"thlawab","email":"thlawab@gmail.com","createdAt":"2023-07-08T08:45:17.128Z","updatedAt":"2023-07-15T10:08:14.523Z"}
 *           photo: {"name":"monkey","url":"https://storage.googleapis.com/photo-caption-contest/images/monkeys.jpg","citation":null,"createdAt":"2023-07-15T06:35:21.546Z","updatedAt":"2023-07-15T06:35:21.546Z"}
 * 
 */

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Caption extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User, Photo}) {
      // define association here
      this.belongsTo(User, {foreignKey: 'userId', as: "user"});
      this.belongsTo(Photo, {foreignKey: 'photoId', as: "photo"});
    }
  }
  Caption.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    photoId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    comment: {
      type: DataTypes.STRING, //VARCHAR 255
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Caption',
  });
  return Caption;
};