"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const data_source_1 = require("./data-source");
const tasks_1 = __importDefault(require("./routes/tasks"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api', tasks_1.default);
data_source_1.AppDataSource.initialize()
    .then(() => {
    console.log('✅ SQLite DB connected.');
    app.listen(PORT, () => {
        console.log(`🚀 http://localhost:${PORT}`);
    });
})
    .catch((error) => {
    console.error('❌ Database connection failed:', error);
});
