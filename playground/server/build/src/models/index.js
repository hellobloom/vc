"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const ShareRequest_1 = require("./ShareRequest");
exports.ShareRequest = ShareRequest_1.ShareRequest;
const IssuedCredential_1 = require("./IssuedCredential");
exports.IssuedCredential = IssuedCredential_1.IssuedCredential;
exports.initModels = () => {
    const config = require('../../config/config');
    const options = config[process.env.NODE_ENV || 'development'];
    const sequelize = new sequelize_1.Sequelize(options);
    ShareRequest_1.initShareRequest(sequelize);
    IssuedCredential_1.initIssuedCredential(sequelize);
};
//# sourceMappingURL=index.js.map