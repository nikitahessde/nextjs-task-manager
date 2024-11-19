import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./slices/usersSlice";
import tasksReducer from "./slices/tasksSlice";
import groupsReducer from "./slices/groupsSlice";

const store = configureStore({
  reducer: {
    users: usersReducer,
    tasks: tasksReducer,
    groups: groupsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
