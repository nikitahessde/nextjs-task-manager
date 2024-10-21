'use client'

import { DeleteOutline } from "@mui/icons-material";
import { useTasks } from "@/context/task-context";
import { Tooltip } from '@mui/material';

interface Task {
    uuid: string;
    name: string;
    description: string;
    status: string;
}

export const TaskList = () => {
    const { tasks, removeTask, changeStatus } = useTasks();
    return (
        <div className="border-2 border-primary bg-secondary rounded-lg p-4 flex flex-col gap-4 overflow-y-auto">
            <p className="text-xl font-semibold">Task list</p>
            <div className="flex flex-col gap-4">
                {tasks.length ? (
                    tasks.map((task: Task) => (
                        <div key={task.uuid} className="flex justify-between items-center border py-2 px-4 rounded-lg w-full">
                            <div className="flex items-center flex-grow w-2/3">
                                <div className="flex-grow max-w-full">
                                    <p className="font-semibold text-base break-all">{task.name}</p>
                                    <Tooltip title={task.description} placement="top">
                                        <p className="text-sm break-words text-gray-500 truncate">
                                            {task.description}
                                        </p>
                                    </Tooltip>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 w-1/3 justify-end">
                                <select 
                                className="border rounded-md px-2 py-1 text-sm" 
                                value={task.status} 
                                onChange={(e) => task.uuid && changeStatus(task.uuid, e.target.value)}
                                >
                                    <option value="todo">To do</option>
                                    <option value="inProgress">In progress</option>
                                    <option value="done">Done</option>
                                </select>
                                <DeleteOutline className="cursor-pointer" onClick={() => task.uuid && removeTask(task.uuid)}/>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No tasks to show</p>
                )}
            </div>
        </div>
    );
  };
  
  export default TaskList;