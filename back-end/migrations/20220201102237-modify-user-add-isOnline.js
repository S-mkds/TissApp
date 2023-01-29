
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn('Users', 'isOnline', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Users', 'isOnline', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
  },
};