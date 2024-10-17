'use client'

import { useTasks } from "@/context/task-context";

export const TaskDetails = () => {
  const { tasks } = useTasks();

  return (
    <div className="border-2 border-primary bg-secondary rounded-lg p-4 flex flex-col gap-4">
      <div className="overflow-x-auto rounded-lg w-full">
            <table className="w-full">
                <thead>
                    <tr className="bg-gray-200 text-gray-600 text-sm leading-normal">
                        <th className="py-3 px-6 text-left">Name</th>
                        <th className="py-3 px-6 text-left">Description</th>
                        <th className="py-3 px-6 text-left">Status</th>
                        <th className="py-3 px-6 text-left">Created At</th>
                    </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                    {tasks.length ? (
                        tasks.map((task) => (
                            <tr key={task.id} className="border-b border-gray-200 hover:bg-gray-100 w-full">
                                <td className="py-3 px-6 text-left">{task.name}</td>
                                <td className="py-3 px-6 text-left">{task.description}</td>
                                <td className="py-3 px-6 text-left">
                                    {task.status === 'todo' ? 'To do' : 
                                    task.status === 'inProgress' ? 'In Progress' : 
                                    'Done'}
                                </td>
                                <td className="py-3 px-6 text-left">{task.createdAt.toDateString()}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} className="py-3 px-6 text-center text-base text-primary">No tasks</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default TaskDetails;