'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn('Users', 'deleted', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Users', 'deleted', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
  },
};
