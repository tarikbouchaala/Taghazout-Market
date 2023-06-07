import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import EndPoint from "../../settings/EndPoint";

export const GetSettings = createAsyncThunk(
  "setting/Get",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      // const cachedsettings = thunkAPI.getState().setting.settings;


      // if (cachedsettings.length > 0) {
      //   return cachedsettings;
      // }else{
        const res = await EndPoint.get("/setting");
        const data = res.data;
        return data;
      // }

    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);











export const Savesetting = createAsyncThunk(
  "setting/Store",
  async (body, { rejectWithValue }) => {
    try {
      const res = await EndPoint.post("/setting", body);
      const data = res.data.data;
    //   console.log('dataaaaa settings',data)
      return data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        return rejectWithValue(error.response.data.error);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);





const settingSlice = createSlice({
  name: "setting",
  initialState: {
    isLoading: false,
    error: {},
    settings: {},
  },

  extraReducers: (builder) => {
    builder
    .addCase(GetSettings.fulfilled, (state, { payload }) => {
      state.settings = payload.data;
    })
  
    .addCase(Savesetting.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(Savesetting.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.settings = payload.settings;
      
      })
    .addCase(Savesetting.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.error = payload;
    })

  },
});
export default settingSlice.reducer;
