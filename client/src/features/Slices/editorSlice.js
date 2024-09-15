import { createSlice } from "@reduxjs/toolkit";
import { getDocument } from "../API/getDocument";

const initialState = {
  code: [],
  isLoading: false,
  error: "",
  sessionData: {}, // Store session data
  isExpired: false,
};

const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    addSessionData: (state, action) => {
      console.log("acgtion", action);
      state.sessionData = action.payload; // Update session data
    },
    updateSessionExpiry: (state, action) => {
      state.isExpired = true;
    },
    removeSessionData: (state, action) => {
      state.isExpired = false;
      state.sessionData = {};
      state.code = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getDocument.fulfilled, (state, { payload }) => {
      state.code = payload;
      state.isLoading = false;
    });
    builder.addCase(getDocument.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getDocument.rejected, (state, { payload }) => {
      state.error = payload;
      state.isLoading = false;
    });
  },
});

export const { addSessionData, removeSessionData } = editorSlice.actions;
export default editorSlice.reducer;
