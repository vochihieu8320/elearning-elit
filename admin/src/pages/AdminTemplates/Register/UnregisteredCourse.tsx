import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../store";
import { fetchUnregisteredCourses, enrollCourse } from "./slice";
import { UnregisteredCourseByUser } from "../../../models";
import { Switch } from "@headlessui/react";
import { toast } from "react-toastify";

export default function UnregisteredCourse() {
  const [taiKhoan, setTaiKhoan] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<{ [key: string]: boolean }>({});

  const dispatch: AppDispatch = useDispatch();
  const { unregisteredCourses, loadingUnregisteredCourse, errorUnregisteredCourse } = useSelector(
    (state: RootState) => state.registerCourseReducer
  );

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaiKhoan(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (taiKhoan.trim()) {
      dispatch(fetchUnregisteredCourses(taiKhoan));
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
        await dispatch(enrollCourse({ taiKhoan, maKhoaHoc })).unwrap();
        toast.success(`✅ Đã ghi danh khóa học ${maKhoaHoc}`);
        setTimeout(() => {
          dispatch(fetchUnregisteredCourses(taiKhoan));
        }, 1000);
      } catch (error) {
        console.log(error);
        toast.error("❌ Ghi danh thất bại. Vui lòng thử lại.");
        setSelectedUsers((prevState) => ({
          ...prevState,
          [maKhoaHoc]: false,
        }));
      }
    }
  };

  return (
    <div className="p-6 border rounded-lg shadow-md bg-white">
      <h2 className="text-2xl font-semibold mb-4 text-purple-700">
        📌 Danh sách khóa học chưa ghi danh
      </h2>

      <form onSubmit={handleSubmit} className="flex gap-3 mb-5">
        <input
          type="text"
          value={taiKhoan}
          onChange={handleOnChange}
          placeholder="Nhập tài khoản..."
          className="border p-2 flex-1 rounded-md focus:ring-2 focus:ring-purple-500"
        />
        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition disabled:opacity-50"
          disabled={loadingUnregisteredCourse || !taiKhoan.trim()}
        >
          {loadingUnregisteredCourse ? "🔍 Đang tìm..." : "🔎 Tìm kiếm"}
        </button>
      </form>

      {errorUnregisteredCourse && <p className="text-red-500">{errorUnregisteredCourse}</p>}
      {loadingUnregisteredCourse && <p className="text-center text-gray-500">⏳ Đang tải...</p>}

      {unregisteredCourses.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-md">
            <thead>
              <tr className="bg-purple-600 text-white">
                <th className="px-4 py-2 border">Mã Khóa Học</th>
                <th className="px-4 py-2 border">Tên Khóa Học</th>
                <th className="px-4 py-2 border">Bí Danh</th>
                <th className="px-4 py-2 border">Ghi danh</th>
              </tr>
            </thead>
            <tbody>
              {unregisteredCourses.map(({ maKhoaHoc, tenKhoaHoc, biDanh }: UnregisteredCourseByUser, index) => (
                <tr
                  key={maKhoaHoc}
                  className={`${
                    index % 2 === 0 ? "bg-purple-50" : "bg-white"
                  } hover:bg-purple-100 transition`}
                >
                  <td className="px-4 py-2 border text-center">{maKhoaHoc}</td>
                  <td className="px-4 py-2 border text-center">{tenKhoaHoc}</td>
                  <td className="px-4 py-2 border text-center">{biDanh}</td>
                  <td className="px-4 py-2 border text-center">
                    <Switch
                      checked={selectedUsers[maKhoaHoc] || false}
                      onChange={() => handleToggle(maKhoaHoc)}
                      className={`${
                        selectedUsers[maKhoaHoc] ? "bg-purple-600" : "bg-gray-300"
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
        <p className="text-center text-gray-500">🔹 Vui lòng nhập tài khoản.</p>
      )}
    </div>
  );
}
