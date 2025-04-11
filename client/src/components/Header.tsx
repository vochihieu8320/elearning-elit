import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import {
  Menu,
  Search,
  Bell,
  User,
  X,
  ChevronDown,
  ShoppingCart,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User as UserType } from "@shared/schema";
import { ADMIN_BASE_URL } from "@/config/api";

// Interface for the external API user
interface ExternalUser {
  taiKhoan: string;
  email: string;
  soDT: string;
  maNhom: string;
  maLoaiNguoiDung: string;
  hoTen: string;
  accessToken: string;
}

export default function Header() {
  const [location, navigate] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Helper functions to handle different user types
  const getUserName = () => {
    if (!user) return "";
    if ("username" in user) return user.username;
    if ("taiKhoan" in user) return user.taiKhoan;
    return "";
  };

  const getFullName = () => {
    if (!user) return "";
    if ("fullName" in user) return user.fullName;
    if ("hoTen" in user) return user.hoTen;
    return getUserName();
  };

  const getAvatar = (): string | undefined => {
    if (!user) return undefined;
    if ("avatar" in user) return user.avatar as string;
    return undefined;
  };

  const isAdmin = () => {
    if (!user) return false;
    if ("role" in user) return user.role === "admin";
    if ("maLoaiNguoiDung" in user) return user.maLoaiNguoiDung === "GV";
    return false;
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/courses?search=${encodeURIComponent(searchQuery)}`);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link href="/">
              <span className="flex items-center cursor-pointer">
                <img
                  src="/src/assets/logo_eLIT.png" // Path to the logo image
                  alt="eLIT Logo"
                  className="h-20 w-auto" // Adjust height and width as needed
                />{" "}
              </span>
            </Link>

            {/* Categories dropdown */}
            {/* <div className="hidden md:block relative">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center text-gray-700 hover:text-blue-800">
                    <span>Danh mục</span>
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Danh mục khóa học</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <Link href="/courses?category=lap-trinh-web" className="w-full cursor-pointer">
                        Lập trình web
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/courses?category=phat-trien-di-dong" className="w-full cursor-pointer">
                        Phát triển di động
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/courses?category=ngoai-ngu" className="w-full cursor-pointer">
                        Ngoại ngữ
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/courses?category=marketing" className="w-full cursor-pointer">
                        Marketing
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/courses?category=thiet-ke" className="w-full cursor-pointer">
                        Thiết kế
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link href="/courses" className="w-full cursor-pointer">
                        Tất cả danh mục
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div> */}
          </div>

          {/* Search */}
          {/* <div className="hidden md:flex flex-1 max-w-xl mx-4">
            <form onSubmit={handleSearch} className="w-full relative">
              <Input
                type="text"
                placeholder="Tìm kiếm khóa học..."
                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
            </form>
          </div> */}

          {/* Navigation */}
          <nav className="flex items-center space-x-1 sm:space-x-4">
            {isAuthenticated && (
              <>
                <Link
                  href="/my-courses"
                  className="hidden md:block px-2 py-1 text-gray-700 hover:text-blue-800 font-medium"
                >
                  Khóa học của tôi
                </Link>
                {/* <Link
                  href="/cart"
                  className="hidden md:block px-2 py-1 text-gray-700 hover:text-blue-800 font-medium"
                >
                  Giỏ hàng
                </Link> */}
              </>
            )}

            {/* User not logged in */}
            {!isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-2">
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="border-blue-800 text-blue-800 hover:bg-blue-800 hover:text-white"
                  >
                    Đăng nhập
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary">Đăng ký</Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/">
                  <Button
                    variant="ghost"
                    className="p-2 text-gray-700 hover:text-blue-800 relative"
                  >
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
                      2
                    </span>
                  </Button>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="p-1">
                      <Avatar>
                        {getAvatar() && (
                          <AvatarImage src={getAvatar()} alt={getUserName()} />
                        )}
                        <AvatarFallback>
                          {getUserName().charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>{getFullName()}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        <Link href="/profile" className="flex w-full">
                          <User className="mr-2 h-4 w-4" />
                          <span>Hồ sơ cá nhân</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href="/my-courses" className="flex w-full">
                          <GraduationCap className="mr-2 h-4 w-4" />
                          <span>Khóa học của tôi</span>
                        </Link>
                      </DropdownMenuItem>
                      {/* <DropdownMenuItem>
                        <Link href="/cart" className="flex w-full">
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          <span>Giỏ hàng</span>
                        </Link>
                      </DropdownMenuItem> */}
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <>
                      <DropdownMenuItem>
                        <a
                          href="/admin/auth"
                          className="flex w-full"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          <span>Quản trị viên</span>
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Đăng xuất</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  variant="ghost"
                  className="md:hidden"
                  onClick={toggleMobileMenu}
                >
                  {mobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </Button>
              </div>
            )}
          </nav>
        </div>
      </div>

      {/* Mobile search (visible only on small screens) */}
      <div className="md:hidden px-4 pb-3">
        <form onSubmit={handleSearch} className="relative w-full">
          <Input
            type="text"
            placeholder="Tìm kiếm khóa học..."
            className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
        </form>
      </div>

      {/* Mobile menu (visible only on small screens when menu is toggled) */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="container mx-auto px-4 py-3">
            <ul className="space-y-2">
              {isAuthenticated ? (
                <>
                  <li>
                    <Link
                      href="/my-courses"
                      className="block px-2 py-2 text-gray-700 hover:text-blue-800 font-medium"
                    >
                      Khóa học của tôi
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/cart"
                      className="block px-2 py-2 text-gray-700 hover:text-blue-800 font-medium"
                    >
                      Giỏ hàng
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/profile"
                      className="block px-2 py-2 text-gray-700 hover:text-blue-800 font-medium"
                    >
                      Hồ sơ cá nhân
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-2 py-2 text-gray-700 hover:text-blue-800 font-medium"
                    >
                      Đăng xuất
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      href="/login"
                      className="block px-2 py-2 text-gray-700 hover:text-blue-800 font-medium"
                    >
                      Đăng nhập
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/register"
                      className="block px-2 py-2 text-gray-700 hover:text-blue-800 font-medium"
                    >
                      Đăng ký
                    </Link>
                  </li>
                </>
              )}

              <li className="pt-2 border-t border-gray-200">
                <Link
                  href="/courses"
                  className="block px-2 py-2 text-gray-700 hover:text-blue-800 font-medium"
                >
                  Tất cả khóa học
                </Link>
              </li>
              <li>
                <Link
                  href="/courses?category=lap-trinh-web"
                  className="block px-2 py-2 text-gray-700 hover:text-blue-800 font-medium"
                >
                  Lập trình web
                </Link>
              </li>
              <li>
                <Link
                  href="/courses?category=phat-trien-di-dong"
                  className="block px-2 py-2 text-gray-700 hover:text-blue-800 font-medium"
                >
                  Phát triển di động
                </Link>
              </li>
              <li>
                <Link
                  href="/courses?category=marketing"
                  className="block px-2 py-2 text-gray-700 hover:text-blue-800 font-medium"
                >
                  Marketing
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}

// Missing components that need to be imported
import { LayoutDashboard, LogOut, GraduationCap } from "lucide-react";
