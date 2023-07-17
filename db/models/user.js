'use strict';
const env = process.env.NODE_ENV || 'development';
const config = require('../../config/config')[env];
const jwt = require('jsonwebtoken');

/**
 * @swagger
 *  components:
 *    schemas:
 *      CreateUserInput:
 *        type: object
 *        required:
 *          - name
 *          - email
 *          - password
 *        properties:
 *          name:
 *            type: string
 *          email:
 *            type: string
 *            format: email
 *            description: Email for the user, must be unique
 *          password:
 *            type: string
 *            description: Must be between 8 and 20 characters
 *        example:
 *           name: Test User
 *           email: testuser@test.com
 *           password: p@ssw0rd
 * @swagger
 *  components:
 *    schemas:  
 *      UpdateUserInput:
 *        type: object
 *        properties:
 *          name:
 *            type: string
 *          password:
 *            type: string
 *            description: Must be between 8 and 20 characters
 *        example:
 *           name: Test User
 *           password: p@ssw0rd
 * @swagger
 *  components:
 *    schemas: 
 *      AllUserOutput:
 *        type: object
 *        properties:
 *          name:
 *            type: string
 *          email:
 *            type: string
 *            format: email
 *            description: Email for the user, must be unique
 *        example:
 *           name: Test User
 *           email: testuser@test.com
 * 
 *      UserOut:
 *        type: object
 *        properties:
 *          name:
 *            type: string
 *          email:
 *            type: string
 *            format: email
 *            description: Email for the user, must be unique
 *          captions:
 *            type: array
 *            items: '#/components/schemas/Caption'  
 *            description: Caption that this user creates 
 *        example:
 *           name: Test User
 *           email: testuser@test.com
 *           caption: [{"id": "12332587-8689-499f-ae5e-4371bb7632cb", "photoId": "afa5a351-aaba-4225-9a20-7224dda915b2", "comment": "Watching these monkeys brings back fond memories of my visit to the Arashiyama Monkey Park. I can see similarities in their playful nature and curious antics. It's amazing how these intelligent creatures can evoke such joy and wonder in us.", "createdAt": "2023-07-16T05:38:29.851Z", "updatedAt": "2023-07-16T05:38:29.851Z"}]
 */

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Caption}) {
      // define association here
      this.hasMany(Caption, {foreignKey: 'userId', as: "captions"});
    }

    generateToken(){
      // Helper function to generate jwt token for authentication
      return jwt.sign(
        {
          id: this.id
        },
        config.privateKey
      );
    }
  }
  User.init({
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },   
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isAlphanumeric: true
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    sequelize,
  });
  return User;
};