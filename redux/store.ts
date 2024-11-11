import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./slices/usersSlice";
import tasksReducer from "./slices/tasksSlice";

const store = configureStore({
  reducer: {
    users: usersReducer,
    tasks: tasksReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
