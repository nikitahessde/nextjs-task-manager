'use client';

import { createContext, useContext, useState } from 'react';

const TaskContext = createContext<{
    tasks: Task[];
    addTask: (task: Task) => void;
    removeTask: (taskId: string) => void;
    changeStatus: (taskId: string, status: string) => void;
}>({
    tasks: [],
    addTask: () => {},
    removeTask: () => {},
    changeStatus: () => {}
});

interface Task {
    id: string;
    name: string;
    description: string;
    status: string;
    createdAt: Date;
}

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [tasks, setTasks] = useState<Task[]>([]);

    const addTask = (task: Task) => {
        setTasks([...tasks, task]);
    };

    const removeTask = (taskId: string) => {
        setTasks(tasks.filter(task => task.id !== taskId));
    };

    const changeStatus = (taskId: string, status: string) => {
        setTasks(tasks.map(task => task.id === taskId ? { ...task, status: status } : task));
    };

    return (
        <TaskContext.Provider value={{ tasks, addTask, removeTask, changeStatus }}>
            {children}
        </TaskContext.Provider>
    );
};

export const useTasks = () => {
    return useContext(TaskContext);
};