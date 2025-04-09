import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { User } from "@shared/schema";
import { AUTH_ENDPOINTS } from "@/config/api";

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

interface AuthContextType {
  user: User | ExternalUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (userData: { 
    username: string;
    password: string;
    email: string;
    fullName: string;
    phone: string;
    groupCode: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | ExternalUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error("Error parsing stored user", error);
          localStorage.removeItem('user');
          localStorage.removeItem('accessToken');
        }
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      // Call the external API for login
      const response = await fetch(AUTH_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taiKhoan: username,
          matKhau: password
        }),
      });
      
      // Check if the response is successful
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }
      
      const data = await response.json();
      
      // Store the access token and user in localStorage
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data));
      
      setUser(data);
    } catch (error: any) {
      toast({
        title: "Đăng nhập thất bại",
        description: error.message || "Sai tên đăng nhập hoặc mật khẩu",
        variant: "destructive",
      });
      throw error;
    }
  };

  const register = async (userData: { 
    username: string; 
    password: string; 
    email: string; 
    fullName: string;
    phone: string;
    groupCode: string;
  }) => {
    try {
      // Call the external API for registration
      const response = await fetch(AUTH_ENDPOINTS.REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taiKhoan: userData.username,
          matKhau: userData.password,
          hoTen: userData.fullName,
          soDT: userData.phone,
          maNhom: userData.groupCode,
          email: userData.email
        }),
      });
      
      // Check if the response is successful
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }
      
      const data = await response.json();
      toast({
        title: "Đăng ký thành công",
        description: "Vui lòng đăng nhập với tài khoản vừa tạo",
        variant: "default",
      });
      
      // Don't set user here since we're redirecting to login
    } catch (error: any) {
      toast({
        title: "Đăng ký thất bại",
        description: error.message || "Không thể tạo tài khoản",
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Clear localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      
      setUser(null);
      
      toast({
        title: "Đăng xuất thành công",
        description: "Bạn đã đăng xuất khỏi hệ thống",
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Đăng xuất thất bại",
        description: error.message || "Không thể đăng xuất",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
