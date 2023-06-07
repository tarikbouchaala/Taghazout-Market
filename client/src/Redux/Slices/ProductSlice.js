import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import EndPoint from "../../settings/EndPoint";

export const GetProducts = createAsyncThunk(
  "Product/Get",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      // const cachedProducts = thunkAPI.getState().Product.Products;
      // if (cachedProducts.length > 0) {
      //   return cachedProducts;
      // } else {
      const res = await EndPoint.get("/product");
      const data = res.data;
      // console.log('res',data)
      return data;
      // }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const SaveProduct = createAsyncThunk(
  "Product/Store",
  async (body, { rejectWithValue }) => {
    try {
      const res = await EndPoint.post("/product", body);
      //   console.log(res)
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

export const DeleteProduct = createAsyncThunk(
  "product/Delete",
  async (body, { rejectWithValue }) => {
    try {
      const res = await EndPoint.delete("/product/" + body.id);
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

export const updateProductItem = createAsyncThunk(
  "product/update",
  async ({ id, updatedProduct }, { rejectWithValue }) => {
    try {
      const res = await EndPoint.post(
        `/product/${parseInt(id)}`,
        updatedProduct,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
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

export const DeleteProductImage = createAsyncThunk(
  "productImage/Delete",
  async (body, { rejectWithValue }) => {
    try {
      const res = await EndPoint.post("/disroyImage/" + body.id);
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
export const UpdateProductImage = createAsyncThunk(
  "productImage/update",
  async ({ id, formData2 }, { rejectWithValue }) => {
    try {
      const res = await EndPoint.post(
        "/UpdateProductImage/" + parseInt(id),
        formData2,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const data = res.data;
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

const ProductSlice = createSlice({
  name: "Product",
  initialState: {
    isLoading: false,
    error: {},
    Products: [],
    sortOptions: [
      { name: "Most Popular", current: true },
      { name: "Newest", current: false },
      { name: "Price: Low to High", current: false },
      { name: "Price: High to Low", current: false },
    ],
  },
  reducers: {
    setSortOption(state, action) {
      state.sortOptions = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(GetProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(GetProducts.fulfilled, (state, { payload }) => {
        // console.log('payloed',payload.data)
        state.Products = payload.data;
        state.isLoading = false;
      })
      .addCase(SaveProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(SaveProduct.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        if (payload.error) {
          state.error = payload.error;
        } else {
          state.Products.push(payload.data);
        }
      })
      .addCase(SaveProduct.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      // -----------------------delete----------------------------
      .addCase(DeleteProduct.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.Products = state.Products.filter(
          (product) => product.id !== payload.id
        );
      })

      // ---------------------------delete Image------------------------------
      .addCase(DeleteProductImage.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.Products = state.Products.map((product) => {
          if (product.id === payload.product_id) {
            product.images = product.images.filter(
              (image) => image.id !== payload.id
            );
          }
          return product;
        });
      })
      // ---------------------------update------------------------------
      .addCase(updateProductItem.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        console.log('update product payload',payload)
        if(payload.error){
          state.error=payload.error
        }else{
          const existingProductIndex = state.Products.findIndex(
            (product) => product.id === payload.data.id
          ); 
          if (existingProductIndex !== -1) {
            state.Products[existingProductIndex] = payload.data;
          } else {
            state.Products.push(payload.data);
          }
        }
      })
      // ---------------------------update image ------------------------------
      .addCase(UpdateProductImage.fulfilled, (state, { payload }) => {
        state.isLoading = false;

        const productToUpdate = state.Products.find((product) => {
          return product.images.some((image) => image.id === payload.data.id);
        });

        if (!productToUpdate) {
          console.warn(`Product image not found with ID ${payload.data.id}`);
          return;
        }

        // Update the image data for the product
        productToUpdate.images = productToUpdate.images.map((image) => {
          if (image.id === payload.data.id) {
            return payload.data;
          }
          return image;
        });
      });
  },
});

export const { setSortOption } = ProductSlice.actions;
export default ProductSlice.reducer;
