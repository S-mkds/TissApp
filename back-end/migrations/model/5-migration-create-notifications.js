"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Notifications", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true, // this is the primary key of the table (the id) and it is unique for each row (notification) in the table
        type: Sequelize.INTEGER,
      },
      recipientUserId: {
        // the user who will receive the notification (the user who will see the notification)
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE", // if the user is updated, update the notification (the user who will receive the notification)
        onDelete: "CASCADE", // if the user is deleted, delete the notification (the user who will receive the notification)
      },
      senderUserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      postId: {
        type: Sequelize.INTEGER, // if the notification is not related to a post, it will be null
        allowNull: true, // if the notification is not related to a post, it will be null
        references: {
          // if the notification is related to a post, it will be the id of the post
          model: "Posts", // if the notification is related to a post, it will be the id of the post
          key: "id", // if the notification is related to a post, it will be the id of the post
        },
        onUpdate: "CASCADE", // if the post is updated, update the notification
        onDelete: "CASCADE", // if the post is deleted, delete the notification
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      viewed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Notifications");
  },
};
