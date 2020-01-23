import {Sequelize, Options} from 'sequelize'

import {ShareRequest, initShareRequest} from './ShareRequest'
import {IssuedCredential, initIssuedCredential} from './IssuedCredential'

export const initModels = () => {
  const config = require('../../config/config')
  const options: Options = config[process.env.NODE_ENV || 'development']
  const sequelize = new Sequelize(options)

  initShareRequest(sequelize)
  initIssuedCredential(sequelize)
}

export {ShareRequest, IssuedCredential}
