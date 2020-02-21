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
Object.defineProperty(exports, "__esModule", { value: true });
const amqp_1 = require("@server/amqp");
exports.sendNotification = (messageObj) => __awaiter(void 0, void 0, void 0, function* () {
    const channel = yield amqp_1.getChannel();
    const queue = amqp_1.getQueue();
    const exchange = amqp_1.getExchange();
    yield channel.publish(exchange, queue, messageObj);
});
//# sourceMappingURL=sender.js.map