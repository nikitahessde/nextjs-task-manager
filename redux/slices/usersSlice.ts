import { UserRole } from "@/models/User";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  email: string;
  name: string;
  roles: UserRole[];
}

interface UsersState {
  users: User[];
  searchTerm: string;
  sortOrder: "asc" | "desc";
}

const initialState: UsersState = {
  users: [],
  searchTerm: "",
  sortOrder: "asc",
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers(state, action: PayloadAction<User[]>) {
      state.users = action.payload.map((user) => ({
        email: user.email,
        name: user.name,
        roles: [...user.roles],
      }));
    },
    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload;
    },
    setSortOrder(state, action: PayloadAction<"asc" | "desc">) {
      state.sortOrder = action.payload;
    },
  },
});

export const { setUsers, setSearchTerm, setSortOrder } = usersSlice.actions;
export default usersSlice.reducer;
