import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import EndPoint from "../../settings/EndPoint";

export const GetCoupons = createAsyncThunk(
  "coupon/Get",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      // const cachedCoupons = thunkAPI.getState().Coupon.Coupons;
      // if (cachedCoupons.length > 0) {
      //   return cachedCoupons;
      // } else {
        const res = await EndPoint.get("/coupon");
        const data = res.data;
        // console.log('res',data)
        return data;
      // }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const DestroyCoupon = createAsyncThunk(
  "coupon/Delete",
  async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
    
        const res = await EndPoint.delete("/coupon/"+id);
        const data = res.data;
        console.log('res delete data from redux',data)
        return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);




export const Savecoupon = createAsyncThunk(
  "coupon/Store",
  async (body, { rejectWithValue }) => {
    try {
      const res = await EndPoint.post("/coupon", body);
      console.log('reees coupon',res.data)
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



export const DeleteCoupon = createAsyncThunk(
  "coupon/Delete",
  async (body, { rejectWithValue }) => {
    try {
      const res = await EndPoint.delete("/coupon/"+body.id);
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


export const ApplayCoupon = createAsyncThunk(
  "Coupon/Applay",
  async (body, { rejectWithValue }) => {

    try {
      const res = await EndPoint.post("/applyCoupon", body);
      console.log('applay copon payload',res.data)
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


const Couponslice = createSlice({
  name: "coupon",
  initialState: {
    isLoading: false,
    error: {},
    Coupons: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(GetCoupons.fulfilled, (state, { payload }) => { 
        // console.log('payloed',payload.data)
        state.Coupons = payload.data;
      })
      .addCase(Savecoupon.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(Savecoupon.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        if (payload.error) {
          state.error = payload.error;
        } else {
          state.Coupons.push(payload.data);
        }
      })
      .addCase(Savecoupon.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      }) 
    // -----------------------delete----------------------------
    .addCase(DeleteCoupon.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.Coupons = state.Coupons.filter(coupon=>coupon.id !== payload.id);
    })
    // -----------------------Applay Coupon----------------------------
      .addCase(ApplayCoupon.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        console.log('applay copon payload',payload)
        state.Coupons = state.Coupons.filter(coupon=>coupon.id !== payload.id);
      })
  },
});

export default Couponslice.reducer;