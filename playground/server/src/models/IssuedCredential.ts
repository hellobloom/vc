import {Sequelize, Model, DataTypes, UUIDV4} from 'sequelize'

export class IssuedCredential extends Model {
  id!: string

  createdAt!: Date

  updatedAt!: Date
}

export const initIssuedCredential = (sequelize: Sequelize) => {
  IssuedCredential.init(
    {
      id: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        defaultValue: UUIDV4,
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
      tableName: 'issuedCredential',
      modelName: 'issuedCredential',
      sequelize,
    },
  )

  return IssuedCredential
}
