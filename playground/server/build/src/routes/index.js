"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cred_1 = require("./cred");
const share_1 = require("./share");
exports.applyApiRoutes = (app) => {
    cred_1.applyCredRoutes(app);
    share_1.applyShareRoutes(app);
};
//# sourceMappingURL=index.js.map