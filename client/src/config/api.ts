// API Configuration

// Base API URL
export const API_BASE_URL = 'https://elearningnew.cybersoft.edu.vn/api';

export const ADMIN_BASE_URL = "http://localhost:3001/auth"

// Auth Endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/QuanLyNguoiDung/DangNhap`,
  REGISTER: `${API_BASE_URL}/QuanLyNguoiDung/DangKy`,
  USER_INFO: `${API_BASE_URL}/QuanLyNguoiDung/ThongTinTaiKhoan`,
};

// Course Endpoints
export const COURSE_ENDPOINTS = {
  ALL_COURSES: `${API_BASE_URL}/QuanLyKhoaHoc/LayDanhSachKhoaHoc`,
  COURSE_BY_CATEGORY: `${API_BASE_URL}/QuanLyKhoaHoc/LayKhoaHocTheoDanhMuc`,
  COURSE_DETAIL: `${API_BASE_URL}/QuanLyKhoaHoc/LayThongTinKhoaHoc`,
  REGISTER_COURSE: `${API_BASE_URL}/QuanLyKhoaHoc/DangKyKhoaHoc`,
};

// Category Endpoints
export const CATEGORY_ENDPOINTS = {
  ALL_CATEGORIES: `${API_BASE_URL}/QuanLyKhoaHoc/LayDanhMucKhoaHoc`,
};