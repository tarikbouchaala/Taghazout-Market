import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import EndPoint from "../../settings/EndPoint";

export const Getsliders = createAsyncThunk(
  "slider/Get",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const cachedsliders = thunkAPI.getState().Slider.sliders;
      if (cachedsliders.length > 0) {
        return cachedsliders;
      } else {
        const res = await EndPoint.get("/slider");
        const data = res.data;
        console.log('res',data)
        return data;
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const Saveslider = createAsyncThunk(
  "slider/Store",
  async (body, { rejectWithValue }) => {
    try {
      const res = await EndPoint.post("/slider", body);
      console.log('reees',res.data)
      return res.data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        return rejectWithValue(error.response.data.error);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);



export const Deleteslider = createAsyncThunk(
  "slider/Delete",
  async (body, { rejectWithValue }) => {
    try {
      const res = await EndPoint.delete("/slider/"+body.id);
      const data = res.data.data;
      // console.log('delete res',data)
      return data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        return rejectWithValue(error.response.data.error);
      } else {
        return rejectWithValue(error.message);
      }
      // return rejectWithValue(error.message)
    }
  }
);

const sliderslice = createSlice({
  name: "slider",
  initialState: {
    isLoading: false,
    error: {},
    sliders: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(Getsliders.fulfilled, (state, { payload }) => { 
        // console.log('payloed',payload.data)
        state.sliders = payload;
      })
      .addCase(Saveslider.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(Saveslider.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        if (payload.error) {
          state.error = payload.error;
        } else {
          state.sliders.push(payload.data);
        }
      })
      .addCase(Saveslider.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
         // -----------------------delete----------------------------

         .addCase(Deleteslider.fulfilled, (state, { payload }) => {
          state.isLoading = false;
          state.sliders = state.sliders.filter(slider=>slider.id !== payload.id);
        });
  },
});

export default sliderslice.reducer;