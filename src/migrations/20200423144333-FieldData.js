'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
  */
    return queryInterface.createTable(
      'FieldData',
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        fieldId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Fields',
            key: 'id'
          }
        },
        timestamps: {
          type: Sequelize.DATE,
          allowNull: true
        },
        string: {
          type: Sequelize.STRING,
          allowNull: true
        },
        number: {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        groupId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Groups',
            key: 'id'
          }
        }
      },
      {
        timestamps: false
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.dropTable('FieldData');
  }
};
