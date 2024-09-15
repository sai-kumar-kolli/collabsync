import { configureStore } from "@reduxjs/toolkit";
import editorSlice from "../features/Slices/editorSlice";

const store = configureStore({
  reducer: {
    editor: editorSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
