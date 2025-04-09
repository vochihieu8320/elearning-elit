import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../store";
import { fetchRegisteredStudents, cancelEnrollCourse } from "./slice";
import { UnregisteredUser } from "../../../models";
import { Switch } from "@headlessui/react";
import { toast } from "react-toastify";

export default function RegisteredUsers() {
  const [maKhoaHoc, setMaKhoaHoc] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<{ [key: string]: boolean }>({});
  const [loadingUsers, setLoadingUsers] = useState<{ [key: string]: boolean }>({});

  const dispatch: AppDispatch = useDispatch();
  const { registeredStudents, loadingRegistered, errorRegistered } =
    useSelector((state: RootState) => state.registerCourseReducer);

  useEffect(() => {
    if (registeredStudents.length > 0) {
      const initialStates: { [key: string]: boolean } = {};
      registeredStudents.forEach(({ taiKhoan }) => {
        initialStates[taiKhoan] = true;
      });
      setSelectedUsers(initialStates);
    }
  }, [registeredStudents]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaKhoaHoc(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (maKhoaHoc.trim()) {
      dispatch(fetchRegisteredStudents(maKhoaHoc));
    }
  };

  const handleToggle = async (taiKhoan: string) => {
    if (loadingUsers[taiKhoan]) return;

    setLoadingUsers((prev) => ({ ...prev, [taiKhoan]: true }));
    const isEnrolled = selectedUsers[taiKhoan];

    if (!isEnrolled) {
      console.log(`Ghi danh người dùng: ${taiKhoan} vào khóa học: ${maKhoaHoc}`);
      setLoadingUsers((prev) => ({ ...prev, [taiKhoan]: false }));
      return;
    }

    try {
      await dispatch(cancelEnrollCourse({ maKhoaHoc, taiKhoan })).unwrap();
      toast.success(`🎉 Đã hủy ghi danh tài khoản ${taiKhoan}`);

      setSelectedUsers((prev) => ({ ...prev, [taiKhoan]: false }));
      setTimeout(() => dispatch(fetchRegisteredStudents(maKhoaHoc)), 1000);
    } catch (error) {
      toast.error("❌ Hủy ghi danh thất bại, vui lòng thử lại.");
    } finally {
      setLoadingUsers((prev) => ({ ...prev, [taiKhoan]: false }));
    }
  };

  return (
    <div className="p-6 border rounded-lg shadow-md bg-white mt-6">
      <h2 className="text-xl font-semibold mb-4">
        Danh sách học viên đã ghi danh theo mã khóa học
      </h2>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          value={maKhoaHoc}
          onChange={handleOnChange}
          placeholder="Nhập mã khóa học..."
          className="border p-2 flex-1 rounded-md focus:ring-2 focus:ring-green-500"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition disabled:opacity-50"
          disabled={loadingRegistered || !maKhoaHoc.trim()}
        >
          {loadingRegistered ? "Đang tải..." : "Tìm kiếm"}
        </button>
      </form>

      {errorRegistered && (
        <p className="text-center text-red-500">{errorRegistered}</p>
      )}
      {loadingRegistered && (
        <p className="text-center text-gray-500">Đang tải danh sách...</p>
      )}

      {registeredStudents.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-md">
            <thead>
              <tr className="bg-green-500 text-white">
                <th className="px-4 py-2 border">Tài Khoản</th>
                <th className="px-4 py-2 border">Họ Tên</th>
                <th className="px-4 py-2 border">Bí Danh</th>
                <th className="px-4 py-2 border">Ghi danh</th>
              </tr>
            </thead>
            <tbody>
              {registeredStudents.map(
                ({ taiKhoan, biDanh, hoTen }: UnregisteredUser, index: number) => (
                  <tr
                    key={taiKhoan}
                    className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"} hover:bg-gray-200`}
                  >
                    <td className="px-4 py-2 border text-center">{taiKhoan}</td>
                    <td className="px-4 py-2 border text-center">{hoTen}</td>
                    <td className="px-4 py-2 border text-center">{biDanh}</td>
                    <td className="px-4 py-2 border text-center">
                      <Switch
                        checked={selectedUsers[taiKhoan] ?? true}
                        onChange={() => handleToggle(taiKhoan)}
                        disabled={loadingUsers[taiKhoan]}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                          selectedUsers[taiKhoan] ? "bg-green-600" : "bg-red-500"
                        } ${loadingUsers[taiKhoan] ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        <span className="sr-only">Ghi danh</span>
                        <span
                          className={`inline-block h-4 w-4 transform bg-white rounded-full transition ${
                            selectedUsers[taiKhoan] ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </Switch>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500">Vui lòng nhập mã khóa học</p>
      )}
    </div>
  );
}
