import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiService from "../../../services/apiService";
import { User } from "../../../models";
import { STORAGE_KEY } from "../../../constants";

export const actLogin = createAsyncThunk<User, any>(
  "auth/actLogin",
  async (user, { rejectWithValue }) => {
    try {
      const result = await apiService.post("QuanLyNguoiDung/DangNhap", user);
      const userData = result.data;

      if (userData.maLoaiNguoiDung === "HV") {
        return rejectWithValue("Tài khoản không có quyền truy cập");
      }

      // ✅ Lưu toàn bộ thông tin user vào localStorage
      localStorage.setItem(STORAGE_KEY.CURRENT_USER, JSON.stringify(userData));

      return userData;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Đăng nhập thất bại");
    }
  }
);

const currentUser = localStorage.getItem(STORAGE_KEY.CURRENT_USER)
  ? JSON.parse(localStorage.getItem(STORAGE_KEY.CURRENT_USER) as string)
  : null;
  

type TState = {
  data: User | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: TState = {
  isLoading: false,
  data: currentUser,
  error: null,
};

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(actLogin.pending, (state) =>{
      state.isLoading = true;
    })
    builder.addCase(actLogin.fulfilled,(state,action)=>{
      state.isLoading = false;
      state.data = action.payload;
    })
    builder.addCase(actLogin.rejected,(state,action)=>{
      state.isLoading = false;
      state.error = action.payload as string
    })
    builder.addDefaultCase((state) => state);
  },
});

export default authSlice.reducer;
