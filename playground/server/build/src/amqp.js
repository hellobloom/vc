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
const amqp_connection_manager_1 = __importDefault(require("amqp-connection-manager"));
const amqplib_1 = __importDefault(require("amqplib"));
const env_1 = require("@server/env");
exports.getExchange = () => {
    const e = env_1.getEnv();
    return e.amqp.exchange || 'amq.fanout';
};
exports.getQueue = () => {
    const e = env_1.getEnv();
    return e.amqp.queue + '-' + uuidv4_1.uuid();
};
exports.establishExchange = () => __awaiter(void 0, void 0, void 0, function* () {
    const e = env_1.getEnv();
    const conn = yield amqplib_1.default.connect(e.amqp.host);
    const tempChan = yield conn.createChannel();
    try {
        yield tempChan.assertExchange(exports.getExchange(), 'fanout');
        console.log('AMQP: Exchange created...');
        yield tempChan.close();
    }
    catch (err) {
        console.log('AMQP: Exchange exists, continuing...', err);
    }
});
exports.getChannel = (callbackFn) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('AMQP: Initializing...');
    const q = exports.getQueue();
    const exchange = exports.getExchange();
    yield exports.establishExchange();
    const e = env_1.getEnv();
    const conn = amqp_connection_manager_1.default.connect([e.amqp.host]);
    conn.on('connect', () => {
        console.log('AMQP: connected');
    });
    conn.on('disconnect', ({ err }) => {
        console.log('AMQP: disconnected', err);
    });
    const chanW = conn.createChannel({
        json: true,
        setup: (channel) => __awaiter(void 0, void 0, void 0, function* () {
            console.log('AMQP: binding', exchange, q);
            yield channel.assertQueue(q);
            yield channel.bindQueue(q, exchange);
            if (callbackFn) {
                yield channel.consume(q, msg => {
                    if (msg !== null)
                        callbackFn(msg, channel);
                });
            }
        }),
    });
    return chanW;
});
//# sourceMappingURL=amqp.js.map