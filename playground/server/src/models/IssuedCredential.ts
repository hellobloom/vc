import {Sequelize, Model, DataTypes, UUIDV4} from 'sequelize'
import {SelectivelyDisclosableVC, SelectivelyDisclosableBatchVC} from '@bloomprotocol/attestations-common'

export class IssuedCredential extends Model {
  id!: string

  claimNodes!: {type: string; version: string; provider: string; data: {}}[]

  claimVersion!: 'v1'

  claimed!: boolean

  credential?: SelectivelyDisclosableVC

  batchCredential?: SelectivelyDisclosableBatchVC

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
      claimNodes: {
        allowNull: false,
        type: DataTypes.ARRAY(DataTypes.JSONB),
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
    },
    {
      tableName: 'issuedCredential',
      modelName: 'issuedCredential',
      sequelize,
    },
  )

  return IssuedCredential
}
