import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { actLogin } from "./slice";
import { AppDispatch, RootState } from "../../../store";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS

export default function AuthPage() {
  const dispatch: AppDispatch = useDispatch();
  const { data, error } = useSelector((state: RootState) => state.authReducer);
  const [user, setUser] = useState({
    taiKhoan: "",
    matKhau: "",
  });

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(actLogin(user));
  };

  useEffect(() => {
    if (data) {
      toast.success("Đăng nhập thành công, chào mừng bạn đến với trang quản trị!");
    }
  }, [data]); // Chạy khi `data` thay đổi (tức là đăng nhập thành công)

  const handleErrorMessage = () => {
    if (!error) return null;
    const messageError = typeof error === "string" ? error : error || "Đã xảy ra lỗi";
    return (
      <div
        className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
        role="alert"
      >
        <span className="font-medium">{messageError}</span>
      </div>
    );
  };

  if (data) {
    return <Navigate to="/admin/dashboard" />;
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white shadow-xl rounded-lg space-y-6">
        {handleErrorMessage()}

        {/* Tiêu đề của form */}
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-gray-800 dark:text-white">Đăng nhập vào tài khoản</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Vui lòng nhập thông tin của bạn để đăng nhập.</p>
        </div>

        {/* Tài khoản */}
        <div className="mb-6">
          <label
            htmlFor="taiKhoan"
            className="block mb-2 text-lg font-semibold text-gray-800 dark:text-white"
          >
            Tài khoản
          </label>
          <input
            onChange={handleOnChange}
            name="taiKhoan"
            type="text"
            id="taiKhoan"
            className="w-full p-3 bg-gray-100 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out transform hover:scale-105"
            placeholder="Vui lòng nhập tài khoản"
          />
        </div>

        {/* Mật khẩu */}
        <div className="mb-6">
          <label
            htmlFor="matKhau"
            className="block mb-2 text-lg font-semibold text-gray-800 dark:text-white"
          >
            Mật khẩu
          </label>
          <input
            onChange={handleOnChange}
            name="matKhau"
            type="password"
            id="matKhau"
            className="w-full p-3 bg-gray-100 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out transform hover:scale-105"
            placeholder="Vui lòng nhập mật khẩu"
          />
        </div>

        {/* Nút submit */}
        <button
          type="submit"
          className="w-full py-3 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out transform hover:scale-105"
        >
          Đăng nhập
        </button>
      </form>

      {/* Toast container for notifications */}
      <ToastContainer />
    </>
  );
}
