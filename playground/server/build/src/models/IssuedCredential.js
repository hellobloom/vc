"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class IssuedCredential extends sequelize_1.Model {
}
exports.IssuedCredential = IssuedCredential;
exports.initIssuedCredential = (sequelize) => {
    IssuedCredential.init({
        id: {
            type: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
            defaultValue: sequelize_1.UUIDV4,
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
        tableName: 'issuedCredential',
        modelName: 'issuedCredential',
        sequelize,
    });
    return IssuedCredential;
};
//# sourceMappingURL=IssuedCredential.js.map