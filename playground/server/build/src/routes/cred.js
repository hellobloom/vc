"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fluent_schema_1 = __importDefault(require("fluent-schema"));
const issue_kit_1 = require("@bloomprotocol/issue-kit");
const models_1 = require("@server/models");
const cookies_1 = require("@server/cookies");
const sender_1 = require("@server/socket/sender");
exports.applyCredRoutes = (app) => {
    app.post('/api/v1/cred/create', {
        schema: {
            body: fluent_schema_1.default.object()
                .prop('claimNodes', fluent_schema_1.default.array().items(fluent_schema_1.default.object()
                .prop('type', fluent_schema_1.default.string())
                .prop('provider', fluent_schema_1.default.string())
                .prop('version', fluent_schema_1.default.string())
                .prop('data', fluent_schema_1.default.object())
                .required(['type', 'provider', 'version', 'data'])))
                .required(['claimNodes']),
        },
    }, (req, reply) => __awaiter(void 0, void 0, void 0, function* () {
        const cred = yield models_1.IssuedCredential.create({ claimNodes: req.body.claimNodes, claimVersion: 'v1' });
        return reply.status(200).send({ id: cred.id });
    }));
    app.post('/api/v1/cred/:id/get-config', {
        schema: {
            params: fluent_schema_1.default.object()
                .prop('id', fluent_schema_1.default.string().format('uuid'))
                .required(['id']),
        },
    }, (req, reply) => __awaiter(void 0, void 0, void 0, function* () {
        const cred = yield models_1.IssuedCredential.findOne({ where: { id: req.params.id } });
        if (!cred)
            return reply.status(404).send({});
        return reply
            .status(200)
            .setCookie(cookies_1.claimCookieKey, req.params.id, { signed: true, path: '/' })
            .send({ claimVersion: cred.claimVersion });
    }));
    app.post('/api/v1/cred/:id/claim-v1', {
        schema: {
            params: fluent_schema_1.default.object()
                .prop('id', fluent_schema_1.default.string().format('uuid'))
                .required(['id']),
        },
    }, (req, reply) => __awaiter(void 0, void 0, void 0, function* () {
        const cred = yield models_1.IssuedCredential.findOne({ where: { id: req.params.id } });
        if (!cred)
            return reply.status(404).send({});
        const claimNodes = cred.claimNodes.map(node => issue_kit_1.buildClaimNodeV1({
            dataStr: JSON.stringify(node.data),
            type: node.type,
            provider: node.provider,
            version: node.version,
        }));
        const vc = issue_kit_1.buildSelectivelyDisclosableVCV1({
            claimNodes,
            subject: '',
            issuanceDate: '',
            expirationDate: '',
            privateKey: Buffer.from([]),
        });
        if (req.query['share-kit-from'] === 'qr') {
            sender_1.sendNotification({
                recipient: req.body.token,
                type: 'notif/cred-claimed',
                payload: JSON.stringify(vc),
            });
            yield cred.destroy();
        }
        else {
            yield cred.update({});
        }
        return reply.status(200).send({});
    }));
};
//# sourceMappingURL=cred.js.map