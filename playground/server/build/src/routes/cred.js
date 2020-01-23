"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import {uuid} from 'uuidv4'
const fluent_schema_1 = __importDefault(require("fluent-schema"));
// import {ShareRequest} from '@server/models'
// import {wsCookieKey} from '@server/cookies'
// import {sendNotification} from '@server/socket/sender'
exports.applyCredRoutes = (app) => {
    app.post('/api/v1/cred/create', (req, reply) => {
        reply.status(200).send({});
    });
    app.post('/api/v1/cred/:id/claim/', {
        schema: {
            params: fluent_schema_1.default.object()
                .prop('id', fluent_schema_1.default.string().format('uuid'))
                .required(['id']),
        },
    }, (req, reply) => {
        reply.status(200).send({});
    });
};
//# sourceMappingURL=cred.js.map