import {QueryInterface, DataTypes, Sequelize} from 'sequelize'

module.exports = {
  up: async (queryInterface: QueryInterface, _) => {
    await queryInterface.createTable('issuedCredential', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: Sequelize.fn('uuid_generate_v4'),
      },
      type: {
        allowNull: false,
        type: DataTypes.STRING(),
      },
      data: {
        allowNull: false,
        type: DataTypes.JSONB,
      },
      claimVersion: {
        allowNull: false,
        type: DataTypes.ENUM('v1'),
      },
      claimed: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      vc: {
        allowNull: true,
        type: DataTypes.JSONB,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    })
  },

  down: async (queryInterface, _) => {
    await queryInterface.dropTable('issuedCredential')
  },
}
