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
const verify_kit_1 = require("@bloomprotocol/verify-kit");
const models_1 = require("@server/models");
const cookies_1 = require("@server/cookies");
const sender_1 = require("@server/socket/sender");
exports.applyShareRoutes = (app) => {
    app.post('/api/v1/share/create', {
        schema: {
            body: fluent_schema_1.default.object()
                .prop('types', fluent_schema_1.default.array().items(fluent_schema_1.default.string()))
                .prop('responseVersion', fluent_schema_1.default.enum(['v0', 'v1']))
                .required(['types', 'responseVersion']),
        },
    }, (req, reply) => __awaiter(void 0, void 0, void 0, function* () {
        const request = yield models_1.ShareRequest.create({ requestedTypes: req.body.types, responseVersion: req.body.responseVersion });
        return reply.status(200).send({ id: request.id });
    }));
    app.get('/api/v1/share/:id/get-config', {
        schema: {
            params: fluent_schema_1.default.object()
                .prop('id', fluent_schema_1.default.string().format('uuid'))
                .required(['id']),
        },
    }, (req, reply) => __awaiter(void 0, void 0, void 0, function* () {
        const request = yield models_1.ShareRequest.findOne({ where: { id: req.params.id } });
        if (!request)
            return reply.status(404).send({});
        if (request.verifiableCredential)
            return reply.status(400).send({});
        return reply
            .status(200)
            .setCookie(cookies_1.shareCookieKey, req.params.id, { signed: true, path: '/' })
            .send({ types: request.requestedTypes, responseVersion: request.responseVersion });
    }));
    app.get('/api/v1/share/:id/get-shared-data', {
        schema: {
            params: fluent_schema_1.default.object()
                .prop('id', fluent_schema_1.default.string().format('uuid'))
                .required(['id']),
        },
    }, (req, reply) => __awaiter(void 0, void 0, void 0, function* () {
        const request = yield models_1.ShareRequest.findOne({ where: { id: req.params.id } });
        if (!request)
            return reply.status(404).send({});
        if (!request.verifiableCredential)
            return reply.status(404).send({});
        const { verifiableCredential } = request;
        yield request.destroy();
        return reply.status(200).send({ verifiableCredential });
    }));
    app.post('/api/v1/share/recieve-v0', {
        schema: {
            querystring: fluent_schema_1.default.object()
                .prop('share-kit-from', fluent_schema_1.default.enum(['qr', 'button']))
                .required(['share-kit-from']),
            body: fluent_schema_1.default.object()
                .prop('token', fluent_schema_1.default.string().format('uuid'))
                .required(['token']),
        },
    }, (req, reply) => __awaiter(void 0, void 0, void 0, function* () {
        const request = yield models_1.ShareRequest.findOne({ where: { id: req.body.token } });
        if (!request)
            return reply.status(404).send({});
        const outcome = yield verify_kit_1.validateVerifiablePresentationResponse(req.body, { version: 'v0' });
        if (outcome.kind === 'invalid') {
            return reply.status(400).send({ message: 'Share payload could not be validated' });
        }
        const sharedTypes = outcome.data.verifiableCredential.map(vc => vc.type);
        const hasAllRequestedTypes = request.requestedTypes.every(requested => sharedTypes.includes(requested));
        if (!hasAllRequestedTypes)
            return reply.status(400).send({ success: false });
        const { verifiableCredential } = outcome.data;
        if (req.query['share-kit-from'] === 'qr') {
            sender_1.sendNotification({
                recipient: req.body.token,
                type: 'notif/share-recieved',
                payload: JSON.stringify(verifiableCredential),
            });
            yield request.destroy();
        }
        else {
            yield request.update({ verifiableCredential });
        }
        return reply.status(200).send({ success: true });
    }));
    app.post('/api/v1/share/recieve-v1', {
        schema: {
            querystring: fluent_schema_1.default.object()
                .prop('share-kit-from', fluent_schema_1.default.enum(['qr', 'button']))
                .required(['share-kit-from']),
            body: fluent_schema_1.default.object()
                .prop('proof', fluent_schema_1.default.object()
                .prop('challenge', fluent_schema_1.default.string().format('uuid'))
                .required(['challenge']))
                .required(['proof']),
        },
    }, (req, reply) => __awaiter(void 0, void 0, void 0, function* () {
        const request = yield models_1.ShareRequest.findOne({ where: { id: req.body.proof.challenge } });
        if (!request)
            return reply.status(404).send({});
        const outcome = yield verify_kit_1.validateVerifiablePresentationResponse(req.body, { version: 'v1' });
        if (outcome.kind === 'invalid') {
            return reply.status(400).send({ message: 'Share payload could not be validated', errors: outcome.errors });
        }
        const sharedTypes = outcome.data.verifiableCredential.map(vc => vc.type);
        const hasAllRequestedTypes = request.requestedTypes.every(requested => sharedTypes.some(types => types.includes(requested)));
        if (!hasAllRequestedTypes)
            return reply.status(400).send({ success: false });
        const { verifiableCredential } = outcome.data;
        if (req.query['share-kit-from'] === 'qr') {
            sender_1.sendNotification({
                recipient: req.body.proof.challenge,
                type: 'notif/share-recieved',
                payload: JSON.stringify(verifiableCredential),
            });
            yield request.destroy();
        }
        else {
            yield request.update({ verifiableCredential });
        }
        return reply.status(200).send({ success: true });
    }));
};
//# sourceMappingURL=share.js.map