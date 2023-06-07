import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import EndPoint from "../../settings/EndPoint";

export const GetOrders = createAsyncThunk(
  "order/Get",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      // const cachedOrders = thunkAPI.getState().order.Orders;
      // if (cachedOrders.length > 0) {
      //   return cachedOrders;
      // }else{
        const res = await EndPoint.get("/orderAdmin");
        const data = res;
        return data;
      // }

    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// export const Saveorder = createAsyncThunk(
//   "order/Store",
//   async (body, { rejectWithValue }) => {
//     try {
//       const res = await EndPoint.post("/order", body, {
//         Headers: {
//           "Content-Type": "application/json",
//           // Authorization: `Bearer ${token}`,
//           Authorization: `Bearer 6|9kt91PyBzWvCUAHUoiapwTHMwzOqKWyCa86CRchd`,
//         },
//       });

//       const data = res.data;
//       // console.log("dataaaaa orders ", data);
//       return data;
//     } catch (error) {
//       if (error.response && error.response.data && error.response.data.error) {
//         return rejectWithValue(error.response.data.error);
//       } else {
//         return rejectWithValue(error.message);
//       }
//       // return rejectWithValue(error.message)
//     }
//   }
// );

export const UpdateOrderStatus = createAsyncThunk(
  "Order/status/update",
  async ({ id, StatusFormdata }, { rejectWithValue, getState }) => {
    const token = getState().Auth.token || localStorage.getItem("token");

    try {
      const res = await EndPoint.post("/orderAdmin/" + id, StatusFormdata, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log("reees updated  Order status", res.data);
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

export const SaveOrder = createAsyncThunk(
  "Order/Store",
  async (body, { rejectWithValue, getState }) => {
    const token = getState().Auth.token || localStorage.getItem("token");
    try {
      const res = await EndPoint.post("/order", body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
const AdminOrderSlice = createSlice({
  name: "order",
  initialState: {
    isLoading: false,
    error: {},
    Orders: [],
  },

  extraReducers: (builder) => {
    builder



    .addCase(SaveOrder.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(SaveOrder.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      if (payload.error) {
        state.error = payload.error;
      } else {
        state.Orders.push(payload);
      }
    })
    .addCase(SaveOrder.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.error = payload;
    })
      .addCase(GetOrders.fulfilled, (state, { payload }) => {
        state.Orders = payload.data;
      })

      // -----------------------update status----------------------------
      .addCase(UpdateOrderStatus.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        console.log("update status payload", payload);
        const { id, status_message } = payload.order;

        const index = state.Orders.findIndex((order) => order.id == id);
        if (index !== -1) {
          state.Orders[index] = {
            ...state.Orders[index],
            status_message: status_message,
          };
        }
      });
  },
});
export default AdminOrderSlice.reducer;
