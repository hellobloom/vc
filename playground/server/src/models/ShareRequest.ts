import {Sequelize, Model, DataTypes, UUIDV4} from 'sequelize'

export class ShareRequest extends Model {
  id!: string

  requestedTypes!: string[]

  responseVersion!: 'v0' | 'v1'

  verifiableCredential?: []

  createdAt!: Date

  updatedAt!: Date
}

export const initShareRequest = (sequelize: Sequelize) => {
  ShareRequest.init(
    {
      id: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        defaultValue: UUIDV4,
      },
      requestedTypes: {
        type: DataTypes.ARRAY(DataTypes.STRING()),
        allowNull: false,
      },
      responseVersion: {
        type: DataTypes.ENUM('v0', 'v1'),
        allowNull: true,
      },
      verifiableCredential: {
        type: DataTypes.ARRAY(DataTypes.JSONB),
        allowNull: true,
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
    },
    {
      tableName: 'shareRequest',
      modelName: 'shareRequest',
      sequelize,
    },
  )

  return ShareRequest
}
