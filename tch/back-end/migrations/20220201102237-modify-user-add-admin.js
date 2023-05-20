'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn('Users', 'admin', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Users', 'admin', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
  },
};
