import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";

import MainLayout from "@/layouts/MainLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Phone,
  Shield,
  BookOpen,
  Edit,
  Save,
  X,
  PlayCircle,
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Define types
interface UserProfile {
  taiKhoan: string;
  matKhau: string;
  hoTen: string;
  soDT: string;
  maLoaiNguoiDung: string;
  maNhom: string;
  email: string;
  chiTietKhoaHocGhiDanh: CourseEnrollment[];
}

interface CourseEnrollment {
  maKhoaHoc: string;
  tenKhoaHoc: string;
  biDanh: string;
  hinhAnh: string;
}

// Form validation schema
const profileFormSchema = z.object({
  hoTen: z.string().min(2, { message: "Họ tên phải có ít nhất 2 ký tự" }),
  email: z.string().email({ message: "Email không hợp lệ" }),
  soDT: z.string().min(6, { message: "Số điện thoại không hợp lệ" }),
  matKhau: z.string().optional(),
  matKhauXacNhan: z.string().optional(),
}).refine((data) => {
  // If either password field is filled, both must be filled and match
  if (data.matKhau || data.matKhauXacNhan) {
    return data.matKhau === data.matKhauXacNhan;
  }
  return true;
}, {
  message: "Mật khẩu và xác nhận mật khẩu không khớp",
  path: ["matKhauXacNhan"],
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [isCancelling, setIsCancelling] = useState<string | null>(null);

  // Initialize the form
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      hoTen: "",
      email: "",
      soDT: "",
    },
  });

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const accessToken = localStorage.getItem("accessToken");
        
        if (!accessToken) {
          toast({
            title: "Lỗi xác thực",
            description: "Vui lòng đăng nhập lại để tiếp tục",
            variant: "destructive",
          });
          setLocation("/auth");
          return;
        }

        const response = await fetch(
          "https://elearning0706.cybersoft.edu.vn/api/QuanLyNguoiDung/ThongTinNguoiDung",
          {
            method: "POST",
            headers: {
              "accept": "application/json",
              "Authorization": `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Không thể tải thông tin người dùng");
        }

        const data = await response.json();
        setUserProfile(data);
        
        // Set form default values
        form.reset({
          hoTen: data.hoTen || "",
          email: data.email || "",
          soDT: data.soDT || "",
        });
      } catch (error: any) {
        toast({
          title: "Lỗi",
          description: error.message || "Đã xảy ra lỗi khi tải thông tin người dùng",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Handle form submission
  const onSubmit = async (data: ProfileFormValues) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      
      if (!accessToken || !userProfile) {
        toast({
          title: "Lỗi xác thực",
          description: "Vui lòng đăng nhập lại để tiếp tục",
          variant: "destructive",
        });
        return;
      }
      
      // Create update payload
      const updateData = {
        taiKhoan: userProfile.taiKhoan,
        matKhau: data.matKhau || userProfile.matKhau, // Keep the existing password if not changed
        hoTen: data.hoTen,
        soDT: data.soDT,
        maLoaiNguoiDung: userProfile.maLoaiNguoiDung,
        maNhom: userProfile.maNhom,
        email: data.email
      };
      
      // Call API to update user profile
      const response = await fetch(
        "https://elearning0706.cybersoft.edu.vn/api/QuanLyNguoiDung/CapNhatThongTinNguoiDung",
        {
          method: "PUT",
          headers: {
            "accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
          },
          body: JSON.stringify(updateData)
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Cập nhật thất bại");
      }
      
      toast({
        title: "Thành công",
        description: "Thông tin cá nhân đã được cập nhật",
      });
      
      // Update local state with new values
      setUserProfile({
        ...userProfile,
        hoTen: data.hoTen,
        email: data.email,
        soDT: data.soDT,
        matKhau: data.matKhau || userProfile.matKhau,
      });
      
      // Clear password fields and exit edit mode
      form.setValue("matKhau", "");
      form.setValue("matKhauXacNhan", "");
      setIsEditing(false);
    } catch (error: any) {
      toast({
        title: "Cập nhật thất bại",
        description: error.message || "Đã xảy ra lỗi khi cập nhật thông tin",
        variant: "destructive",
      });
    }
  };

  // Cancel editing
  const handleCancel = () => {
    form.reset({
      hoTen: userProfile?.hoTen || "",
      email: userProfile?.email || "",
      soDT: userProfile?.soDT || "",
      matKhau: "",
      matKhauXacNhan: "",
    });
    setIsEditing(false);
  };
  
  // Handle course enrollment cancellation
  const handleCancelEnrollment = async (courseId: string) => {
    try {
      setIsCancelling(courseId);
      const accessToken = localStorage.getItem("accessToken");
      
      if (!accessToken || !userProfile) {
        toast({
          title: "Lỗi xác thực",
          description: "Vui lòng đăng nhập lại để tiếp tục",
          variant: "destructive",
        });
        return;
      }
      
      // Create request payload
      const payload = {
        maKhoaHoc: courseId,
        taiKhoan: userProfile.taiKhoan
      };
      
      // Call API to cancel enrollment
      const response = await fetch(
        "https://elearning0706.cybersoft.edu.vn/api/QuanLyKhoaHoc/HuyGhiDanh",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
          },
          body: JSON.stringify(payload)
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Huỷ đăng ký thất bại");
      }
      
      // Update user profile by removing the cancelled course
      setUserProfile(prev => {
        if (!prev) return null;
        
        return {
          ...prev,
          chiTietKhoaHocGhiDanh: prev.chiTietKhoaHocGhiDanh.filter(
            course => course.maKhoaHoc !== courseId
          )
        };
      });
      
      toast({
        title: "Thành công",
        description: "Đã huỷ đăng ký khóa học"
      });
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Đã xảy ra lỗi khi huỷ đăng ký khóa học",
        variant: "destructive",
      });
    } finally {
      setIsCancelling(null);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container py-8">
          <div className="w-full max-w-4xl mx-auto">
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
              <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!userProfile) {
    return (
      <MainLayout>
        <div className="container py-8">
          <div className="w-full max-w-4xl mx-auto">
            <Card>
              <CardContent className="py-12 text-center">
                <h1 className="text-2xl font-bold mb-2">Không thể tải thông tin</h1>
                <p className="text-gray-600 mb-6">Vui lòng đăng nhập lại để tiếp tục</p>
                <Button onClick={() => setLocation("/auth")}>Đăng nhập</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="w-full max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Thông tin tài khoản</h1>
          
          <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Thông tin cá nhân</TabsTrigger>
              <TabsTrigger value="courses">Khóa học đã đăng ký</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Hồ sơ cá nhân</CardTitle>
                      <CardDescription>
                        Xem và cập nhật thông tin cá nhân của bạn
                      </CardDescription>
                    </div>
                    {!isEditing && (
                      <Button variant="outline" onClick={() => setIsEditing(true)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Chỉnh sửa
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center text-muted-foreground mb-1">
                              <User className="mr-2 h-4 w-4" />
                              <span>Tài khoản</span>
                            </div>
                            <div className="font-medium text-lg">{userProfile.taiKhoan}</div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center text-muted-foreground mb-1">
                              <Shield className="mr-2 h-4 w-4" />
                              <span>Loại tài khoản</span>
                            </div>
                            <div className="font-medium text-lg">
                              {userProfile.maLoaiNguoiDung === "HV" ? "Học viên" : 
                              userProfile.maLoaiNguoiDung === "GV" ? "Giảng viên" : userProfile.maLoaiNguoiDung}
                            </div>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <FormField
                          control={form.control}
                          name="hoTen"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Họ và tên</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  disabled={!isEditing}
                                  className={!isEditing ? "bg-gray-50" : ""}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  type="email" 
                                  disabled={!isEditing}
                                  className={!isEditing ? "bg-gray-50" : ""}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="soDT"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Số điện thoại</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  disabled={!isEditing}
                                  className={!isEditing ? "bg-gray-50" : ""}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {isEditing && (
                          <>
                            <Separator />
                            <div className="pt-2">
                              <h3 className="text-lg font-medium mb-4">Thay đổi mật khẩu</h3>
                              <p className="text-sm text-muted-foreground mb-4">
                                Bỏ qua trường này nếu bạn không muốn đổi mật khẩu
                              </p>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                  control={form.control}
                                  name="matKhau"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Mật khẩu mới</FormLabel>
                                      <FormControl>
                                        <Input 
                                          {...field} 
                                          type="password"
                                          autoComplete="new-password"
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <FormField
                                  control={form.control}
                                  name="matKhauXacNhan"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Xác nhận mật khẩu mới</FormLabel>
                                      <FormControl>
                                        <Input 
                                          {...field} 
                                          type="password"
                                          autoComplete="new-password"
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                      
                      {isEditing && (
                        <div className="flex justify-end space-x-2">
                          <Button type="button" variant="outline" onClick={handleCancel}>
                            <X className="mr-2 h-4 w-4" />
                            Hủy
                          </Button>
                          <Button type="submit">
                            <Save className="mr-2 h-4 w-4" />
                            Lưu thay đổi
                          </Button>
                        </div>
                      )}
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="courses">
              <Card>
                <CardHeader>
                  <CardTitle>Khóa học đã đăng ký</CardTitle>
                  <CardDescription>
                    Danh sách các khóa học bạn đã tham gia
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {userProfile.chiTietKhoaHocGhiDanh && userProfile.chiTietKhoaHocGhiDanh.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {userProfile.chiTietKhoaHocGhiDanh.map((course) => (
                        <Card key={course.maKhoaHoc} className="overflow-hidden group hover:shadow-md transition-all duration-300">
                          <div className="relative">
                            <div 
                              className="h-48 w-full bg-gray-200 relative overflow-hidden cursor-pointer"
                              onClick={() => setLocation(`/courses/${course.maKhoaHoc}`)}
                            >
                              <img 
                                src={course.hinhAnh} 
                                alt={course.tenKhoaHoc} 
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "/placeholder-course.jpg";
                                }}
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <div className="bg-white bg-opacity-90 rounded-full p-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                  <PlayCircle className="h-8 w-8 text-blue-600" />
                                </div>
                              </div>
                            </div>
                            <div className="absolute top-2 right-2">
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                                Đã đăng ký
                              </Badge>
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <div 
                              className="font-semibold text-lg mb-2 line-clamp-2 hover:text-blue-600 cursor-pointer transition-colors"
                              onClick={() => setLocation(`/courses/${course.maKhoaHoc}`)}
                            >
                              {course.tenKhoaHoc}
                            </div>
                            <div className="text-sm text-muted-foreground mb-4 line-clamp-2">
                              {course.biDanh?.replace(/-/g, ' ')}
                            </div>
                            <div className="flex flex-col space-y-3">
                              <Button 
                                variant="default" 
                                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-sm"
                                onClick={() => setLocation(`/courses/${course.maKhoaHoc}`)}
                              >
                                <BookOpen className="h-4 w-4 mr-2" />
                                Vào học
                              </Button>
                              
                              <Button
                                variant="outline"
                                className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                                onClick={() => handleCancelEnrollment(course.maKhoaHoc)}
                                disabled={isCancelling === course.maKhoaHoc}
                              >
                                {isCancelling === course.maKhoaHoc ? (
                                  <><span className="animate-spin mr-2">⏳</span> Đang huỷ...</>
                                ) : (
                                  <><X className="h-4 w-4 mr-2" /> Huỷ đăng ký</>
                                )}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[1, 2].map((i) => (
                        <Card key={i} className="overflow-hidden">
                          <div className="h-48 w-full bg-gray-200 animate-pulse" />
                          <CardContent className="p-4">
                            <div className="h-6 w-3/4 bg-gray-200 animate-pulse mb-2 rounded" />
                            <div className="h-4 w-1/2 bg-gray-200 animate-pulse mb-4 rounded" />
                            <div className="flex flex-col space-y-3">
                              <div className="h-9 w-full bg-gray-200 animate-pulse rounded" />
                              <div className="h-9 w-full bg-gray-200 animate-pulse rounded" />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="h-10 w-10 text-blue-500 opacity-80" />
                      </div>
                      <h3 className="text-xl font-medium mb-2">Bạn chưa đăng ký khóa học nào</h3>
                      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                        Hãy khám phá các khóa học và bắt đầu hành trình học tập của bạn để mở khóa kiến thức mới
                      </p>
                      <Button 
                        onClick={() => setLocation("/courses")}
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                      >
                        <Search className="h-4 w-4 mr-2" />
                        Khám phá khóa học
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
}