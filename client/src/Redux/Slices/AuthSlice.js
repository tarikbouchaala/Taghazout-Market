import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import EndPoint from "../../settings/EndPoint";

export const Login = createAsyncThunk(
  "user/login",
  async (body, { rejectWithValue }) => {
    try {
      const res = await EndPoint.post(`/login`, body);
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

export const Register = createAsyncThunk(
  "user/register",
  async (body, { rejectWithValue }) => {
    try {
      const res = await EndPoint.post("/register", body);
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

export const LogOut = createAsyncThunk(
  "user/LogOut",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await EndPoint.delete("/logout", {
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

export const Profile = createAsyncThunk(
  "user/Profile",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().Auth.token || localStorage.getItem("token");
      const connected_user = getState().Auth.connected_user;

      if (connected_user) {
        return connected_user;
      }
      const res = await EndPoint.get("/Profile", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
 


export const UpdateUser = createAsyncThunk(
  "users/update",
  async ({id,UserData}, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {

      const res = await EndPoint.post(`/users/update/${id}`, UserData);
        const data = res.data;
        return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const AuthSlice = createSlice({
  name: "Auth",

  initialState: {
    isLoading: false,
    error: null,
    data: null,
    token: localStorage.getItem("token"),
    role:
      JSON.parse(localStorage.getItem("user")) &&
      JSON.parse(localStorage.getItem("user")).role,
    message: null,
    connected_user: JSON.parse(localStorage.getItem("user")),
  },
  reducers: {},

  extraReducers: (builder) => {
    // ----------------------------LOGIN-----------------------------------------
    builder
      .addCase(Login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(Login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        if (action.payload.status == 200) {
          state.token = action.payload.token;
          state.connected_user = action.payload.user;
          state.role = action.payload.user.role;
        }
      })
      .addCase(Login.rejected, (state, action) => {
        state.error = action.payload;
        console.log("error");
      })

      // ----------------------------REGISTER-----------------------------------------
      .addCase(Register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(Register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.data = action.payload;
      })
      .addCase(Register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // ----------------------------LOGOUT-----------------------------------------
      .addCase(LogOut.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(LogOut.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.data = action.payload;
        // Reset token and connected_user to null on successful logout
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        if (action.payload.status == 200) {
          state.token = null;
          state.connected_user = null;
          state.role = null;
        }
      })
      .addCase(LogOut.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // ----------------------------Profile-----------------------------------------

      .addCase(Profile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(Profile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.connected_user = action.payload;
      })
      .addCase(Profile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(UpdateUser.fulfilled, (state, {payload}) => {
        state.isLoading = false;
        state.error = null;
        if(payload.status==200){
          state.connected_user = payload.user;
          localStorage.setItem("user",JSON.stringify(payload.user));
        }
        // console.log('result update action',payload)

      })
  },
});
export const { logout } = AuthSlice.actions;
export default AuthSlice.reducer;
