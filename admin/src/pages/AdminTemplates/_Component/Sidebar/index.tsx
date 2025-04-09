import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  BookOpen,
  ClipboardList,
} from "lucide-react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [isUsersDropdownOpen, setIsUsersDropdownOpen] = useState(false); // Quản lý trạng thái dropdown Users
  const [isRegisterDropdownOpen, setIsRegisterDropdownOpen] = useState(false); // Quản lý trạng thái dropdown Register

  // Hàm để đóng tất cả dropdowns
  const closeAllDropdowns = () => {
    setIsUsersDropdownOpen(false);
    setIsRegisterDropdownOpen(false);
  };

  // Hàm để toggle dropdown Users
  const toggleUsersDropdown = () => {
    setIsUsersDropdownOpen((prev) => !prev);
    // Đảm bảo đóng dropdown Register khi mở Users
    if (isRegisterDropdownOpen) {
      setIsRegisterDropdownOpen(false);
    }
  };

  // Hàm để toggle dropdown Register
  const toggleRegisterDropdown = () => {
    setIsRegisterDropdownOpen((prev) => !prev);
    // Đảm bảo đóng dropdown Users khi mở Register
    if (isUsersDropdownOpen) {
      setIsUsersDropdownOpen(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`flex flex-col transition-all duration-300 p-4 bg-gray-900 text-white ${
          isOpen ? "w-64" : "w-16"
        }`}
      >
        {/* Toggle Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="mb-4">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo */}
        <div className="flex items-center space-x-3 mb-6">
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="h-8"
            alt="Logo"
          />
          {isOpen && <span className="text-2xl font-semibold">Admin</span>}
        </div>

        {/* Menu Items */}
        <nav className="flex flex-col space-y-2">
          <NavLink
            to="/admin/dashboard"
            onClick={closeAllDropdowns} // Đóng tất cả dropdowns khi nhấn vào Dashboard
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                isActive ? "bg-blue-600" : "hover:bg-gray-700"
              }`
            }
          >
            <LayoutDashboard size={20} />
            {isOpen && "Dashboard"}
          </NavLink>

          {/* Users Menu */}
          <div>
            {/* NavLink for Users */}
            <button
              onClick={toggleUsersDropdown} // Toggling dropdown khi nhấn vào "Users"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                isUsersDropdownOpen ? "bg-blue-600" : "hover:bg-gray-700"
              }`}
            >
              <Users size={20} />
              {isOpen && "Users"}
            </button>

            {/* Dropdown - Add User */}
            {isUsersDropdownOpen && isOpen && (
              <div className="ml-4">
                <NavLink
                  to="/admin/add-user"
                  onClick={() => {}}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                      isActive ? "bg-blue-600" : "hover:bg-gray-700"
                    }`
                  }
                >
                  + Add User
                </NavLink>

                <NavLink
                  to="/admin/list-user"
                  onClick={() => {}}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                      isActive ? "bg-blue-600" : "hover:bg-gray-700"
                    }`
                  }
                >
                  + List User
                </NavLink>
              </div>
            )}
          </div>

          <NavLink
            to="/admin/course"
            onClick={closeAllDropdowns} // Đóng tất cả dropdowns khi nhấn vào Course
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                isActive ? "bg-blue-600" : "hover:bg-gray-700"
              }`
            }
          >
            <BookOpen size={20} />
            {isOpen && "Course"}
          </NavLink>

          {/* Register Menu */}
          <div>
            {/* NavLink for Register */}
            <button
              onClick={toggleRegisterDropdown} // Toggling dropdown khi nhấn vào "Register"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                isRegisterDropdownOpen ? "bg-blue-600" : "hover:bg-gray-700"
              }`}
            >
              <ClipboardList size={20} />
              {isOpen && "Register"}
            </button>

            {/* Dropdown - Register Options */}
            {isRegisterDropdownOpen && isOpen && (
              <div className="ml-4">
                <NavLink
                  to="/admin/registeredUserByCourse"
                  onClick={() => {}}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                      isActive ? "bg-blue-600" : "hover:bg-gray-700"
                    }`
                  }
                >
                  +RegisterUserByCourse
                </NavLink>
                <NavLink
                  to="/admin/unRegisteredUserByCourse"
                  onClick={() => {}}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                      isActive ? "bg-blue-600" : "hover:bg-gray-700"
                    }`
                  }
                >
                  +UnRegisterUserByCourse
                </NavLink>
                <NavLink
                  to="/admin/reviewRegisteredUser"
                  onClick={() => {}}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                      isActive ? "bg-blue-600" : "hover:bg-gray-700"
                    }`
                  }
                >
                  +ReviewRegisteredUserByCourse
                </NavLink>
                <NavLink
                  to="/admin/registeredCourseByUser"
                  onClick={() => {}}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                      isActive ? "bg-blue-600" : "hover:bg-gray-700"
                    }`
                  }
                >
                  +RegisterCourseByUser
                </NavLink>
                <NavLink
                  to="/admin/unRegisteredCourseByUser"
                  onClick={() => {}}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                      isActive ? "bg-blue-600" : "hover:bg-gray-700"
                    }`
                  }
                >
                  +UnRegisterCourseByUser
                </NavLink>
                <NavLink
                  to="/admin/reviewRegisteredCourse"
                  onClick={() => {}}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                      isActive ? "bg-blue-600" : "hover:bg-gray-700"
                    }`
                  }
                >
                  +ReviewRegisteredCourseByUser
                </NavLink>
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}
