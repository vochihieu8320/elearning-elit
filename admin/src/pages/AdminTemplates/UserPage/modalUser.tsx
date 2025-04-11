import { useState, useEffect } from "react";
import apiService from "../../../services/apiService";
import { toast } from "react-toastify";
import { User } from "../../../models";

type EditUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onUpdateSuccess: (updatedUser: User) => void; // Thêm prop mới
};

export default function EditUserModal({
  isOpen,
  onClose,
  user,
  onUpdateSuccess, // Nhận callback từ component cha
}: EditUserModalProps) {
  const [formData, setFormData] = useState({
    taiKhoan: "",
    matKhau: "",
    hoTen: "",
    email: "",
    soDt: "",
    maLoaiNguoiDung: "",
    maNhom: "GP01",
  });

  const [errors, setErrors] = useState({
    matKhau: "",
    hoTen: "",
    email: "",
    soDt: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        taiKhoan: user.taiKhoan || "",
        matKhau: user.matKhau || "",
        hoTen: user.hoTen || "",
        email: user.email || "",
        soDt: user.soDt || "",
        maLoaiNguoiDung: user.maLoaiNguoiDung || "",
        maNhom: user.maNhom || "GP01",
      });
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors: any = {};

    if (!formData.matKhau.trim()) {
      newErrors.matKhau = "Mật khẩu không được để trống!";
    }

    if (!formData.hoTen.trim()) {
      newErrors.hoTen = "Họ tên không được để trống!";
    }

    // Kiểm tra định dạng email
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.email.trim() || !emailPattern.test(formData.email)) {
      newErrors.email = "Email không hợp lệ!";
    }

    // Kiểm tra số điện thoại (nếu có thể là số điện thoại Việt Nam)
    const phonePattern = /^0[0-9]{9}$/;
    if (!formData.soDt.trim() || !phonePattern.test(formData.soDt)) {
      newErrors.soDt = "Số điện thoại không hợp lệ!";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Trả về true nếu không có lỗi
  };

  const handleUpdateUser = async () => {
    if (!validate()) {
      return;
    }

    try {
      const result = await apiService.put(
        `QuanLyNguoiDung/CapNhatThongTinNguoiDung`,
        formData
      );

      if (result.status === 200) {
        toast.success("Cập nhật thông tin thành công! 🎉");
        onUpdateSuccess(formData); // Cập nhật dữ liệu lên component cha
        onClose(); // Đóng modal
      } else {
        toast.warn("Không thể cập nhật, vui lòng thử lại!");
      }
    } catch (error: any) {
      console.error("❌ Lỗi khi cập nhật user:", error.response?.data);
      toast.error(
        error.response?.data || "Lỗi khi cập nhật. Vui lòng thử lại!"
      );
    }
  };

  return isOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Chỉnh sửa thông tin</h2>
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Tài khoản
          </label>
          <input
            type="text"
            name="taiKhoan"
            value={formData.taiKhoan}
            onChange={handleChange}
            className="w-full border p-2 bg-gray-200 opacity-70 cursor-not-allowed"
            disabled
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Mật khẩu
          </label>
          <input
            type="text"
            name="matKhau"
            value={formData.matKhau}
            onChange={handleChange}
            className="w-full border p-2"
            placeholder="Nhập mật khẩu mới"
          />
          {errors.matKhau && <p className="text-red-500 text-xs">{errors.matKhau}</p>}
        </div>

        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Họ tên
          </label>
          <input
            type="text"
            name="hoTen"
            value={formData.hoTen}
            onChange={handleChange}
            className="w-full border p-2"
            placeholder="Họ tên"
          />
          {errors.hoTen && <p className="text-red-500 text-xs">{errors.hoTen}</p>}
        </div>

        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-2"
            placeholder="Email"
          />
          {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
        </div>

        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Số điện thoại
          </label>
          <input
            type="text"
            name="soDt"
            value={formData.soDt}
            onChange={handleChange}
            className="w-full border p-2"
            placeholder="Số điện thoại"
          />
          {errors.soDt && <p className="text-red-500 text-xs">{errors.soDt}</p>}
        </div>

        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Loại người dùng
          </label>
          <select
            name="maLoaiNguoiDung"
            value={formData.maLoaiNguoiDung}
            onChange={handleChange}
            className="w-full border p-2"
          >
            <option value="GV">Giáo vụ</option>
            <option value="HV">Học viên</option>
          </select>
        </div>

        <button
          onClick={handleUpdateUser}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          Lưu
        </button>
        <button
          onClick={onClose}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Hủy
        </button>
      </div>
    </div>
  ) : null;
}
