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
const ws_1 = require("ws");
const cookie_1 = __importDefault(require("cookie"));
const cookie_signature_1 = __importDefault(require("cookie-signature"));
const uuidv4_1 = require("uuidv4");
const env_1 = require("@server/env");
const cookies_1 = require("@server/cookies");
const amqp_1 = require("@server/amqp");
const socketMapping = {};
const pingMessage = JSON.stringify(['redundant-ping', {}]);
const addSocket = (socket, tokens) => {
    socket.tokens = tokens;
    console.log('Registering socket with tokens', JSON.stringify(tokens));
    tokens.forEach(token => {
        if (socketMapping[token] === undefined) {
            socketMapping[token] = [];
        }
        socketMapping[token].push(socket);
    });
};
const removeSocket = (socket, tokens) => {
    console.log('Removing socket with tokens', socket.tokens);
    try {
        socket.close();
    }
    catch (err) {
        console.log("Couldn't close socket", err);
    }
    tokens.forEach((token) => {
        const arr = socketMapping[token];
        if (!arr) {
            return;
        }
        else if (arr.length === 1 && arr[0] === socket) {
            delete socketMapping[token];
        }
        else {
            socketMapping[token] = arr.filter(x => x !== socket);
        }
    });
};
exports.handleMessage = (msg, channel) => {
    try {
        if (!msg)
            return;
        channel.ack(msg);
        // console.log('AMQP message content', msg.content.toString())
        const decoded = JSON.parse(msg.content.toString());
        console.log('AMQP message decoded', decoded);
        const uSockets = socketMapping[decoded.recipient];
        if (!uSockets || uSockets.length === 0) {
            console.log('Zero interested sockets');
            return;
        }
        uSockets.forEach(socket => {
            if (socket.readyState === ws_1.OPEN) {
                socket.send(JSON.stringify([decoded.type, decoded.payload]));
            }
            else {
                console.log('AMQP Socket had non-acceptable readyState', socket.readyState);
            }
        });
    }
    catch (err) {
        console.log('AMQP Error handling socket message', msg, err);
    }
};
exports.applySocketWorker = ({ server }) => {
    const wss = new ws_1.Server({ server });
    amqp_1.getChannel(exports.handleMessage);
    wss.on('connection', (socket, request) => __awaiter(void 0, void 0, void 0, function* () {
        if (!request.headers.cookie) {
            console.log('SOCKETWORKER: Terminating socket with no cookie');
            socket.terminate();
            return;
        }
        const sessionSecret = env_1.getEnv().sessionSecret;
        const cookieObj = cookie_1.default.parse(request.headers.cookie);
        const tokens = [];
        const cookiesToCheckFor = [
            {
                key: cookies_1.wsCookieKey,
                validator: uuidv4_1.isUuid,
            },
        ];
        cookiesToCheckFor.forEach(({ key, validator }) => {
            const signedCookie = cookieObj[key];
            if (signedCookie) {
                const value = cookie_signature_1.default.unsign(signedCookie, sessionSecret);
                if (value && validator(value)) {
                    tokens.push(value);
                }
                else {
                    socket.terminate();
                }
            }
        });
        // Don't terminate here, the client will just keep trying to connect
        if (tokens.length === 0)
            return;
        addSocket(socket, tokens);
        socket.on('pong', () => {
            socket.last_pong = new Date().getTime();
        });
    }));
    wss.on('error', error => {
        console.log(`[WebSocket] An error occured within WebSockets`, error);
    });
    setInterval(() => {
        console.log('Socket health check', Object.keys(socketMapping).reduce((acc, key) => {
            const ref = socketMapping[key];
            if (ref) {
                acc[key] = ref.length;
            }
            return acc;
        }, {}));
    }, 10000);
    setInterval(() => {
        Object.keys(socketMapping).forEach((token) => {
            const arr = socketMapping[token];
            if (!arr) {
                return;
            }
            arr.forEach(socket => {
                const now = new Date().getTime();
                if (now - socket.last_pong > 18000 || socket.readyState === ws_1.CLOSED) {
                    return removeSocket(socket, socket.tokens);
                }
                socket.ping(() => undefined);
                if (socket.readyState === ws_1.OPEN)
                    socket.send(pingMessage);
            });
        });
    }, 6000);
};
//# sourceMappingURL=worker.js.map