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
exports.createTask = void 0;
const express_1 = require("express");
const data_source_1 = require("../data-source");
const Task_1 = require("../entities/Task");
const router = (0, express_1.Router)();
const getTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const taskRepository = data_source_1.AppDataSource.getRepository(Task_1.Task);
        const tasks = yield taskRepository.find();
        res.json(tasks);
    }
    catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const taskRepo = data_source_1.AppDataSource.getRepository(Task_1.Task);
        const { title, description, status, dueDate } = req.body;
        const newTask = taskRepo.create({
            title,
            description,
            status,
            dueDate,
        });
        yield taskRepo.save(newTask);
        res.status(201).json(newTask);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to create task', details: err });
    }
});
exports.createTask = createTask;
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { title, description, status, dueDate } = req.body;
        const taskRepository = data_source_1.AppDataSource.getRepository(Task_1.Task);
        const task = yield taskRepository.findOneBy({ id });
        if (!task) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }
        const allowedStatuses = ['todo', 'in_progress', 'done'];
        if (status && !allowedStatuses.includes(status)) {
            res.status(400).json({ error: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}` });
            return;
        }
        if (title !== undefined)
            task.title = title;
        if (description !== undefined)
            task.description = description;
        if (status !== undefined)
            task.status = status;
        if (dueDate !== undefined)
            task.dueDate = dueDate ? new Date(dueDate) : undefined;
        const updatedTask = yield taskRepository.save(task);
        res.json(updatedTask);
    }
    catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const taskRepository = data_source_1.AppDataSource.getRepository(Task_1.Task);
        const result = yield taskRepository.delete({ id });
        if (result.affected === 0) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }
        res.sendStatus(204);
    }
    catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.get('/tasks', getTasks);
router.post('/tasks', exports.createTask);
router.put('/tasks/:id', updateTask);
router.delete('/tasks/:id', deleteTask);
exports.default = router;
