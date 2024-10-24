"use client";

import { useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";

interface Task {
  uuid: string;
  name: string;
  description: string;
  status: string;
  createdAt: Date;
  assignedTo: string;
}

const TaskContext = createContext<{
  tasks: Task[];
  addTask: (task: Task) => void;
  removeTask: (uuid: string) => void;
  changeStatus: (uuid: string, status: string) => void;
  updateTask: (uuid: string, updates: Partial<Task>) => void;
}>({
  tasks: [],
  addTask: () => {},
  removeTask: () => {},
  changeStatus: () => {},
  updateTask: () => {},
});

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { data: session } = useSession();

  const fetchTasks = async () => {
    const response = await fetch("/api/tasks");
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error fetching tasks:", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    setTasks(data);
  };

  const addTask = async (task: Omit<Task, "_id">) => {
    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });
    const newTask = await response.json();
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const removeTask = async (uuid: string) => {
    await fetch(`/api/tasks/${uuid}`, {
      method: "DELETE",
    });
    setTasks(tasks.filter((task) => task.uuid !== uuid));
  };

  const changeStatus = async (uuid: string, status: string) => {
    const response = await fetch(`/api/tasks/${uuid}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });
    const updatedTask = await response.json();
    setTasks(tasks.map((task) => (task.uuid === uuid ? updatedTask : task)));
  };

  const updateTask = async (uuid: string, updates: Partial<Task>) => {
    const response = await fetch(`/api/tasks/${uuid}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });
    const updatedTask = await response.json();
    setTasks(tasks.map((task) => (task.uuid === uuid ? updatedTask : task)));
  };

  useEffect(() => {
    if (session) {
      fetchTasks();
    }
  }, [session]);

  return (
    <TaskContext.Provider value={{ tasks, addTask, removeTask, changeStatus, updateTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  return useContext(TaskContext);
};
