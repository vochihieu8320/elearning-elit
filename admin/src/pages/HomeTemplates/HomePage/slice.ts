import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Course } from "../../../models";
import apiService from "../../../services/apiService";

type ResponseCourse = Course[];

export const fetchCourse = createAsyncThunk(
  "course/fetchCourse",
  async (_, { rejectWithValue }) => {
    try {
      const result = await apiService.get<ResponseCourse>(
        "/QuanLyKhoaHoc/LayDanhSachKhoaHoc?MaNhom=GP01"
      );
      console.log(result.data);
      return result.data;
    } catch (error: any) {
      console.error("Fetch course failed:", error);
      return rejectWithValue(error.response?.data || "Failed to fetch courses");
    }
  }
);

type TState = {
  data: Course[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TState = {
  isLoading: false,
  data: [],
  error: null,
};

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCourse.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchCourse.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = action.payload || []; // 
    });
    builder.addCase(fetchCourse.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string || "Something went wrong"; // 
    });
  },
});

export default courseSlice.reducer;
