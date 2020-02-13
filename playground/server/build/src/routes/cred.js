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
const attestations_common_1 = require("@bloomprotocol/attestations-common");
const dayjs_1 = __importDefault(require("dayjs"));
const models_1 = require("@server/models");
const cookies_1 = require("@server/cookies");
const sender_1 = require("@server/socket/sender");
exports.applyCredRoutes = (app) => {
    app.post('/api/v1/cred/create', {
        schema: {
            body: fluent_schema_1.default.object()
                .prop('type', fluent_schema_1.default.string())
                .prop('data', fluent_schema_1.default.object()
                .prop('@type', fluent_schema_1.default.string())
                .required(['@type']))
                .required(['type', 'data']),
        },
    }, (req, reply) => __awaiter(void 0, void 0, void 0, function* () {
        const cred = yield models_1.IssuedCredential.create({ type: req.body.type, data: req.body.data, claimVersion: 'v1' });
        return reply.status(200).send({ id: cred.id });
    }));
    app.get('/api/v1/cred/:id/get-config', {
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
    app.get('/api/v1/cred/:id/get-claimed-vc', {
        schema: {
            params: fluent_schema_1.default.object()
                .prop('id', fluent_schema_1.default.string().format('uuid'))
                .required(['id']),
        },
    }, (req, reply) => __awaiter(void 0, void 0, void 0, function* () {
        const cred = yield models_1.IssuedCredential.findOne({ where: { id: req.params.id } });
        if (!cred)
            return reply.status(404).send({});
        if (!cred.vc)
            return reply.status(404).send({});
        const { vc } = cred;
        yield cred.destroy();
        return reply.status(200).send({ vc });
    }));
    app.post('/api/v1/cred/:id/claim-v1', {
        schema: {
            querystring: fluent_schema_1.default.object()
                .prop('claim-kit-from', fluent_schema_1.default.enum(['qr', 'button']))
                .required(['claim-kit-from']),
            params: fluent_schema_1.default.object()
                .prop('id', fluent_schema_1.default.string().format('uuid'))
                .required(['id']),
            body: fluent_schema_1.default.object()
                .prop('subject', fluent_schema_1.default.string())
                .required(['subject']),
        },
    }, (req, reply) => __awaiter(void 0, void 0, void 0, function* () {
        if (!attestations_common_1.EthUtils.isValidDID(req.body.subject)) {
            return reply.status(400).send({});
        }
        const cred = yield models_1.IssuedCredential.findOne({ where: { id: req.params.id } });
        if (!cred)
            return reply.status(404).send({});
        if (cred.claimed)
            return reply.status(400).send({});
        try {
            const credentialSubject = yield issue_kit_1.buildAtomicVCSubjectV1({
                data: cred.data,
                subject: req.body.subject,
            });
            const vc = yield issue_kit_1.buildAtomicVCV1({
                credentialSubject,
                type: [cred.type],
                issuanceDate: dayjs_1.default.utc().toISOString(),
                expirationDate: dayjs_1.default
                    .utc()
                    .add(2, 'month')
                    .toISOString(),
                privateKey: Buffer.from('ca2eeb77a6d85f208cd852307c7ef2e66df2962e9b3ca4943923b6ffc38c8277', 'hex'),
                revocation: {
                    '@context': 'placeholder',
                    token: '',
                },
            });
            if (req.query['claim-kit-from'] === 'qr') {
                sender_1.sendNotification({
                    recipient: req.params.id,
                    type: 'notif/cred-claimed',
                    payload: JSON.stringify(vc),
                });
                yield cred.destroy();
            }
            else {
                yield cred.update({ claimed: true, vc });
            }
            return reply.status(200).send({ vc });
        }
        catch (_a) {
            return reply.status(400).send({});
        }
    }));
};
//# sourceMappingURL=cred.js.map