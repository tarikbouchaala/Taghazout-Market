import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import EndPoint from "../../settings/EndPoint";

export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().Auth.token;
      const response = await EndPoint.get("/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const storeCart = createAsyncThunk(
  "cart/storeCart",
  async (cartItems, { getState, rejectWithValue }) => {
    try {
      const token = getState().Auth.token;
      const response = await EndPoint.post(
        "/cart",
        { cartItems },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async ({ id, quantity }, { getState, rejectWithValue }) => {
    try {
      const token = getState().Auth.token;
      const response = await EndPoint.put(
        `/cart/${id}`,
        { quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const removeCartItem = createAsyncThunk(
  "cart/removeCartItem",
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().Auth.token;
      const response = await EndPoint.delete(`/cart/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const destroyUserCart = createAsyncThunk(
  "cart/destroyUserCart",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().Auth.token;
      const response = await EndPoint.delete(`/deleteCart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: JSON.parse(localStorage.getItem("cart")) || [],
    data: [],
  },
  reducers: {
    addToCart(state, action) {
      const newProduct = action.payload;
      const existingItemIndex = state.cart.findIndex(
        (item) => item.product_id === newProduct.product_id
      );

      if (existingItemIndex !== -1) {
        state.cart[existingItemIndex].quantity += newProduct.quantity;
      } else {
        state.cart.push({ ...newProduct, quantity: 1 });
      }
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    updateCart(state, action) {
      localStorage.setItem("cart", action.payload);
      state.cart = JSON.parse(action.payload);
    },
    updateProductInCart(state, action) {
      const { product_id, quantity } = action.payload;
      const existingItemIndex = state.cart.findIndex(
        (item) => item.product_id === product_id
      );

      if (existingItemIndex !== -1) {
        if (quantity == 0) {
          state.cart = state.cart.filter(
            (item) => item.product_id !== product_id
          );
        } else {
          state.cart[existingItemIndex].quantity = quantity;
        }
      }

      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    deleteFromCart(state, action) {
      const product_id = action.payload;
      state.cart = state.cart.filter((item) => item.product_id !== product_id);

      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    clearCart(state) {
      const cartItems = localStorage.getItem("cart");

      if (cartItems) {
        state.cart = [];
        localStorage.removeItem("cart");
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(storeCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(storeCart.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(storeCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(destroyUserCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(destroyUserCart.fulfilled, (state, action) => {
        if (action.payload.status == 200) {
          state.cart = [];
          localStorage.removeItem("cart");
        }
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(destroyUserCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  addToCart,
  updateProductInCart,
  deleteFromCart,
  clearCart,
  updateCart,
} = cartSlice.actions;

export default cartSlice.reducer;
