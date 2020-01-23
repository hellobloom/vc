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
const fastify_1 = __importDefault(require("fastify"));
const fastify_helmet_1 = __importDefault(require("fastify-helmet"));
const fastify_cookie_1 = __importDefault(require("fastify-cookie"));
const env_1 = require("@server/env");
const routes_1 = require("@server/routes");
const worker_1 = require("@server/socket/worker");
const models_1 = require("@server/models");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    models_1.initModels();
    const env = env_1.getEnv();
    const app = fastify_1.default({ logger: true, bodyLimit: 10000000 });
    app.register(fastify_helmet_1.default);
    app.register(fastify_cookie_1.default, { secret: env.sessionSecret });
    if (env.host) {
        app.listen(env.port, env.host);
    }
    else {
        app.listen(env.port);
    }
    routes_1.applyApiRoutes(app);
    worker_1.applySocketWorker(app);
    app.all('*', (_, reply) => {
        console.log('Unhandled request');
        reply.status(404).send({ success: false, error: 'Not found' });
    });
});
main()
    .then(() => {
    console.log('playground successfully started');
})
    .catch((e) => {
    console.log('playground failed to start', e);
});
//# sourceMappingURL=index.js.map