import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Group {
  uuid: string;
  name: string;
  createdAt: Date;
  users?: string[];
}

interface GroupState {
  groups: Group[];
}

const initialState: GroupState = {
  groups: [],
};

const groupsSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {
    setGroups(state, action: PayloadAction<Group[]>) {
      state.groups = action.payload;
    },
    addGroup(state, action: PayloadAction<Group>) {
      state.groups.push(action.payload);
    },
    editGroup(state, action: PayloadAction<{ uuid: string; updates: Partial<Group> }>) {
      const groupIndex = state.groups.findIndex((group) => group.uuid === action.payload.uuid);
      if (groupIndex !== -1) {
        state.groups[groupIndex] = { ...state.groups[groupIndex], ...action.payload.updates };
      }
    },
    deleteGroup(state, action: PayloadAction<{ uuid: string }>) {
      state.groups = state.groups.filter((group) => group.uuid !== action.payload.uuid);
    },
  },
});

export const { setGroups, addGroup, editGroup, deleteGroup } = groupsSlice.actions;
export default groupsSlice.reducer;
