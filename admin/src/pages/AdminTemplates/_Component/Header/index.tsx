import { useSelector } from "react-redux";
import { RootState } from "../../../../store";

export default function Header() {
  const { data } = useSelector((state: RootState) => state.authReducer);

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center space-x-3 text-white">
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="h-8"
            alt="Logo"
          />
          <span className="text-2xl font-bold tracking-wide">Elearning</span>
        </a>

        {/* User Info */}
        <div className="flex items-center space-x-3 text-white">
          <img
            src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
            alt="User Avatar"
            className="w-10 h-10 rounded-full border-2 border-white shadow-md"
          />
          {data?.taiKhoan && (
            <span className="font-medium">{data.taiKhoan}</span>
          )}
        </div>
      </div>
    </nav>
  );
}
