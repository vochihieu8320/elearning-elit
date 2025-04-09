import { useState } from "react";
import apiService from "../../../services/apiService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddUserPage() {
  const [user, setUser] = useState({
    taiKhoan: "",
    matKhau: "",
    email: "",
    soDT: "",
    maNhom: "GP01",
    maLoaiNguoiDung: "HV",
    hoTen: "",
  });

  const [errors, setErrors] = useState({
    taiKhoan: "",
    matKhau: "",
    email: "",
    soDT: "",
    hoTen: "",
  });

  const handleOnChange = (e: any) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors: any = {};
    
    // Kiểm tra Tài khoản
    if (!user.taiKhoan) newErrors.taiKhoan = "Tài khoản không được để trống!";
    
    // Kiểm tra Mật khẩu
    if (!user.matKhau) newErrors.matKhau = "Mật khẩu không được để trống!";
    else if (user.matKhau.length < 6) newErrors.matKhau = "Mật khẩu phải có ít nhất 6 ký tự!";
    
    // Kiểm tra Email
    if (!user.email) newErrors.email = "Email không được để trống!";
    else if (!/\S+@\S+\.\S+/.test(user.email)) newErrors.email = "Email không hợp lệ!";
    
    // Kiểm tra Số điện thoại
    if (!user.soDT) newErrors.soDT = "Số điện thoại không được để trống!";
    else if (!/^\d{10}$/.test(user.soDT)) newErrors.soDT = "Số điện thoại phải gồm 10 chữ số!";
    
    // Kiểm tra Họ và tên
    if (!user.hoTen) newErrors.hoTen = "Họ và Tên không được để trống!";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const result = await apiService.post(
        "/QuanLyNguoiDung/ThemNguoiDung",
        user
      );
      const messageSuccess = "Thêm người dùng thành công";
      toast.success(messageSuccess, {
        position: "bottom-right",
      });

      // Reset form after success
      setUser({
        taiKhoan: "",
        matKhau: "",
        email: "",
        soDT: "",
        maNhom: "GP01",
        maLoaiNguoiDung: "HV",
        hoTen: "",
      });
      setErrors({
        taiKhoan: "",
        matKhau: "",
        email: "",
        soDT: "",
        hoTen: "",
      });
      return result.data;
    } catch (error: any) {
      console.log(error.response.data);
      const messageError = error.response.data;
      toast.error(messageError, {
        position: "bottom-right",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-8">
        Thêm người dùng
      </h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-8 rounded-lg shadow-md"
      >
        <div>
          <label
            htmlFor="taiKhoan"
            className="block text-sm font-medium text-gray-700"
          >
            Tài khoản
          </label>
          <input
            onChange={handleOnChange}
            name="taiKhoan"
            type="text"
            id="taiKhoan"
            placeholder="Vui lòng nhập tài khoản"
            value={user.taiKhoan}
            className="w-full px-4 py-2 mt-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.taiKhoan && (
            <p className="text-red-500 text-sm">{errors.taiKhoan}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="matKhau"
            className="block text-sm font-medium text-gray-700"
          >
            Mật khẩu
          </label>
          <input
            onChange={handleOnChange}
            name="matKhau"
            type="password"
            id="matKhau"
            placeholder="Vui lòng nhập mật khẩu"
            value={user.matKhau}
            className="w-full px-4 py-2 mt-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.matKhau && (
            <p className="text-red-500 text-sm">{errors.matKhau}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="hoTen"
            className="block text-sm font-medium text-gray-700"
          >
            Họ và Tên
          </label>
          <input
            onChange={handleOnChange}
            name="hoTen"
            type="text"
            id="hoTen"
            placeholder="Vui lòng nhập Họ và Tên"
            value={user.hoTen}
            className="w-full px-4 py-2 mt-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.hoTen && (
            <p className="text-red-500 text-sm">{errors.hoTen}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="soDT"
            className="block text-sm font-medium text-gray-700"
          >
            Số điện thoại
          </label>
          <input
            onChange={handleOnChange}
            name="soDT"
            type="text"
            id="soDT"
            placeholder="Vui lòng nhập SĐT"
            value={user.soDT}
            className="w-full px-4 py-2 mt-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.soDT && <p className="text-red-500 text-sm">{errors.soDT}</p>}
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            onChange={handleOnChange}
            name="email"
            type="email"
            id="email"
            placeholder="Vui lòng nhập email"
            value={user.email}
            className="w-full px-4 py-2 mt-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="maLoaiNguoiDung"
            className="block text-sm font-medium text-gray-700"
          >
            Loại người dùng
          </label>
          <select
            onChange={handleOnChange}
            id="maLoaiNguoiDung"
            name="maLoaiNguoiDung"
            value={user.maLoaiNguoiDung}
            className="w-full px-4 py-2 mt-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="HV">Học viên</option>
            <option value="GV">Giáo vụ</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full py-3 mt-6 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
        >
          Thêm người dùng
        </button>
      </form>
      <ToastContainer />
    </div>
  );
}
