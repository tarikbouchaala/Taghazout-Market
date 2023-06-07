import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import EndPoint from "../../settings/EndPoint";

export const fetchFavorites = createAsyncThunk(
  "wishlist/fetchFavorites",
  async (token, { rejectWithValue }) => {
    try {
      const res = await EndPoint.get("/favorit", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

export const addToFavorites = createAsyncThunk(
  "wishlist/addToFavorites",
  async ({ productId, token }, { rejectWithValue }) => {
    try {
      const res = await EndPoint.post(
        "/favorit",
        { product_id: productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
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

export const removeFromFavorites = createAsyncThunk(
  "wishlist/removeFromFavorites",
  async ({ productId, token }, { rejectWithValue }) => {
    try {
      const res = await EndPoint.delete(`/favorit/` + productId, {
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

const WishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    data: [],
    wishlist: null,
    loading: false,
    error: null,
  },
  reducers: {
    emptyWishlist: (state, action) => {
      state.wishlist = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload;
        state.wishlist = action.payload.wishlist;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        if (action.payload.status === 200) {
          state.wishlist = action.payload.wishlist;
        }
      })
      .addCase(removeFromFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        if (action.payload.status == 200) {
          state.wishlist = action.payload.wishlist;
        }
      })
      .addCase(removeFromFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { emptyWishlist } = WishlistSlice.actions;
export default WishlistSlice.reducer;
