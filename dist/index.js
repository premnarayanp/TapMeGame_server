"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const bot_1 = require("./bot");
const graphql_yoga_1 = require("graphql-yoga");
const QL_Schema_1 = require("./QL_Schema");
//"start": "nodemon --exec ts-node src/index.ts",
const port = process.env.PORT || 3000;
const app = (0, express_1.default)();
// Initialize Yoga
const yoga = (0, graphql_yoga_1.createYoga)({
    schema: QL_Schema_1.schema,
});
// Apply Yoga as middleware to Express
app.use('/graphql', yoga);
//start telegram bot API
(0, bot_1.initTelegramBot)();
app.get("/", (req, res) => {
    res.send("Hello, TypeScript with Express!");
});
app.listen(port, () => {
    console.log(`Server is running on port:${port}`);
});
