import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../../services/apiService";
import { UnregisteredUser  , UnregisteredCourseByUser} from "../../../models";

// Fetch danh sách người dùng chưa ghi danh
export const fetchUserNotRegister = createAsyncThunk(
  "courses/fetchUnregisteredUsers",
  async (maKhoaHoc: string, { rejectWithValue }) => {
    try {
      const response = await apiService.post(
        `QuanLyNguoiDung/LayDanhSachNguoiDungChuaGhiDanh`,
        { maKhoaHoc }
      );

      if (!response.data || response.data.length === 0) {
        return rejectWithValue("Không tìm thấy người dùng nào chưa ghi danh.");
      }

      return response.data
    } catch (error: any) {
      console.error("Lỗi khi lấy danh sách người dùng chưa ghi danh:", error);
      return rejectWithValue("Không thể lấy danh sách người dùng chưa ghi danh.");
    }
  }
);

// Fetch danh sách học viên đã ghi danh
export const fetchRegisteredStudents = createAsyncThunk(
  "courses/fetchRegisteredStudents",
  async (maKhoaHoc: string, { rejectWithValue }) => {
    try {
      const response = await apiService.post(
        `QuanLyNguoiDung/LayDanhSachHocVienKhoaHoc`,
        { maKhoaHoc }
      );

      if (!response.data || response.data.length === 0) {
        return rejectWithValue("Không có học viên nào ghi danh vào khóa học này.");
      }

      return response.data
    } catch (error: any) {
      console.error("Lỗi khi lấy danh sách học viên đã ghi danh:", error);
      return rejectWithValue("Không thể lấy danh sách học viên đã ghi danh.");
    }
  }
);
export const fetchReviewStudents = createAsyncThunk("courses/fetchReviewStudents", async (maKhoaHoc: string, { rejectWithValue }) => {
  try {
    const response = await apiService.post(`QuanLyNguoiDung/LayDanhSachHocVienChoXetDuyet`, { maKhoaHoc });
    if (!response.data || response.data.length === 0) {
      return rejectWithValue("Không có học viên nào chờ xét duyệt vào khóa học này.");
    }
    return response.data;
  } catch (error: any) {
    console.error("Lỗi khi lấy danh sách học viên chơ xét duyệt:", error);
    return rejectWithValue("Không thể lấy danh sách học viên chờ xét duyệt.");
  }
}
)
export const fetchUnregisteredCourses = createAsyncThunk(
  "courses/fetchUnregisteredCourses",
  async (taiKhoan: string, { rejectWithValue }) => {
    try {
      const response = await apiService.post(
        "/QuanLyNguoiDung/LayDanhSachKhoaHocChuaGhiDanh",
        { TaiKhoan: taiKhoan } 
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Lỗi khi lấy danh sách khóa học.");
    }
  }
);
export const fetchReviewCourses= createAsyncThunk("courses/fetchReviewCourse", async (taiKhoan: string, { rejectWithValue }) => {
  try {
    const response = await apiService.post(`QuanLyNguoiDung/LayDanhSachKhoaHocChoXetDuyet`, { taiKhoan });
    if (!response.data || response.data.length === 0) {
      return rejectWithValue("Không có khóa học nào chờ xét duyệt bởi người dùng này này.");
    }
    return response.data;
  } catch (error: any) {
    console.error("Lỗi khi lấy danh sách  khóa học chờ xét duyệt:", error);
    return rejectWithValue("Không thể lấy danh sách khóa học chờ xét duyệt.");
  }
}
)
export const fetchRegisteredCourses = createAsyncThunk(
  "courses/fetchRegisteredCourses",
  async (taiKhoan: string, { rejectWithValue }) => {
    try {
      const response = await apiService.post(
        "/QuanLyNguoiDung/LayDanhSachKhoaHocDaXetDuyet",
        { TaiKhoan: taiKhoan } 
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Lỗi khi lấy danh sách khóa học.");
    }
  }
);

export const enrollCourse = createAsyncThunk(
  "courses/enroll",
  async ({ maKhoaHoc, taiKhoan }: { maKhoaHoc: string; taiKhoan: string }, { rejectWithValue }) => {
    try {
      const response = await apiService.post("QuanLyKhoaHoc/GhiDanhKhoaHoc", { maKhoaHoc, taiKhoan });

      if (response.data === "Ghi danh thành công!") {
        return response.data;
      }

      return rejectWithValue("Ghi danh thất bại, vui lòng thử lại.");
    } catch (error: any) {
      console.error("Lỗi khi ghi danh:", error);
      return rejectWithValue("Lỗi hệ thống, không thể ghi danh.");
    }
  }
);
export const cancelEnrollCourse = createAsyncThunk(
  "courses/cancelEnroll",
  async ({ maKhoaHoc, taiKhoan }: { maKhoaHoc: string; taiKhoan: string }, { rejectWithValue }) => {
    try {
      const response = await apiService.post("QuanLyKhoaHoc/HuyGhiDanh", { maKhoaHoc, taiKhoan });

      if (response.data === "Hủy ghi danh thành công!") {
        return response.data;
      }

      return rejectWithValue("Hủy ghi danh thất bại, vui lòng thử lại.");
    } catch (error: any) {
      console.error("Lỗi khi hủy ghi danh:", error);
      return rejectWithValue("Lỗi hệ thống, không thể hủy ghi danh.");
    }
  }
);



// Define state
interface CoursesState {
  unregisteredCourses: UnregisteredCourseByUser[];
  registeredStudents: UnregisteredUser[]; // Danh sách học viên đã ghi danh
  unregisteredUsers: UnregisteredUser[]; // Danh sách học viên chưa ghi danh
  reviewStudents: UnregisteredUser[]; // Danh sách học viên chờ xét duyệt
  registeredCourses: UnregisteredCourseByUser[]; // Danh sách khóa học đã ghi danh
  reviewCourses: UnregisteredCourseByUser[]; // Danh sách khóa học chờ xét duyệt
  loadingReviewCourses: boolean; // Trạng thái loading khi lấy danh sách khóa học chờ xét duyệt
  loadingRegisteredCourse: boolean;
  loadingReviewStudents: boolean;
  loadingRegistered: boolean;
  loadingUnregisteredUser: boolean;
  loadingUnregisteredCourse : boolean;
  loadingEnroll: boolean; // Trạng thái loading khi ghi danh
  loadingCancelEnroll: boolean; // Trạng thái loading khi hủy ghi danh
  successCancelEnroll: string | null; // Thông báo khi hủy ghi danh thành công
  successEnroll: string | null; // Thông báo khi ghi danh thành công
  errorReviewCourses: string | null; // Lưu lỗi khi lấy danh sách khóa học chờ xét duyệt
  errorRegisteredCourse: string | null;
  errorUnregisteredCourse: string | null;
  errorReviewStudents: string | null;
  errorRegistered: string | null;
  errorCancelEnroll: string | null; // Lưu lỗi khi hủy ghi danh thất bại
  errorUnregisteredUser: string | null;
  errorEnroll: string | null; // Lưu lỗi khi ghi danh thất bại
}

const initialState: CoursesState = {
  registeredStudents: [],
  unregisteredUsers: [],
  reviewStudents: [],
  unregisteredCourses: [],
  registeredCourses: [],
  reviewCourses: [],
  loadingCancelEnroll: false,
  successCancelEnroll: null,
  loadingReviewCourses: false,
  loadingRegisteredCourse: false,
  loadingUnregisteredCourse: false,
  loadingRegistered: false,
  loadingUnregisteredUser: false,
  loadingReviewStudents: false,
  loadingEnroll: false,
  successEnroll: null,
  errorCancelEnroll: null,
  errorReviewCourses: null,
  errorRegisteredCourse: null,
  errorUnregisteredCourse: null,
  errorReviewStudents: null,
  errorRegistered: null,
  errorUnregisteredUser: null,
  errorEnroll: null,
};


const registerCourseSlice = createSlice({
  name: "registerCourse",
  initialState,
  reducers: { },
  extraReducers: (builder) => {
    builder
      // Xử lý fetch danh sách chưa ghi danh
      .addCase(fetchUserNotRegister.pending, (state) => {
        state.loadingUnregisteredUser = true;
        state.errorUnregisteredUser = null;
      })
      .addCase(fetchUserNotRegister.fulfilled, (state, action) => {
        state.unregisteredUsers = action.payload;
        state.loadingUnregisteredUser = false;
      })
      .addCase(fetchUserNotRegister.rejected, (state, action) => {
        state.loadingUnregisteredUser = false;
        state.errorUnregisteredUser = action.payload as string;
        state.unregisteredUsers = [];
      })
      .addCase(fetchRegisteredStudents.pending, (state) => {
        state.loadingRegistered = true;
        state.errorRegistered = null;
      })
      .addCase(fetchRegisteredStudents.fulfilled, (state, action) => {
        state.registeredStudents = action.payload;
        state.loadingRegistered = false;
      })
      .addCase(fetchRegisteredStudents.rejected, (state, action) => {
        state.loadingRegistered = false;
        state.errorRegistered = action.payload as string;
        state.registeredStudents = [];
      })
      .addCase(fetchReviewStudents.pending, (state) => {
        state.loadingReviewStudents = true;
        state.errorReviewStudents = null;
      })
      .addCase(fetchReviewStudents.fulfilled, (state, action) => {
        state.reviewStudents = action.payload;
        state.loadingReviewStudents = false;
      })
      .addCase(fetchReviewStudents.rejected, (state, action) => {
        state.loadingReviewStudents = false;
        state.errorReviewStudents = action.payload as string;
        state.reviewStudents = [];
      })
      .addCase(enrollCourse.pending, (state) => {
        state.loadingEnroll = true;
        state.errorEnroll = null;
        state.successEnroll = null;
      })
      .addCase(enrollCourse.fulfilled, (state, action) => {
        state.successEnroll = action.payload;
        state.loadingEnroll = false;
      })
      .addCase(enrollCourse.rejected, (state, action) => {
        state.errorEnroll = action.payload as string;
        state.loadingEnroll = false;
      })
      .addCase(fetchUnregisteredCourses.pending, (state) => {
        state.loadingUnregisteredCourse = true;
        state.errorUnregisteredCourse = null;
      })
      .addCase(fetchUnregisteredCourses.fulfilled, (state, action) => {
        state.unregisteredCourses = action.payload;
        state.loadingUnregisteredCourse = false;
      })
      .addCase(fetchUnregisteredCourses.rejected, (state, action) => {
        state.loadingUnregisteredCourse = false;
        state.errorUnregisteredCourse = action.payload as string;
        state.unregisteredCourses = [];
      })
      .addCase(fetchRegisteredCourses.pending, (state) => {
        state.loadingRegisteredCourse = true;
        state.errorRegisteredCourse = null;
      })
      .addCase(fetchRegisteredCourses.fulfilled, (state, action) => {
        state.registeredCourses = action.payload;
        state.loadingRegisteredCourse = false;
      })
      .addCase(fetchRegisteredCourses.rejected, (state, action) => {
        state.loadingRegisteredCourse = false;
        state.errorRegisteredCourse = action.payload as string;
        state.registeredCourses = [];
      })
      .addCase(fetchReviewCourses.pending, (state) => {
        state.loadingReviewCourses = true;
        state.errorReviewCourses = null;
      })
      .addCase(fetchReviewCourses.fulfilled, (state, action) => {
        state.reviewCourses = action.payload;
        state.loadingReviewCourses = false;
      })
      .addCase(fetchReviewCourses.rejected, (state, action) => {
        state.loadingReviewCourses = false;
        state.errorReviewCourses = action.payload as string;
        state.reviewCourses = [];
      })
      .addCase(cancelEnrollCourse.pending, (state) => {
        state.loadingCancelEnroll = true;
        state.errorCancelEnroll = null;
        state.successCancelEnroll = null;
      })
      .addCase(cancelEnrollCourse.fulfilled, (state, action) => {
        state.successCancelEnroll = action.payload;
        state.loadingCancelEnroll = false;
      })
      .addCase(cancelEnrollCourse.rejected, (state, action) => {
        state.errorCancelEnroll = action.payload as string;
        state.loadingCancelEnroll = false;
      });
  }
});

export default registerCourseSlice.reducer;
