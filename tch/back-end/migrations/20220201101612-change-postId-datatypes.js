'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.changeColumn('Comments', 'postId', {
      type: Sequelize.INTEGER,
    });
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.changeColumn('Comments', 'postId', {
      type: Sequelize.STRING,
    });
  },
};
