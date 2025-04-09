import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiService from "../../../services/apiService";
import { Course, CourseForAdmin } from "../../../models";

export const fetchCourseForAdmin = createAsyncThunk<Course[], void>(
  "course/fetchCourseForAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const result = await apiService.get(
        "QuanLyKhoaHoc/LayDanhSachKhoaHoc?MaNhom=GP01"
      );
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Lỗi không xác định");
    }
  }
);
export const addCourseForAdmin = createAsyncThunk<CourseForAdmin, CourseForAdmin>(
    "course/addCourseForAdmin",
    async (course, { rejectWithValue }) => {
      try {
        const result = await apiService.post("QuanLyKhoaHoc/ThemKhoaHoc", course);
        return result.data;
      } catch (error: any) {
        return rejectWithValue(error.response?.data || "Lỗi không xác định");
      }
    }
  );
  export const deleteCourseForAdmin = createAsyncThunk<string, string>(
    "course/deleteCourseForAdmin",
    async (courseId, { rejectWithValue }) => {
      console.log("Deleting course with ID:", courseId); // Kiểm tra mã khóa học
  
      try {
        const result = await apiService.delete(`QuanLyKhoaHoc/XoaKhoaHoc?MaKhoaHoc=${courseId}`);
        return result.data; 
      } catch (error: any) {
        return rejectWithValue(error.response.data || "Lỗi không xác định");
      }
    }
  );
  export const updateCourseForAdmin = createAsyncThunk<
  CourseForAdmin,
  CourseForAdmin
>("course/updateCourseForAdmin", async (course, { rejectWithValue }) => {
  try {
    const result = await apiService.put("QuanLyKhoaHoc/CapNhatKhoaHoc", course);
    return result.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Lỗi không xác định");
  }
});
  

type TState = {
  loading: boolean;
  data: Course[] | null;
  error: string | null;
};

const initialState: TState = {
  loading: false,
  data: null,
  error: null,
};

const courseForAdminSlice = createSlice({
  name: "courseForAdmin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourseForAdmin.pending, (state) => {
        state.loading = true;
        state.error = null; // Reset lỗi trước mỗi lần fetch
      })
      .addCase(fetchCourseForAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCourseForAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string; 
      });
      builder
      .addCase(addCourseForAdmin.pending, (state) => {
        state.loading = true;
        state.error = null; 
      })
      .addCase(addCourseForAdmin.fulfilled, (state, action) => {
        state.loading = false;
        
        const newCourse = {
          ...action.payload,
          danhMucKhoaHoc: {
            maDanhMucKhoaHoc: action.payload.maDanhMucKhoaHoc || "",
            tenDanhMucKhoaHoc: action.payload.maDanhMucKhoaHoc || "",
          },
          nguoiTao: {
            taiKhoan: action.payload.taiKhoanNguoiTao || "",
            hoTen: action.payload.taiKhoanNguoiTao || "",
          },
        } as Course; // Ép kiểu
      
        if (state.data) {
          state.data.push(newCourse);
        } else {
          state.data = [newCourse];
        }
      })
      
      
      .addCase(addCourseForAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string; 
      });
      builder
      .addCase(deleteCourseForAdmin.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
      .addCase(deleteCourseForAdmin.fulfilled, (state, action) => {
    state.loading = false;
    if (state.data) {
      state.data = state.data.filter((course) => course.maKhoaHoc !== action.payload);
    }
  })
      .addCase(deleteCourseForAdmin.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload as string;
  })
  builder
  .addCase(updateCourseForAdmin.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(updateCourseForAdmin.fulfilled, (state, action) => {
    state.loading = false;
    if (state.data) {
      const index = state.data.findIndex((c) => c.maKhoaHoc === action.payload.maKhoaHoc);
      if (index !== -1) {
        state.data[index] = {
          ...action.payload,
          danhMucKhoaHoc: {
            maDanhMucKhoaHoc: action.payload.maDanhMucKhoaHoc || "",
            tenDanhMucKhoaHoc: action.payload.tenKhoaHoc || "",
          },
          nguoiTao: {
            taiKhoan: action.payload.taiKhoanNguoiTao || "",
            hoTen: action.payload.taiKhoanNguoiTao || "",
          },
        } as Course; 
      }
    }
})

  .addCase(updateCourseForAdmin.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload as string;
  });

  },
});

export default courseForAdminSlice.reducer;
