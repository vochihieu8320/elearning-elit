import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/layouts/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Enrollment, Review, Order } from "@shared/schema";
import { Calendar, Clock, GraduationCap, BookOpen, Star, DollarSign, BarChart, ExternalLink } from "lucide-react";

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();

  // Fetch user's enrollments
  const { data: enrollments, isLoading: loadingEnrollments } = useQuery<Enrollment[]>({
    queryKey: ['/api/enrollments/my'],
    enabled: isAuthenticated,
  });

  // Fetch user's recent progress
  const { data: recentProgress, isLoading: loadingProgress } = useQuery({
    queryKey: ['/api/progress/recent'],
    enabled: isAuthenticated,
  });

  // Fetch user's reviews
  const { data: userReviews, isLoading: loadingReviews } = useQuery<Review[]>({
    queryKey: ['/api/reviews/my'],
    enabled: isAuthenticated,
  });

  // Fetch user's orders
  const { data: orders, isLoading: loadingOrders } = useQuery<Order[]>({
    queryKey: ['/api/orders/my'],
    enabled: isAuthenticated,
  });

  // Calculate dashboard stats
  const completedCourses = enrollments?.filter(e => e.completed).length || 0;
  const inProgressCourses = enrollments?.filter(e => e.progress > 0 && !e.completed).length || 0;
  const totalCourses = enrollments?.length || 0;
  const totalSpent = orders?.reduce((total, order) => total + order.amount, 0) || 0;

  // Format price to VND
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + '₫';
  };

  if (!isAuthenticated) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <h1 className="text-2xl font-bold mb-2">Bạn chưa đăng nhập</h1>
              <p className="text-gray-600 mb-6">Vui lòng đăng nhập để xem bảng điều khiển của bạn</p>
              <Link href="/login">
                <Button>Đăng nhập</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Bảng điều khiển</h1>
          <p className="text-gray-600">
            Xin chào, {user?.fullName || user?.username}! Dưới đây là tổng quan về hoạt động học tập của bạn.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <BookOpen className="h-6 w-6 text-blue-700" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Khóa học đã đăng ký</p>
                  <h3 className="text-2xl font-bold">{totalCourses}</h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <GraduationCap className="h-6 w-6 text-green-700" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Khóa học đã hoàn thành</p>
                  <h3 className="text-2xl font-bold">{completedCourses}</h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-amber-100 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-amber-700" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Đang học</p>
                  <h3 className="text-2xl font-bold">{inProgressCourses}</h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <DollarSign className="h-6 w-6 text-purple-700" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tổng chi tiêu</p>
                  <h3 className="text-2xl font-bold">{formatPrice(totalSpent)}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="progress">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="progress">Tiến độ gần đây</TabsTrigger>
                <TabsTrigger value="enrollments">Khóa học của tôi</TabsTrigger>
                <TabsTrigger value="reviews">Đánh giá của tôi</TabsTrigger>
              </TabsList>
              
              <TabsContent value="progress">
                <Card>
                  <CardHeader>
                    <CardTitle>Tiến độ học tập gần đây</CardTitle>
                    <CardDescription>
                      Các bài học bạn đã xem trong 7 ngày qua
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loadingProgress ? (
                      <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="animate-pulse">
                            <div className="h-5 bg-gray-200 rounded w-1/2 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                            <div className="h-2 bg-gray-200 rounded mb-2"></div>
                          </div>
                        ))}
                      </div>
                    ) : recentProgress && recentProgress.length > 0 ? (
                      <div className="space-y-4">
                        {recentProgress.map((progress, index) => (
                          <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                            <div className="flex justify-between items-start mb-1">
                              <h4 className="font-medium">{progress.lesson.title}</h4>
                              <span className="text-xs text-gray-500">{new Date(progress.lastWatched).toLocaleDateString('vi-VN')}</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{progress.course.title}</p>
                            <div className="flex justify-between text-xs mb-1">
                              <span>Tiến độ</span>
                              <span>{Math.round((progress.watchedSeconds / progress.lesson.duration) * 100)}%</span>
                            </div>
                            <Progress value={Math.round((progress.watchedSeconds / progress.lesson.duration) * 100)} className="h-1" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-gray-500 mb-4">Không có hoạt động học tập nào trong 7 ngày qua</p>
                        <Link href="/my-courses">
                          <Button>
                            Đi đến khóa học của tôi
                            <ExternalLink className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="enrollments">
                <Card>
                  <CardHeader>
                    <CardTitle>Khóa học đã đăng ký</CardTitle>
                    <CardDescription>
                      Danh sách khóa học bạn đã đăng ký
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loadingEnrollments ? (
                      <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="animate-pulse">
                            <div className="h-5 bg-gray-200 rounded w-1/2 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                            <div className="h-2 bg-gray-200 rounded mb-2"></div>
                          </div>
                        ))}
                      </div>
                    ) : enrollments && enrollments.length > 0 ? (
                      <div className="space-y-4">
                        {enrollments.slice(0, 5).map(enrollment => (
                          <div key={enrollment.id} className="border-b pb-4 last:border-0 last:pb-0">
                            <div className="flex items-start gap-3">
                              <img 
                                src={enrollment.course?.thumbnail || "https://via.placeholder.com/80"} 
                                alt={enrollment.course?.title} 
                                className="w-16 h-12 object-cover rounded"
                              />
                              <div className="flex-1">
                                <h4 className="font-medium mb-1">{enrollment.course?.title}</h4>
                                <div className="flex justify-between text-xs mb-1">
                                  <span>Tiến độ</span>
                                  <span>{enrollment.progress}%</span>
                                </div>
                                <Progress value={enrollment.progress} className="h-1" />
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {enrollments.length > 5 && (
                          <div className="text-center">
                            <Link href="/my-courses">
                              <Button variant="outline">
                                Xem tất cả ({enrollments.length} khóa học)
                              </Button>
                            </Link>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-gray-500 mb-4">Bạn chưa đăng ký khóa học nào</p>
                        <Link href="/courses">
                          <Button>
                            Khám phá khóa học
                            <ExternalLink className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reviews">
                <Card>
                  <CardHeader>
                    <CardTitle>Đánh giá của tôi</CardTitle>
                    <CardDescription>
                      Các đánh giá bạn đã để lại cho khóa học
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loadingReviews ? (
                      <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="animate-pulse">
                            <div className="h-5 bg-gray-200 rounded w-1/2 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                          </div>
                        ))}
                      </div>
                    ) : userReviews && userReviews.length > 0 ? (
                      <div className="space-y-4">
                        {userReviews.map(review => (
                          <div key={review.id} className="border-b pb-4 last:border-0 last:pb-0">
                            <div className="flex justify-between mb-1">
                              <h4 className="font-medium">{review.course?.title}</h4>
                              <div className="flex items-center">
                                <span className="text-amber-500 font-bold mr-1">{review.rating}</span>
                                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                              </div>
                            </div>
                            <p className="text-sm text-gray-600">{review.content}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-gray-500">Bạn chưa đánh giá khóa học nào</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Side Section - Learning Stats & Orders */}
          <div className="space-y-6">
            {/* Learning Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Thống kê học tập</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Tiến độ tổng thể</span>
                      <span>
                        {totalCourses > 0 
                          ? Math.round((enrollments?.reduce((sum, e) => sum + e.progress, 0) || 0) / totalCourses) 
                          : 0}%
                      </span>
                    </div>
                    <Progress 
                      value={totalCourses > 0 
                        ? Math.round((enrollments?.reduce((sum, e) => sum + e.progress, 0) || 0) / totalCourses) 
                        : 0} 
                      className="h-2" 
                    />
                  </div>
                  
                  <div className="pt-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-3 rounded-lg text-center">
                        <p className="text-xs text-gray-600 mb-1">Tổng giờ học</p>
                        <p className="text-lg font-bold">12h 30m</p>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg text-center">
                        <p className="text-xs text-gray-600 mb-1">Ngày liên tiếp</p>
                        <p className="text-lg font-bold">5 ngày</p>
                      </div>
                      <div className="bg-amber-50 p-3 rounded-lg text-center">
                        <p className="text-xs text-gray-600 mb-1">Bài học hoàn thành</p>
                        <p className="text-lg font-bold">48</p>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg text-center">
                        <p className="text-xs text-gray-600 mb-1">Chứng chỉ</p>
                        <p className="text-lg font-bold">{completedCourses}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Đơn hàng gần đây</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingOrders ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-5 bg-gray-200 rounded w-1/2 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                      </div>
                    ))}
                  </div>
                ) : orders && orders.length > 0 ? (
                  <div className="space-y-3">
                    {orders.slice(0, 5).map(order => (
                      <div key={order.id} className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0">
                        <div>
                          <h4 className="font-medium text-sm">{order.course?.title || `Khóa học #${order.courseId}`}</h4>
                          <p className="text-xs text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                        <div>
                          <p className="font-semibold">{formatPrice(order.amount)}</p>
                          <p className={`text-xs ${order.status === 'completed' ? 'text-green-600' : 'text-amber-600'}`}>
                            {order.status === 'completed' ? 'Hoàn thành' : 'Đang xử lý'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500">Bạn chưa có đơn hàng nào</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
