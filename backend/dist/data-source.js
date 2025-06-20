"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const Task_1 = require("./entities/Task"); // adjust path
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'sqlite',
    database: 'db.sqlite', // this should be a valid SQLite file or a new one
    entities: [Task_1.Task],
    synchronize: true, // auto creates tables; use with caution in production
    logging: false,
});
