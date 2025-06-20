import { Router, Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Task } from '../entities/Task';

const router = Router();

const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const taskRepository = AppDataSource.getRepository(Task);
    const tasks = await taskRepository.find();
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};




export const createTask = async (req: Request, res: Response) => {
  try {
    const taskRepo = AppDataSource.getRepository(Task)
    const { title, description, status, dueDate } = req.body

    const newTask = taskRepo.create({
      title,
      description,
      status,
      dueDate,
    })

    await taskRepo.save(newTask)
    res.status(201).json(newTask)
  } catch (err) {
    res.status(500).json({ error: 'Failed to create task', details: err })
  }
}

const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, status, dueDate } = req.body;

    const taskRepository = AppDataSource.getRepository(Task);
    const task = await taskRepository.findOneBy({ id });

    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    const allowedStatuses = ['todo', 'in_progress', 'done'];
    if (status && !allowedStatuses.includes(status)) {
      res.status(400).json({ error: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}` });
      return;
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (dueDate !== undefined) task.dueDate = dueDate ? new Date(dueDate) : undefined;

    const updatedTask = await taskRepository.save(task);
    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const taskRepository = AppDataSource.getRepository(Task);

    const result = await taskRepository.delete({ id });

    if (result.affected === 0) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    res.sendStatus(204);
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

router.get('/tasks', getTasks);
router.post('/tasks', createTask);
router.put('/tasks/:id', updateTask);
router.delete('/tasks/:id', deleteTask);

export default router;
