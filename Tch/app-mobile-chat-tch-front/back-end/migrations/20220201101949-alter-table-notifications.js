'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn('Notifications', 'senderUserId', {
      type: Sequelize.INTEGER,
    });
    queryInterface.renameColumn('Notifications', 'userId', 'recipientUserId');
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Notifications', 'senderUserId', {
      type: Sequelize.INTEGER,
    });
    queryInterface.renameColumn('Notifications', 'recipientUserId', 'userId');
  },
};
