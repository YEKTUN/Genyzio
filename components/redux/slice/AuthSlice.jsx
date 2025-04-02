import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Kullanıcı Kayıt İşlemi
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ username, email, password, role }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        username,
        email,
        password,
        role,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Kullanıcı Giriş İşlemi
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        username,
        password,
      });
      localStorage.setItem("token", response.data.token);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);
// Profil resmi güncelleme
export const updateProfileImage = createAsyncThunk(
  "auth/updateProfileImage",
  async ({ userId, file }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("profileImage", file);

      const response = await axios.put(
        `${API_URL}/auth/update-profile-image/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);
export const getUserInfo = createAsyncThunk(
  "auth/getUserInfo",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/auth/get-user-info/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);


const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setDataNull: (state) => {
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(getUserInfo.fulfilled, (state, action) => {
      state.user = action.payload;
      console.log("User", action.payload);
      state.loading = false;
      
    })
    .addCase(getUserInfo.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
    })
      .addCase(updateProfileImage.fulfilled, (state, action) => {
        state.user.profileImage = action.payload.profileImage;
      })
      .addCase(updateProfileImage.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.log("Apı", API_URL);
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setDataNull } = authSlice.actions;
export default authSlice.reducer;
