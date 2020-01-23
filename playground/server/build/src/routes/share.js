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
const uuidv4_1 = require("uuidv4");
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
                .required(['types']),
        },
    }, (req, reply) => __awaiter(void 0, void 0, void 0, function* () {
        const id = uuidv4_1.uuid();
        yield models_1.ShareRequest.create({ id, requestedTypes: req.body.types });
        return reply.status(200).send({ id });
    }));
    app.get('/api/v1/share/:id/get-types', {
        schema: {
            params: fluent_schema_1.default.object()
                .prop('id', fluent_schema_1.default.string().format('uuid'))
                .required(['id']),
        },
    }, (req, reply) => __awaiter(void 0, void 0, void 0, function* () {
        const request = yield models_1.ShareRequest.findOne({ where: { id: req.params.id } });
        if (!request)
            return reply.status(404).send({});
        if (request.sharedTypes)
            return reply.status(400).send({});
        return reply
            .status(200)
            .setCookie(cookies_1.wsCookieKey, req.params.id, { signed: true, path: '/' })
            .send({ types: request.requestedTypes });
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
        if (!request.sharedTypes)
            return reply.status(404).send({});
        return reply.status(200).send({ types: request.sharedTypes });
    }));
    app.post('/api/v1/share/recieve', {
        schema: {
            body: fluent_schema_1.default.object()
                .prop('token', fluent_schema_1.default.string().format('uuid'))
                .required(['token']),
        },
    }, (req, reply) => __awaiter(void 0, void 0, void 0, function* () {
        const request = yield models_1.ShareRequest.findOne({ where: { id: req.body.token } });
        console.log({ request });
        if (!request)
            return reply.status(404).send({});
        const outcome = yield verify_kit_1.validateVerifiablePresentationResponse(req.body, { version: 'v0' });
        console.log({ outcome });
        if (outcome.kind === 'invalid') {
            return reply.status(400).send({ message: 'Share payload could not be validated' });
        }
        const sharedTypes = outcome.data.verifiableCredential.map(vc => vc.type);
        const hasAllRequestedTypes = request.requestedTypes.every(requested => sharedTypes.includes(requested));
        console.log({ hasAllRequestedTypes });
        if (!hasAllRequestedTypes)
            return reply.status(400).send({ success: false });
        yield request.update({ sharedTypes: outcome.data.verifiableCredential.map(vc => vc.type) });
        sender_1.sendNotification({
            recipient: req.body.token,
            type: 'notif/share-recieved',
            payload: JSON.stringify(sharedTypes),
        });
        return reply.status(200).send({ success: true });
    }));
};
//# sourceMappingURL=share.js.map