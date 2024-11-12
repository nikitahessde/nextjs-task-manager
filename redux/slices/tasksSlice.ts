import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Task {
  uuid: string;
  name: string;
  description: string;
  status: string;
  assignedTo: string;
}

interface TaskState {
  tasks: Task[];
  searchTerm: string;
  sortOrder: "asc" | "desc";
}

const initialState: TaskState = {
  tasks: [],
  searchTerm: "",
  sortOrder: "asc",
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setTasks(state, action: PayloadAction<Task[]>) {
      state.tasks = action.payload?.map((task) => ({
        uuid: task.uuid,
        name: task.name,
        description: task.description,
        status: task.status,
        assignedTo: task.assignedTo,
      }));
    },
    resetTasks(state) {
      state.tasks = [];
    },
    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload;
    },
    setSortOrder(state, action: PayloadAction<"asc" | "desc">) {
      state.sortOrder = action.payload;
    },
    changeTaskStatus(state, action: PayloadAction<{ uuid: string; status: string }>) {
      const task = state.tasks.find((task) => task.uuid === action.payload.uuid);
      if (task) {
        task.status = action.payload.status;
      }
    },
    deleteTask(state, action: PayloadAction<{ uuid: string }>) {
      state.tasks = state.tasks.filter((task) => task.uuid !== action.payload.uuid);
    },
  },
});

export const { setTasks, resetTasks, setSearchTerm, setSortOrder, changeTaskStatus, deleteTask } =
  tasksSlice.actions;
export default tasksSlice.reducer;
