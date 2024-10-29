import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../common/axiosInstance";

export const getDocument = createAsyncThunk(
  "editor/getDocument",
  async (payload, thunkapi) => {
    console.log(thunkapi.getState());
    try {
      const response = await axiosInstance.get(window.location.origin + `/api/documents/${payload}`);
      const results = await response.data;
      console.log(results);
      return results;
    } catch (err) {
      return thunkapi.rejectWithValue(err.message);
    }
  }
);
