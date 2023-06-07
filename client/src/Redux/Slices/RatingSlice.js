import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import EndPoint from "../../settings/EndPoint";

export const rateProduct = createAsyncThunk(
  "productRating/rateProduct",
  async ({ product_id, body, token }, { rejectWithValue }) => {
    try {
      const res = await EndPoint.post(`/RateProduct/${product_id}`, body, {
        headers: { Authorization: `Bearer ${token}` },
      });
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

export const deleteRating = createAsyncThunk(
  "productRating/deleteRating",
  async ({ product_id, token }, { rejectWithValue }) => {
    try {
      const res = await EndPoint.delete(`/rating/${product_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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

const ProductRatingSlice = createSlice({
  name: "productRating",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(rateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload;
      })
      .addCase(rateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteRating.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRating.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload;
      })
      .addCase(deleteRating.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default ProductRatingSlice.reducer;
