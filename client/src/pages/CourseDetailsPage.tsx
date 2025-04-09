import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import MainLayout from "@/layouts/MainLayout";
import { ExternalCourseDetail } from "@/types/external-course";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Clock, 
  Calendar, 
  Check, 
  ChevronRight,
  PlayCircle,
  Eye,
  Users,
  Verified
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import StarRating from "@/components/StarRating";

export default function CourseDetailsPage() {
  const { slug, maKhoaHoc } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const courseId = maKhoaHoc || slug; // Use maKhoaHoc for external API or slug for internal
  
  const isExternalCourse = !!maKhoaHoc;

  // Fetch external course details if maKhoaHoc is provided
  const { 
    data: externalCourse, 
    isLoading: loadingExternalCourse, 
    error: externalCourseError 
  } = useQuery<ExternalCourseDetail>({
    queryKey: ['course-details', courseId],
    queryFn: async () => {
      if (!courseId) throw new Error('Course ID is required');
      
      const response = await fetch(`https://elearning0706.cybersoft.edu.vn/api/QuanLyKhoaHoc/LayThongTinKhoaHoc?maKhoaHoc=${courseId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch course details');
      }
      return await response.json();
    },
    enabled: isExternalCourse && !!courseId,
  });

  // Enroll in the course
  const [location, setLocation] = useLocation();
  const [isEnrolling, setIsEnrolling] = useState(false);

  const handleEnroll = async () => {
    if (!user) {
      toast({
        title: "Đăng nhập yêu cầu",
        description: "Vui lòng đăng nhập để đăng ký khóa học này",
        variant: "destructive",
      });
      return;
    }

    // Check if we have the necessary data
    const userTaiKhoan = localStorage.getItem('user') ? 
      JSON.parse(localStorage.getItem('user') || '{}').taiKhoan : null;
      
    const accessToken = localStorage.getItem('accessToken');
    
    if (!userTaiKhoan || !accessToken) {
      toast({
        title: "Lỗi xác thực",
        description: "Vui lòng đăng nhập lại để tiếp tục",
        variant: "destructive",
      });
      return;
    }

    if (!courseId) {
      toast({
        title: "Lỗi khóa học",
        description: "Không tìm thấy mã khóa học",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsEnrolling(true);
      
      const response = await fetch('https://elearning0706.cybersoft.edu.vn/api/QuanLyKhoaHoc/DangKyKhoaHoc', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          maKhoaHoc: courseId,
          taiKhoan: userTaiKhoan
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Đăng ký khóa học thất bại');
      }

      toast({
        title: "Đăng ký thành công",
        description: "Bạn đã đăng ký khóa học thành công",
      });
      
      // Redirect to my-courses page
      setTimeout(() => {
        setLocation('/my-courses');
      }, 1500);
    } catch (error: any) {
      toast({
        title: "Đăng ký thất bại",
        description: error.message || "Có lỗi xảy ra khi đăng ký khóa học",
        variant: "destructive",
      });
    } finally {
      setIsEnrolling(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('vi-VN');
    } catch (e) {
      return dateString; // Return the original string if parsing fails
    }
  };

  if (loadingExternalCourse) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-8/12">
                <div className="h-96 bg-gray-200 rounded mb-8"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 mb-6"></div>
              </div>
              <div className="md:w-4/12">
                <div className="h-96 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (externalCourseError || (!externalCourse && isExternalCourse)) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <h1 className="text-2xl font-bold mb-2">Khóa học không tồn tại</h1>
              <p className="text-gray-600 mb-6">Khóa học bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
              <Link href="/courses">
                <Button>Xem các khóa học khác</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  if (externalCourse) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb Navigation */}
          <nav className="flex mb-6 text-sm" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link href="/">
                  <span className="text-gray-700 hover:text-blue-700 inline-flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Trang chủ
                  </span>
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRight className="text-gray-400 mx-2 h-4 w-4" />
                  <Link href="/courses">
                    <span className="text-gray-700 hover:text-blue-700">Khóa học</span>
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <ChevronRight className="text-gray-400 mx-2 h-4 w-4" />
                  <span className="text-gray-500">{externalCourse.tenKhoaHoc}</span>
                </div>
              </li>
            </ol>
          </nav>

          <div className="lg:flex gap-8">
            {/* Course Content - Left Column */}
            <div className="lg:w-8/12">
              {/* Course Title */}
              <h1 className="text-3xl font-bold mb-4">{externalCourse.tenKhoaHoc}</h1>
              
              {/* Course Subtitle */}
              <p className="text-xl text-gray-700 mb-4">{externalCourse.moTa}</p>
              
              {/* Course Meta */}
              <div className="flex flex-wrap items-center mb-6 text-sm gap-4">    
                <div className="flex items-center">
                  <Users className="text-gray-500 mr-1 h-4 w-4" />
                  <span>{externalCourse.soLuongHocVien} học viên</span>
                </div>
                
                <div className="flex items-center">
                  <Eye className="text-gray-500 mr-1 h-4 w-4" />
                  <span>{externalCourse.luotXem} lượt xem</span>
                </div>
                
                <div className="flex items-center">
                  <Calendar className="text-gray-500 mr-1 h-4 w-4" />
                  <span>Ngày tạo: {externalCourse.ngayTao}</span>
                </div>
              </div>
              
              {/* Course Author */}
              <div className="flex items-center mb-6 bg-gray-50 p-4 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">{externalCourse.nguoiTao.hoTen}</h3>
                  <p className="text-sm text-gray-600">{externalCourse.nguoiTao.tenLoaiNguoiDung}</p>
                </div>
              </div>
              
              {/* Course Preview */}
              <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
                <div className="relative aspect-video">
                  <img 
                    src={externalCourse.hinhAnh || '/placeholder-course.jpg'} 
                    alt={externalCourse.tenKhoaHoc} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-white bg-opacity-80 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all cursor-pointer">
                    </div>
                  </div>
                </div>
              </div>
              
              {/* What You'll Learn */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Bạn sẽ học được gì</h2>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex">
                      <Check className="text-green-500 mt-1 mr-3 h-5 w-5 flex-shrink-0" />
                      <p>Làm chủ các kiến thức {externalCourse.danhMucKhoaHoc.tenDanhMucKhoaHoc}</p>
                    </div>
                    <div className="flex">
                      <Check className="text-green-500 mt-1 mr-3 h-5 w-5 flex-shrink-0" />
                      <p>Xây dựng ứng dụng hoàn chỉnh từ đầu đến cuối</p>
                    </div>
                    <div className="flex">
                      <Check className="text-green-500 mt-1 mr-3 h-5 w-5 flex-shrink-0" />
                      <p>Hiểu và áp dụng các kỹ thuật lập trình nâng cao</p>
                    </div>
                    <div className="flex">
                      <Check className="text-green-500 mt-1 mr-3 h-5 w-5 flex-shrink-0" />
                      <p>Ứng dụng ngay vào công việc thực tế</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Description */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Mô tả khóa học</h2>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="prose max-w-none">
                    <p className="mb-4">{externalCourse.moTa}</p>
                    
                    <h3 className="text-xl font-bold mt-6 mb-3">Thông tin khóa học</h3>
                    
                    <ul className="list-disc pl-5 mb-4">
                      <li>Danh mục: {externalCourse.danhMucKhoaHoc.tenDanhMucKhoaHoc}</li>
                      <li>Mã khóa học: {externalCourse.maKhoaHoc}</li>
                      <li>Giảng viên: {externalCourse.nguoiTao.hoTen}</li>
                      <li>Có {externalCourse.soLuongHocVien} học viên đã tham gia</li>
                      <li>Cập nhật mới nhất: {externalCourse.ngayTao}</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* Requirements */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Yêu cầu</h2>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Máy tính kết nối internet</li>
                    <li>Kiến thức nền tảng về lập trình</li>
                    <li>Thái độ học tập nghiêm túc, kiên trì</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Course Sidebar - Right Column */}
            <div className="lg:w-4/12 mt-8 lg:mt-0">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden sticky top-24">
                {/* Course Price Card */}
                <div className="p-6">
                  <div className="text-center mb-6">
                    <h3 className="text-3xl font-bold text-blue-700 mb-1">Miễn phí</h3>
                    <p className="text-gray-600">Truy cập toàn bộ khóa học</p>
                  </div>
                  
                  <Button 
                    onClick={handleEnroll}
                    disabled={isEnrolling}
                    className="w-full mb-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    {isEnrolling ? (
                      <>
                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                        Đang đăng ký...
                      </>
                    ) : (
                      'Đăng Ký Ngay'
                    )}
                  </Button>
                  
                  <div className="text-center text-gray-500 text-sm mb-6">
                    Truy cập đầy đủ mọi lúc
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Check className="text-green-500 mt-0.5 mr-3 h-5 w-5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Chứng chỉ hoàn thành</p>
                        <p className="text-sm text-gray-600">Nhận chứng chỉ sau khi hoàn thành khóa học</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Check className="text-green-500 mt-0.5 mr-3 h-5 w-5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Truy cập không giới hạn</p>
                        <p className="text-sm text-gray-600">Học mọi lúc, mọi nơi trên mọi thiết bị</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Check className="text-green-500 mt-0.5 mr-3 h-5 w-5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Hỗ trợ từ giảng viên</p>
                        <p className="text-sm text-gray-600">Được hỗ trợ khi gặp khó khăn trong bài học</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Course Includes */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <h4 className="font-medium mb-3">Khóa học bao gồm:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm">
                      <Verified className="h-4 w-4 mr-2 text-blue-600" />
                      <span>Bài giảng chất lượng cao</span>
                    </li>
                    <li className="flex items-center text-sm">
                      <Verified className="h-4 w-4 mr-2 text-blue-600" />
                      <span>Bài tập thực hành</span>
                    </li>
                    <li className="flex items-center text-sm">
                      <Verified className="h-4 w-4 mr-2 text-blue-600" />
                      <span>Tài liệu học tập</span>
                    </li>
                    <li className="flex items-center text-sm">
                      <Verified className="h-4 w-4 mr-2 text-blue-600" />
                      <span>Hỗ trợ trọn đời</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Related Courses - To be implemented */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Khóa học liên quan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Placeholder for related courses */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="h-40 bg-gray-200 rounded-t-lg"></div>
                <div className="p-4">
                  <h3 className="font-medium">Khóa học khác</h3>
                  <p className="text-sm text-gray-600">Khám phá thêm các khóa học khác</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Fallback in case neither internal nor external course is loaded
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <h1 className="text-2xl font-bold mb-2">Không thể tải khóa học</h1>
            <p className="text-gray-600 mb-6">Đã xảy ra lỗi khi tải thông tin khóa học. Vui lòng thử lại sau.</p>
            <Link href="/courses">
              <Button>Xem các khóa học khác</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}