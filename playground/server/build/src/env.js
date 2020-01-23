"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const getVar = (config) => {
    const { name, required, type } = config;
    const value = process.env[name];
    if (typeof value === 'undefined') {
        if (required)
            throw new Error(`Missing env var: ${name}`);
        return undefined;
    }
    switch (config.type) {
        case 'string':
            return value;
        case 'number':
            const parsed = parseInt(value, config.radix || 10);
            if (Number.isNaN(parsed))
                throw new Error(`${name} is not a number`);
            return parsed;
        case 'bool':
            const isTrue = ['true', 't', 'yes', 'y'].includes(value.toLowerCase());
            const isFalse = ['false', 'f', 'no', 'n'].includes(value.toLowerCase());
            if (isTrue)
                return true;
            if (isFalse)
                return false;
            throw new Error(`${name} is not a valid bool value: ${value}`);
        case 'object':
            try {
                return JSON.parse(value);
            }
            catch (e) {
                throw new Error(`Failed to parse ${name}. ${e}`);
            }
        case 'enum':
            if (config.values.includes(value))
                return value;
            throw new Error(`${name} is not contained in enum values ${config.values}`);
        default:
            throw new Error(`Unsupported type: ${type}`);
    }
};
exports.getEnv = () => ({
    port: getVar({ name: 'PORT', type: 'number', required: true }),
    host: getVar({ name: 'HOST', type: 'string' }),
    sessionSecret: getVar({ name: 'SESSION_SECRET', type: 'string' }),
    amqp: getVar({ name: 'AMQP', type: 'object' }),
});
//# sourceMappingURL=env.js.map