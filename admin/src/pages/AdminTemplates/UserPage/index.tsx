import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { fetchListUser } from "./slice";
import { RootState, AppDispatch } from "../../../store";
import EditUserModal from "./modalUser";
import apiService from "../../../services/apiService";
import { toast, ToastContainer } from "react-toastify";
import { User } from "../../../models";

export default function UserPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, loading, error, totalCount } = useSelector(
    (state: RootState) => state.listUserReducer
  );
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchListUser({ page, pageSize }));
  }, [dispatch, page]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(data ?? []);
      return;
    }

    const fetchSearchResults = async () => {
      try {
        const response = await apiService.get(
          `QuanLyNguoiDung/TimKiemNguoiDung?MaNhom=GP01&tuKhoa=${searchTerm}`
        );
        setFilteredUsers(response.data);
      } catch (error) {
        console.error("❌ Lỗi khi tìm kiếm người dùng:", error);
        toast.error("Lỗi khi tìm kiếm, vui lòng thử lại!");
      }
    };

    fetchSearchResults();
  }, [searchTerm, data]);

  const handleDeleteUser = async (taiKhoan: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa người dùng này không?")) {
      return;
    }

    try {
      const response = await apiService.delete(
        `QuanLyNguoiDung/XoaNguoiDung?TaiKhoan=${taiKhoan}`
      );

      if (response.data) {
        toast.success("Xóa user thành công! 🎉");
        setTimeout(() => {
          dispatch(fetchListUser({ page, pageSize }));
        }, 1000);
      } else {
        toast.warn("Không thể xóa user, vui lòng thử lại!");
      }
    } catch (error: any) {
      console.error("❌ Lỗi khi xóa user:", error);
      toast.error(error.response?.data || "Lỗi từ server. Vui lòng thử lại!");
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleUpdateSuccess = () => {
    setTimeout(() => {
      dispatch(fetchListUser({ page, pageSize }));
    }, 1000);
  };

  const totalPages = totalCount ? Math.ceil(totalCount / pageSize) : 1;

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="text-red-500 p-4">Lỗi tải dữ liệu người dùng!</div>;

  return (
    <div className="p-4 max-w-screen-xl mx-auto">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-2xl font-semibold text-gray-700 mb-4">
        Danh sách người mua khóa học
      </h1>

      {/* Ô tìm kiếm */}
      <input
        type="text"
        placeholder="Tìm kiếm người dùng..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 border rounded w-full md:w-1/3"
      />

      <div className="relative overflow-x-auto shadow-md rounded-lg">
        <table className="w-full text-sm text-gray-700 border border-gray-300">
          <thead className="text-xs uppercase bg-gray-200">
            <tr>
              {["Tài khoản", "Họ tên", "Email", "Số ĐT", "Mã loại người dùng", "Action"].map((header) => (
                <th key={header} className="px-4 py-2 text-center border border-gray-300">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.taiKhoan} className="odd:bg-gray-100 even:bg-white border-b">
                  <td className="px-4 py-2 text-center border border-gray-300">{user.taiKhoan}</td>
                  <td className="px-4 py-2 text-center border border-gray-300">{user.hoTen}</td>
                  <td className="px-4 py-2 text-center border border-gray-300">{user.email}</td>
                  <td className="px-4 py-2 text-center border border-gray-300">{user.soDt}</td>
                  <td className="px-4 py-2 text-center border border-gray-300">{user.maLoaiNguoiDung}</td>
                  <td className="px-4 py-2 text-center border border-gray-300">
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
                <td colSpan={6} className="px-4 py-4 text-center text-gray-500">
                  Không tìm thấy người dùng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Điều hướng phân trang */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded disabled:opacity-50"
        >
          Trước
        </button>
        <span>Trang {page} / {totalPages}</span>
        <button
          onClick={() => setPage((prev) => (prev < totalPages ? prev + 1 : prev))}
          disabled={page >= totalPages}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded disabled:opacity-50"
        >
          Tiếp
        </button>
      </div>

      <EditUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
        onUpdateSuccess={handleUpdateSuccess}
      />
    </div>
  );
}
