import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../store";
import { fetchReviewCourses, enrollCourse } from "./slice";
import { UnregisteredCourseByUser } from "../../../models";
import { Switch } from "@headlessui/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 

export default function ReviewRegisteredCourse() {
    const [taiKhoan, setTaiKhoan] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<{ [key: string]: boolean }>({});
  const dispatch: AppDispatch = useDispatch();
  const { reviewCourses, loadingReviewCourses, errorReviewCourses } = useSelector(
    (state: RootState) => state.registerCourseReducer
  );

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaiKhoan(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (taiKhoan.trim()) {
      dispatch(fetchReviewCourses(taiKhoan));
    }
  };

  const handleToggle = async (maKhoaHoc: string) => {
    const isEnrolling = !selectedUsers[maKhoaHoc];
    setSelectedUsers((prevState) => ({
      ...prevState,
      [maKhoaHoc]: isEnrolling,
    }));
  
    if (isEnrolling) {
      try {
        await dispatch(enrollCourse({ maKhoaHoc, taiKhoan })).unwrap(); // ✅ Truyền đúng tham số
        toast.success(`🎉 Ghi danh thành công cho khóa ${maKhoaHoc}`);
  
        setTimeout(() => {
          dispatch(fetchReviewCourses(taiKhoan));
        }, 1000);
      } catch (error: any) {
        console.error("Lỗi khi ghi danh:", error);
        toast.error("❌ Ghi danh thất bại. Vui lòng thử lại.");
      }
    }
  };
  


  return (
    <div className="p-6 border rounded-lg shadow-md bg-white">
      <h2 className="text-xl font-semibold mb-4 text-white bg-red-500 px-4 py-2 rounded-md text-center">
        Danh sách khóa học chờ xét duyệt bằng cách nhập tài khoản người dùng
      </h2>

      {/* Toast Container để hiển thị thông báo */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          value={taiKhoan}
          onChange={handleOnChange}
          placeholder="Nhập tài khoản..."
          className="border p-2 flex-1 rounded-md focus:ring-2 focus:ring-red-500"
        />
        <button
          type="submit"
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition disabled:opacity-50"
          disabled={loadingReviewCourses || !taiKhoan.trim()}
        >
          {loadingReviewCourses ? "Đang tìm..." : "Tìm kiếm"}
        </button>
      </form>

      {errorReviewCourses && <p className="text-red-500">{errorReviewCourses}</p>}
      {loadingReviewCourses && <p className="text-center text-gray-500">Đang tải...</p>}

      {reviewCourses.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-md">
            <thead>
              <tr className="bg-red-500 text-white">
                <th className="px-4 py-2 border">Mã khóa học</th>
                <th className="px-4 py-2 border">Tên khóa học</th>
                <th className="px-4 py-2 border">Bí Danh</th>
                <th className="px-4 py-2 border">Xét duyệt</th>
              </tr>
            </thead>
            <tbody>
              {reviewCourses.map(({ maKhoaHoc, tenKhoaHoc, biDanh }: UnregisteredCourseByUser, index) => (
                <tr
                  key={maKhoaHoc}
                  className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"} hover:bg-gray-300`}
                >
                  <td className="px-4 py-2 border text-center">{maKhoaHoc}</td>
                  <td className="px-4 py-2 border text-center">{tenKhoaHoc}</td>
                  <td className="px-4 py-2 border text-center">{biDanh}</td>
                  <td className="px-4 py-2 border text-center">
                    <Switch
                      checked={selectedUsers[taiKhoan] || false}
                      onChange={() => handleToggle(taiKhoan)}
                      className={`${
                        selectedUsers[taiKhoan] ? "bg-red-600" : "bg-gray-300"
                      } relative inline-flex h-6 w-11 items-center rounded-full transition`}
                    >
                      <span className="sr-only">Ghi danh</span>
                      <span
                        className={`${
                          selectedUsers[taiKhoan] ? "translate-x-6" : "translate-x-1"
                        } inline-block h-4 w-4 transform bg-white rounded-full transition`}
                      />
                    </Switch>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500">Vui lòng nhập tài khoản</p>
      )}
    </div>
  );
}
