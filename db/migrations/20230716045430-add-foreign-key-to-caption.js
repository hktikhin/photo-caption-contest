'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    queryInterface.addConstraint('Caption', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'userId_fkey',
      references: { //Required field
        table: 'User',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });

    queryInterface.addConstraint('Caption', {
      fields: ['photoId'],
      type: 'foreign key',
      name: 'photoId_fkey',
      references: { //Required field
        table: 'Photo',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    queryInterface.removeConstraint('Caption', 'userId_fkey');
    queryInterface.removeConstraint('Caption', 'photoId_fkey');
  }
};
