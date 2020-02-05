import {Sequelize, Model, DataTypes, UUIDV4} from 'sequelize'
import {AtomicVCV1} from '@bloomprotocol/attestations-common'

export class IssuedCredential extends Model {
  id!: string

  type!: string

  data!: {'@type': string}

  claimVersion!: 'v1'

  claimed!: boolean

  vc?: AtomicVCV1

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
    },
    {
      tableName: 'issuedCredential',
      modelName: 'issuedCredential',
      sequelize,
    },
  )

  return IssuedCredential
}
