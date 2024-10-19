import express from 'express';
import mongoose from 'mongoose';
const router = express.Router();

const taskSchema = new mongoose.Schema({
    uuid: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, default: 'todo' },
    createdAt: { type: Date, default: Date.now },
}, { collection: 'task' });

const Task = mongoose.model('task', taskSchema);

router.post('/', async (req, res) => {
    const task = new Task({ ...req.body });
    try {
        const savedTask = await task.save();
        res.status(200).json(savedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.status(200).send();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;