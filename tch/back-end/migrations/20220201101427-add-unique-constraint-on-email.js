'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addConstraint('Users', {
      type: 'unique',
      fields: ['email'],
      name: 'email',
    });
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeConstraint('Users', 'email');
  },
};
