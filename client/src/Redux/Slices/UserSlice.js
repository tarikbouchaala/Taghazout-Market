import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import EndPoint from "../../settings/EndPoint";

export const GetUsers = createAsyncThunk(
  "users/Get",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      // const cachedUsers = thunkAPI.getState().users.Users;


      // if (cachedUsers.length > 0) {
      //   return cachedUsers;
      // }else{
        const res = await EndPoint.get("/users");
        const data = res.data;
        return data;
      // }

    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);













export const Saveusers = createAsyncThunk(
  "users/Store",
  async (body, { rejectWithValue }) => {
    try {
      const res = await EndPoint.post("/users", body);
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
export const Forget = createAsyncThunk(
  "users/forget",
  async (body, { rejectWithValue }) => {
    try {
      const res = await EndPoint.post("/forget", body);
      const data = res.data;
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
export const Reset = createAsyncThunk(
  "users/forget",
  async (body, { rejectWithValue }) => {
    try {
      const res = await EndPoint.post("/reset", body);
      const data = res.data;
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


export const DeleteUser = createAsyncThunk(
  "users/Delete",
  async (body, { rejectWithValue }) => {
    try {
      const res = await EndPoint.delete("/users/"+body.id);
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



const usersSlice = createSlice({
  name: "users",
  initialState: {
    isLoading: false,
    error: {},
    Users: [],
  },

  extraReducers: (builder) => {
    builder
    .addCase(GetUsers.fulfilled, (state, { payload }) => {
      state.Users = payload.users;
    })
  
    .addCase(Saveusers.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(Saveusers.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        if(payload.error){
            state.error = payload.error;
        }else{
          // console.log('payload',payload.data);
          state.Users.push(payload.data); 
        }

      })
    .addCase(Saveusers.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.error = payload;
    })
    .addCase(DeleteUser.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      console.log('user delete payload',payload)
      state.Users = state.Users.filter(User=>User.id !== payload.id);
    })
  },
});
export default usersSlice.reducer;
