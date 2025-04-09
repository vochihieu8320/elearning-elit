import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import MainLayout from "@/layouts/MainLayout";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Search, 
  BookOpen, 
  PlayCircle,
  Filter,
  BookCheck,
  Clock,
  GraduationCap,
  X,
  AlertTriangle
} from "lucide-react";

// Define types
interface CourseEnrollment {
  maKhoaHoc: string;
  tenKhoaHoc: string;
  biDanh: string;
  hinhAnh: string;
}

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

export default function MyCoursesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [isCancelling, setIsCancelling] = useState<string | null>(null);

  // Fetch user profile data with enrolled courses
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

  // Filter enrolled courses based on the active tab
  const getFilteredCourses = () => {
    if (!userProfile?.chiTietKhoaHocGhiDanh) return [];
    
    if (activeTab === "all") {
      return userProfile.chiTietKhoaHocGhiDanh;
    }
    
    // Since we don't have progress data from the API, we can't truly filter
    // But we could implement this feature when that data becomes available
    return userProfile.chiTietKhoaHocGhiDanh;
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

  const filteredCourses = getFilteredCourses();

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container py-8">
          <div className="w-full max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
            </div>
            
            <div className="h-14 bg-gray-200 rounded mb-6 animate-pulse"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="h-48 w-full bg-gray-200 animate-pulse" />
                  <CardContent className="p-4">
                    <div className="h-6 w-3/4 bg-gray-200 animate-pulse mb-2 rounded" />
                    <div className="h-4 w-1/2 bg-gray-200 animate-pulse mb-4 rounded" />
                    <div className="flex justify-between items-center">
                      <div className="h-9 w-24 bg-gray-200 animate-pulse rounded" />
                      <div className="h-4 w-16 bg-gray-200 animate-pulse rounded" />
                    </div>
                  </CardContent>
                </Card>
              ))}
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
          <div className="w-full max-w-7xl mx-auto">
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
        <div className="w-full max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Khóa học của tôi</h1>
              <p className="text-muted-foreground">
                Quản lý và tiếp tục học các khóa học bạn đã đăng ký
              </p>
            </div>
            <Button 
              variant="outline" 
              className="mt-4 md:mt-0"
              onClick={() => setLocation("/courses")}
            >
              <Search className="mr-2 h-4 w-4" />
              Tìm khóa học mới
            </Button>
          </div>
          
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid grid-cols-3 w-full md:w-[400px]">
              <TabsTrigger value="all" className="flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                <span>Tất cả khóa học</span>
              </TabsTrigger>
              <TabsTrigger value="learning" className="flex items-center">
                <BookCheck className="h-4 w-4 mr-2" />
                <span>Đang học</span>
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex items-center">
                <GraduationCap className="h-4 w-4 mr-2" />
                <span>Đã hoàn thành</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              {filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map((course) => (
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
            </TabsContent>
            
            <TabsContent value="learning" className="mt-6">
              <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-100">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookCheck className="h-10 w-10 text-blue-500 opacity-80" />
                </div>
                <h3 className="text-xl font-medium mb-2">Tính năng đang phát triển</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Chúng tôi đang phát triển tính năng theo dõi tiến độ học tập. Vui lòng quay lại sau.
                </p>
                <Button 
                  onClick={() => setActiveTab("all")}
                  variant="outline"
                >
                  Xem tất cả khóa học
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="completed" className="mt-6">
              <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-100">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="h-10 w-10 text-blue-500 opacity-80" />
                </div>
                <h3 className="text-xl font-medium mb-2">Tính năng đang phát triển</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Chúng tôi đang phát triển tính năng hoàn thành khóa học. Vui lòng quay lại sau.
                </p>
                <Button 
                  onClick={() => setActiveTab("all")}
                  variant="outline"
                >
                  Xem tất cả khóa học
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
}
