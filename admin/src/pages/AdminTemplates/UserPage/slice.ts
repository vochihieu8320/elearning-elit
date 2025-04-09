import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import apiService from "../../../services/apiService";
import { User } from "../../../models";

interface PaginationParams {
  page: number;
  pageSize: number;
}

interface UserResponse {
  items: User[];
  totalCount: number;
}

export const fetchListUser = createAsyncThunk<
  UserResponse,
  PaginationParams,
  { rejectValue: string }
>(
  "listUser/fetchListUser",
  async ({ page, pageSize }, { rejectWithValue }) => {
    try {
      const result = await apiService.get<UserResponse>(
        `QuanLyNguoiDung/LayDanhSachNguoiDung_PhanTrang?MaNhom=GP01&page=${page}&pageSize=${pageSize}`
      );
      return result.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Lỗi không xác định");
    }
  }
);

type TState = {
  loading: boolean;
  data?: User[] | null;
  totalCount?: number;
  error: string | null;
};

const initialState: TState = {
  loading: false,
  data: null,
  totalCount: 0,
  error: null,
};

const listUserSlice = createSlice({
  name: "listUser",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchListUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      fetchListUser.fulfilled,
      (state, action: PayloadAction<UserResponse>) => {
        state.loading = false;
        state.data = action.payload.items;
        state.totalCount = action.payload.totalCount;
      }
    );
    builder.addCase(
      fetchListUser.rejected,
      (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload ?? "Lỗi không xác định";
      }
    );
  },
});

export default listUserSlice.reducer;
