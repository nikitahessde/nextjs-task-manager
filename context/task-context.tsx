'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { ObjectId } from 'mongodb';

const TaskContext = createContext<{
    tasks: Task[];
    addTask: (task: Task) => void;
    removeTask: (id: ObjectId) => void;
    changeStatus: (id: ObjectId, status: string) => void;
    updateTask: (id: ObjectId, updates: Partial<Task>) => void;
}>({
    tasks: [],
    addTask: () => {},
    removeTask: () => {},
    changeStatus: () => {},
    updateTask: () => {}
});

interface Task {
    _id?: ObjectId;
    uuid: string;
    name: string;
    description: string;
    status: string;
    createdAt: Date;
}

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [tasks, setTasks] = useState<Task[]>([]);

    const fetchTasks = async () => {
        const response = await fetch('http://localhost:4000/tasks');
        const data = await response.json();
        setTasks(data);
    };

    const addTask = async (task: Omit<Task, '_id'>) => {
        const response = await fetch('http://localhost:4000/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(task),
        });
        const newTask = await response.json();
        setTasks((prevTasks) => [...prevTasks, newTask]);
    };

    const removeTask = async (_id: ObjectId) => {
        await fetch(`http://localhost:4000/tasks/${_id}`, {
            method: 'DELETE',
        });
        setTasks(tasks.filter(task => task._id !== _id));
    };

    const changeStatus = async (_id: ObjectId, status: string) => {
        const response = await fetch(`http://localhost:4000/tasks/${_id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status }),
        });
        const updatedTask = await response.json();
        setTasks(tasks.map(task => task._id === _id ? updatedTask : task));
    };

    const updateTask = async (_id: ObjectId, updates: Partial<Task>) => {
        const response = await fetch(`http://localhost:4000/tasks/${_id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updates),
        });
        const updatedTask = await response.json();
        setTasks(tasks.map(task => task._id === _id ? updatedTask : task));
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <TaskContext.Provider value={{ tasks, addTask, removeTask, changeStatus, updateTask }}>
            {children}
        </TaskContext.Provider>
    );
};

export const useTasks = () => {
    return useContext(TaskContext);
};