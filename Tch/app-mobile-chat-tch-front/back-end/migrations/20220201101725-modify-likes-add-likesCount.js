'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn('Posts', 'likesCount', {
      type: Sequelize.INTEGER,
    });
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Posts', 'likesCount', {
      type: Sequelize.STRING,
    });
  },
};
