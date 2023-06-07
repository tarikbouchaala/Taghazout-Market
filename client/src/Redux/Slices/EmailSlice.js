import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import EndPoint from "../../settings/EndPoint";

export const contactMail = createAsyncThunk(
  "Email/ContactUs",
  async (body, { rejectWithValue }) => {
    try {
      const res = await EndPoint.post(`/contactMail`, body);
      return res.data;
    } catch (error) {
      if (error.message === "Network Error") {
        return rejectWithValue("Check The Server");
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);
const EmailSlice = createSlice({
  name: "Email",
  initialState: {
    data: [],
    error: null,
    isLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(contactMail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(contactMail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.data = action.payload;
      })
      .addCase(contactMail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default EmailSlice.reducer;
