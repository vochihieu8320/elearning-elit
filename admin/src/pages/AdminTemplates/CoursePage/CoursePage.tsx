import { useEffect, useState, useCallback } from "react";
import { Modal } from "flowbite-react";
import {
  fetchCourseForAdmin,
  addCourseForAdmin,
  deleteCourseForAdmin,
  updateCourseForAdmin,
} from "./slice";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../store";
import { CourseForAdmin } from "../../../models";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminCoursePage() {
  const { data, error } = useSelector(
    (state: RootState) => state.courseForAdminReducer
  );

  const dispatch: AppDispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseForAdmin | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const filteredData = data?.filter((course) =>
    course.tenKhoaHoc.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const [course, setCourse] = useState<CourseForAdmin>({
    maKhoaHoc: "",
    biDanh: "",
    tenKhoaHoc: "",
    moTa: "",
    luotXem: 0,
    danhGia: 0,
    hinhAnh: "",
    maNhom: "GP01",
    ngayTao: "",
    maDanhMucKhoaHoc: "",
    taiKhoanNguoiTao: "",
  });
  const resetCourseData = useCallback(() => {
    setCourse({
      maKhoaHoc: "",
      biDanh: "",
      tenKhoaHoc: "",
      moTa: "",
      luotXem: 0,
      danhGia: 0,
      hinhAnh: "",
      maNhom: "GP01",
      ngayTao: "",
      maDanhMucKhoaHoc: "",
      taiKhoanNguoiTao: "",
    });
  }, [setCourse]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Validation
      if (!course.maKhoaHoc.trim()) {
        toast.error("❌ Mã khóa học không được bỏ trống!");
        return;
      }
      if (!course.biDanh.trim()) {
        toast.error("❌ Bí danh không được bỏ trống!");
        return;
      }
      if (!course.tenKhoaHoc.trim()) {
        toast.error("❌ Tên khóa học không được bỏ trống!");
        return;
      }
      if (!course.moTa.trim()) {
        toast.error("❌ Mô tả không được bỏ trống!");
        return;
      }
      if (!course.hinhAnh.trim() || !isValidURL(course.hinhAnh)) {
        toast.error("❌ Hình ảnh không hợp lệ (vui lòng nhập URL hợp lệ)!");
        return;
      }
      if (!course.ngayTao) {
        toast.error("❌ Ngày tạo không được bỏ trống!");
        return;
      }

      try {
        if (editingCourse) {
          await dispatch(updateCourseForAdmin(course)).unwrap();
          toast.success("Cập nhật khóa học thành công! 🎉");
        } else {
          await dispatch(addCourseForAdmin(course)).unwrap();
          toast.success("Thêm khóa học thành công! 🎉");
        }

        setOpenModal(false);
        resetCourseData();
        setEditingCourse(null);

        setTimeout(() => {
          dispatch(fetchCourseForAdmin());
        }, 1000);
      } catch (error: any) {
        console.error("Lỗi khi gửi dữ liệu:", error);
        const messageError = error.response.data;
        toast.error(messageError);
      }
    },
    [dispatch, course, editingCourse, resetCourseData]
  );
  const isValidURL = (string: string): boolean => {
    const regex = /^(ftp|http|https):\/\/[^ "]+$/;
    return regex.test(string);
  };

  useEffect(() => {
    dispatch(fetchCourseForAdmin());
  }, [dispatch, data]);

  const handleOnChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCourse((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeleteCourse = async (maKhoaHoc: string) => {
    if (!window.confirm("Bạn có chắc muốn xóa khóa học này?")) return;
    try {
      await dispatch(deleteCourseForAdmin(maKhoaHoc)).unwrap();
      toast.success("Xóa khóa học thành công!");
      setTimeout(() => {
        dispatch(fetchCourseForAdmin());
      }, 1000);
    } catch (error: any) {
      toast.error(error);
    }
  };

  const handleEditCourse = (course: CourseForAdmin) => {
    setEditingCourse(course);
    setCourse(course);
    setOpenModal(true);
  };

  return (
    <div className="p-6">
      <ToastContainer />
      <input
        type="text"
        placeholder="Tìm kiếm khóa học..."
        className="border p-2 rounded mb-4 w-full"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <h1 className="text-2xl font-bold mb-4">Admin - Manage Courses</h1>
      {error && <p className="text-red-500">{error}</p>}
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
        onClick={() => setOpenModal(true)}
      >
        Thêm Khóa Học
      </button>
      <table className="w-full mt-4 border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Hình ảnh</th>
            <th className="border p-2">Tên khóa học</th>
            <th className="border p-2">Danh mục</th>
            <th className="border p-2">Lượt xem</th>
            <th className="border p-2">Ngày tạo</th>
            <th className="border p-2">Số học viên</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredData?.map((course) => (
            <tr key={course.maKhoaHoc} className="border">
              <td className="border p-2">
                <img
                  src={course.hinhAnh || "https://..."}
                  alt={course.tenKhoaHoc}
                  className="w-12 h-12"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src =
                      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg";
                  }}
                />
              </td>
              <td className="border p-2">{course.tenKhoaHoc}</td>
              <td className="border p-2">
                {course.danhMucKhoaHoc?.tenDanhMucKhoaHoc}
              </td>
              <td className="border p-2">{course.luotXem}</td>
              <td className="border p-2">{course.ngayTao}</td>
              <td className="border p-2">{course.soLuongHocVien}</td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() => handleEditCourse(course)}
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDeleteCourse(course.maKhoaHoc)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal
        show={openModal}
        onClose={() => {
          setOpenModal(false);
          resetCourseData();
          setEditingCourse(null);
        }}
      >
        <Modal.Header>
          {editingCourse ? "Chỉnh Sửa Khóa Học" : "Thêm Khóa Học"}
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            {/* Các input bình thường */}
            {[
              { label: "Mã khóa học", name: "maKhoaHoc" },
              { label: "Bí danh", name: "biDanh" },
              { label: "Tên khóa học", name: "tenKhoaHoc" },
              { label: "Mô tả", name: "moTa" },
              { label: "Hình ảnh (URL)", name: "hinhAnh" },
              { label: "Ngày tạo", name: "ngayTao", type: "date" },
            ].map(({ label, name, type = "text" }) => (
              <div key={name}>
                <label className="block font-medium">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={course[name as keyof CourseForAdmin] as string}
                  onChange={handleOnChange}
                  placeholder={`Nhập ${label.toLowerCase()}`}
                  className="w-full border p-2 rounded"
                />
              </div>
            ))}

            {/* Dropdown cho Mã danh mục khóa học */}
            <div>
              <label className="block font-medium">Mã danh mục khóa học</label>
              <select
                name="maDanhMucKhoaHoc"
                value={course.maDanhMucKhoaHoc}
                onChange={handleOnChange}
                className="w-full border p-2 rounded"
              >
                <option value="">Chọn danh mục</option>

                {data?.map((item) => {
                  return (
                    <option
                      key={`${item.danhMucKhoaHoc.maDanhMucKhoahoc}`}
                      value={item.danhMucKhoaHoc.maDanhMucKhoahoc}
                    >
                      {item.danhMucKhoaHoc.tenDanhMucKhoaHoc}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <label className="block font-medium">Tài khoản người tạo</label>
              <select
                name="taiKhoanNguoiTao"
                value={course.taiKhoanNguoiTao}
                onChange={handleOnChange}
                className="w-full border p-2 rounded"
              >
                <option value="">Chọn tài khoản giảng viên</option>
                {data
                  ?.filter((c) => c.nguoiTao.maLoaiNguoiDung === "GV")
                  .map((c) => (
                    <option
                      key={`${c.nguoiTao.taiKhoan}`}
                      value={c.nguoiTao.taiKhoan}
                    >
                      {c.nguoiTao.hoTen}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            onClick={() => {
              setOpenModal(false);
              resetCourseData();
              setEditingCourse(null);
            }}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Đóng
          </button>

          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {editingCourse ? "Cập nhật" : "Thêm"}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
