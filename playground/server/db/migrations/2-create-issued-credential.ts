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
      claimNodes: {
        allowNull: false,
        type: DataTypes.ARRAY(DataTypes.JSONB),
      },
      claimed: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      claimVersion: {
        allowNull: false,
        type: DataTypes.ENUM('v1'),
      },
      credential: {
        allowNull: true,
        type: DataTypes.JSONB,
      },
      batchCredential: {
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
