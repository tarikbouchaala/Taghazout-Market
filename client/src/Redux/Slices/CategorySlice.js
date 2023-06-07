import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import EndPoint from "../../settings/EndPoint";

export const GetCategories = createAsyncThunk(
  "Category/Get",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      // const cachedCategories = thunkAPI.getState().Category.Categories;

      // if (cachedCategories.length > 0) {
      //   return cachedCategories;
      // }else{
      const res = await EndPoint.get("/category");
      return res.data;
      // }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const SaveCategory = createAsyncThunk(
  "Category/Store",
  async (body, { rejectWithValue }) => {
    try {
      const res = await EndPoint.post("/category", body);
      const data = res.data;
      // console.log('dataaaaa',data)
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
export const DeleteCategory = createAsyncThunk(
  "Category/Delete",
  async (body, { rejectWithValue }) => {
    try {
      const res = await EndPoint.delete("/category/" + body.id);
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

const CategorySlice = createSlice({
  name: "Category",
  initialState: {
    isLoading: false,
    error: {},
    Categories: [],
  },

  extraReducers: (builder) => {
    builder
      .addCase(GetCategories.fulfilled, (state, { payload }) => {
        state.Categories = payload.categories;
      })

      .addCase(SaveCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(SaveCategory.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        if (payload.error) {
          state.error = payload.error;
        } else {
          state.Categories.push(payload.data);
        }
      })
      .addCase(SaveCategory.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      // -----------------------Delete----------------------------
      .addCase(DeleteCategory.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.Categories = state.Categories.filter(
          (category) => category.id !== payload.id
        );
      });
  },
});
export default CategorySlice.reducer;
