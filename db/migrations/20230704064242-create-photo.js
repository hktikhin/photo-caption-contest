'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('Photo', {
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
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Photo');
  }
};