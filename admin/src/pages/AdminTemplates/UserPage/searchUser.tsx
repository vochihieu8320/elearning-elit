import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import apiService from "../../../services/apiService";
import { User } from "../../../models";
import EditUserModal from "./modalUser";

export default function SearchUser() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tuKhoa = searchParams.get("tuKhoa") || ""; // Lấy từ khóa từ URL

  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Debug: Kiểm tra từ khóa lấy được
  useEffect(() => {
    console.log("Từ khóa hiện tại:", tuKhoa);
  }, [tuKhoa]);

  // Gọi API tìm kiếm người dùng
  useEffect(() => {
    const searchUser = async (tuKhoa: string) => {
      try {
        const response = await apiService.get(
          `QuanLyNguoiDung/TimKiemNguoiDung?MaNhom=GP01&tuKhoa=${encodeURIComponent(tuKhoa)}`
        );
        console.log("Dữ liệu API trả về:", response.data);
        setUsers(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Lỗi khi tìm kiếm người dùng:", error);
      }
    };

    if (tuKhoa.trim() !== "") {
      searchUser(tuKhoa);
    }
  }, [tuKhoa]);

  // Xử lý khi nhấn "Sửa"
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // Xử lý khi nhấn "Xóa"
  const handleDeleteUser = async (taiKhoan: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa người dùng này không?")) {
      return;
    }

    try {
      const response = await apiService.delete(
        `QuanLyNguoiDung/XoaNguoiDung/${taiKhoan}`
      );
      if (response.status === 200) {
        toast.success("Xóa user thành công! 🎉");
        setUsers(users.filter((user) => user.taiKhoan !== taiKhoan)); // Cập nhật UI
      } else {
        toast.warn("Không thể xóa user, vui lòng thử lại!");
      }
    } catch (error: any) {
      console.error("❌ Lỗi khi xóa user:", error);
      toast.error(error.response?.data || "Lỗi từ server. Vui lòng thử lại!");
    }
  };

  // Cập nhật danh sách sau khi sửa thành công
  const handleUpdateSuccess = () => {
    if (tuKhoa) {
      setTimeout(() => {
        navigate(`?tuKhoa=${encodeURIComponent(tuKhoa)}`, { replace: true });
      }, 1000);
    }
  };

  return (
    <div className="relative overflow-x-auto shadow-md rounded-lg p-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-lg font-semibold pb-4">
        Kết quả tìm kiếm: "{tuKhoa}"
      </h2>

      <table className="w-full text-sm text-gray-700 border border-gray-300">
        <thead className="text-xs uppercase bg-gray-200">
          <tr>
            {["Tài khoản", "Họ tên", "Email", "Số ĐT", "Mã loại người dùng", "Action"].map((header) => (
              <th key={header} className="px-2 py-2 text-center border border-gray-300">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.taiKhoan} className="odd:bg-gray-100 even:bg-white border-b">
                <td className="px-2 py-2 text-center border border-gray-300">{user.taiKhoan}</td>
                <td className="px-2 py-2 text-center border border-gray-300">{user.hoTen}</td>
                <td className="px-2 py-2 text-center border border-gray-300">{user.email}</td>
                <td className="px-2 py-2 text-center border border-gray-300">{user.soDt}</td>
                <td className="px-2 py-2 text-center border border-gray-300">{user.maLoaiNguoiDung}</td>
                <td className="px-2 py-2 text-center border border-gray-300">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleEditUser(user)}
                      className="text-white bg-blue-700 hover:bg-blue-800 rounded-lg text-sm px-4 py-2"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.taiKhoan)}
                      className="text-white bg-red-700 hover:bg-red-800 rounded-lg text-sm px-4 py-2"
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center p-4">Không tìm thấy người dùng</td>
            </tr>
          )}
        </tbody>
      </table>

      <EditUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
        onUpdateSuccess={handleUpdateSuccess}
      />
    </div>
  );
}
