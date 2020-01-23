"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class ShareRequest extends sequelize_1.Model {
}
exports.ShareRequest = ShareRequest;
exports.initShareRequest = (sequelize) => {
    ShareRequest.init({
        id: {
            type: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
            defaultValue: sequelize_1.UUIDV4,
        },
        requestedTypes: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING()),
            allowNull: false,
        },
        responseVersion: {
            type: sequelize_1.DataTypes.ENUM('v0', 'v1'),
            allowNull: true,
        },
        verifiableCredential: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.JSONB),
            allowNull: true,
        },
        createdAt: {
            allowNull: false,
            type: sequelize_1.DataTypes.DATE,
            defaultValue: sequelize_1.Sequelize.fn('NOW'),
        },
        updatedAt: {
            allowNull: false,
            type: sequelize_1.DataTypes.DATE,
            defaultValue: sequelize_1.Sequelize.fn('NOW'),
        },
    }, {
        tableName: 'shareRequest',
        modelName: 'shareRequest',
        sequelize,
    });
    return ShareRequest;
};
//# sourceMappingURL=ShareRequest.js.map