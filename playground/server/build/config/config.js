"use strict";
require('babel-register');
module.exports = {
    development: {
        username: undefined,
        password: undefined,
        host: 'localhost',
        database: 'attestations-playground-dev',
        dialect: 'postgres',
    },
    test: {
        username: undefined,
        password: undefined,
        host: 'localhost',
        database: 'attestations-playground-test',
        dialect: 'postgres',
    },
    production: {
        username: undefined,
        password: undefined,
        host: 'localhost',
        database: 'attestations-playground-prod',
        dialect: 'postgres',
    },
};
//# sourceMappingURL=config.js.map