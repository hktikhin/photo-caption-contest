'use strict';

/**
 * @swagger
 *  components:
 *    schemas:
 *      CreatePhotoInput:
 *        type: object
 *        required:
 *          - name
 *          - url
 *        properties:
 *          name:
 *            type: string
 *          url:
 *            type: string
 *            description: Path to image file. Must be unique. 
 *          citation:
 *            type: string
 *            description: citation for image source
 *        example:
 *           name: Sample Photo
 *           path: /images/sample.jpg
 *           citation: by Test Photographer
 * @swagger
 *  components:
 *    schemas:
 *      UpdatePhotoInput:
 *        type: object
 *        properties:
 *          name:
 *            type: string
 *          url:
 *            type: string
 *            description: path to image file
 *          citation:
 *            type: string
 *            description: citation for image source
 *        example:
 *           name: Sample Photo
 *           path: /images/sample.jpg
 *           citation: by Test Photographer
 * @swagger
 *  components:
 *    schemas:
 *      AllPhotoOutput:
 *        type: object
 *        properties:
 *          name:
 *            type: string
 *          url:
 *            type: string
 *            description: path to image file
 *          citation:
 *            type: string
 *            description: citation for image source
 *        example:
 *           name: Sample Photo
 *           path: /images/sample.jpg
 *           citation: by Test Photographer
 * @swagger
 *  components:
 *    schemas:
 *      PhotoOutput:
 *        type: object
 *        properties:
 *          name:
 *            type: string
 *          url:
 *            type: string
 *            description: path to image file
 *          citation:
 *            type: string
 *            description: citation for image source
 *          captions:
 *            type: array
 *            items: '#/components/schemas/Caption'  
 *            description: Caption that the users create on this photo
 *        example:
 *           name: Sample Photo
 *           path: /images/sample.jpg
 *           citation: by Test Photographer
 *           captions: [{"id":"8d27b031-a41e-4cea-a6cb-1170d80cdd4b","userId":"e6c31854-bede-48e6-ba90-3274c17f96b9","comment":"The deer in Nara are absolutely adorable! It's such a unique experience to see them roaming around the city like they own the place. I really enjoyed interacting with them and learning more about their history and significance in Japanese culture.","createdAt":"2023-07-15T07:12:05.863Z","updatedAt":"2023-07-15T07:12:05.863Z"}]
 */

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Photo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Caption}) {
      // define association here
      this.hasMany(Caption, {foreignKey: 'photoId', as: "captions"});
    }
  }

  Photo.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,      
      validate: {
        // Alphanumeric with underscores and hyphens
        is: /^[a-zA-Z0-9_-]+$/,
      }
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,  
      unique: true,  
      validate: {
        isUrl: true,
      }
    },
    citation: {
      // Author/ release year e.t.c
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'Photo',
  });
  return Photo;
};