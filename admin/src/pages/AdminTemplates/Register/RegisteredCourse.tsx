import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../store";
import { fetchRegisteredCourses, cancelEnrollCourse } from "./slice";
import { UnregisteredCourseByUser } from "../../../models";
import { Switch } from "@headlessui/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RegisteredCourse() {
  const [taiKhoan, setTaiKhoan] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<{ [key: string]: boolean }>({});

  const dispatch: AppDispatch = useDispatch();
  const { registeredCourses, loadingRegisteredCourse, errorRegisteredCourse } = useSelector(
    (state: RootState) => state.registerCourseReducer
  );

  useEffect(() => {
    const initialSwitchState = registeredCourses.reduce((acc, course) => {
      acc[course.maKhoaHoc] = true;
      return acc;
    }, {} as { [key: string]: boolean });
    setSelectedUsers(initialSwitchState);
  }, [registeredCourses]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaiKhoan(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (taiKhoan.trim()) {
      dispatch(fetchRegisteredCourses(taiKhoan));
    }
  };

  const handleToggle = async (maKhoaHoc: string) => {
    if (selectedUsers[maKhoaHoc]) {
      try {
        await dispatch(cancelEnrollCourse({ taiKhoan, maKhoaHoc })).unwrap();
        setSelectedUsers((prev) => ({
          ...prev,
          [maKhoaHoc]: false, 
        }));
  
        toast.success("🟢 Hủy ghi danh thành công!");
  
        setTimeout(() => {
          dispatch(fetchRegisteredCourses(taiKhoan));
        }, 1000);
      } catch (error) {
        console.log(error);
        toast.error("🔴 Hủy ghi danh thất bại!");
      }
    }
  };
  

  return (
    <div className="p-6 border rounded-lg shadow-md bg-white">
      <h2 className="text-2xl font-semibold mb-4 text-teal-700">
        📌 Danh sách khóa học người dùng đã ghi danh
      </h2>

      <form onSubmit={handleSubmit} className="flex gap-3 mb-5">
        <input
          type="text"
          value={taiKhoan}
          onChange={handleOnChange}
          placeholder="Nhập tài khoản..."
          className="border p-2 flex-1 rounded-md focus:ring-2 focus:ring-teal-500"
        />
        <button
          type="submit"
          className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition disabled:opacity-50"
          disabled={loadingRegisteredCourse || !taiKhoan.trim()}
        >
          {loadingRegisteredCourse ? "🔍 Đang tìm..." : "🔎 Tìm kiếm"}
        </button>
      </form>

      {errorRegisteredCourse && <p className="text-red-500">{errorRegisteredCourse}</p>}
      {loadingRegisteredCourse && <p className="text-center text-gray-500">⏳ Đang tải...</p>}

      {registeredCourses.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-md">
            <thead>
              <tr className="bg-teal-600 text-white">
                <th className="px-4 py-2 border">Mã Khóa Học</th>
                <th className="px-4 py-2 border">Tên Khóa Học</th>
                <th className="px-4 py-2 border">Bí Danh</th>
                <th className="px-4 py-2 border">Ghi danh</th>
              </tr>
            </thead>
            <tbody>
              {registeredCourses.map(({ maKhoaHoc, tenKhoaHoc, biDanh }: UnregisteredCourseByUser, index) => (
                <tr
                  key={maKhoaHoc}
                  className={`${
                    index % 2 === 0 ? "bg-teal-50" : "bg-white"
                  } hover:bg-teal-100 transition`}
                >
                  <td className="px-4 py-2 border text-center">{maKhoaHoc}</td>
                  <td className="px-4 py-2 border text-center">{tenKhoaHoc}</td>
                  <td className="px-4 py-2 border text-center">{biDanh}</td>
                  <td className="px-4 py-2 border text-center">
                    <Switch
                      checked={selectedUsers[maKhoaHoc] || true}
                      onChange={() => handleToggle(maKhoaHoc)}
                      className={`${
                        selectedUsers[maKhoaHoc] ? "bg-teal-600" : "bg-gray-300"
                      } relative inline-flex h-6 w-11 items-center rounded-full transition`}
                    >
                      <span className="sr-only">Ghi danh</span>
                      <span
                        className={`${
                          selectedUsers[maKhoaHoc] ? "translate-x-6" : "translate-x-1"
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
        taiKhoan.trim() && !loadingRegisteredCourse && !errorRegisteredCourse && (
          <p className="text-center text-gray-500">⚠️ Tài khoản này chưa đăng ký khóa học nào.</p>
        )
      )}
    </div>
  );
}
