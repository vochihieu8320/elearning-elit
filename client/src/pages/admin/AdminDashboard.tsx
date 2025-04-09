import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/layouts/AdminLayout";
import AdminStats from "@/components/AdminStats";
import ChartComponent from "@/components/ChartComponent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function AdminDashboard() {
  const [yearFilter, setYearFilter] = useState("2023");
  
  // Fetch admin dashboard stats
  const { data: statsData, isLoading: loadingStats } = useQuery({
    queryKey: ['/api/admin/stats'],
  });
  
  // Fetch monthly revenue
  const { data: revenueData, isLoading: loadingRevenue } = useQuery({
    queryKey: ['/api/admin/revenue', yearFilter],
  });
  
  // Fetch recent orders
  const { data: recentOrders, isLoading: loadingOrders } = useQuery({
    queryKey: ['/api/admin/orders/recent'],
  });

  // Format price to VND
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + '₫';
  };

  // Default stats values
  const defaultStats = {
    usersCount: 0,
    coursesCount: 0,
    ordersCount: 0,
    revenue: 0,
    usersChange: 0,
    coursesChange: 0,
    ordersChange: 0,
    revenueChange: 0
  };

  // Default revenue data for chart
  const defaultRevenueData = [
    { name: "T1", value: 0 },
    { name: "T2", value: 0 },
    { name: "T3", value: 0 },
    { name: "T4", value: 0 },
    { name: "T5", value: 0 },
    { name: "T6", value: 0 },
    { name: "T7", value: 0 },
    { name: "T8", value: 0 },
    { name: "T9", value: 0 },
    { name: "T10", value: 0 },
    { name: "T11", value: 0 },
    { name: "T12", value: 0 }
  ];

  // Use real data or default placeholders
  const stats = statsData || defaultStats;
  const chartData = revenueData || defaultRevenueData;

  return (
    <AdminLayout title="Dashboard">
      {/* Stats Cards */}
      <AdminStats 
        usersCount={stats.usersCount}
        coursesCount={stats.coursesCount}
        ordersCount={stats.ordersCount}
        revenue={stats.revenue}
        usersChange={stats.usersChange}
        coursesChange={stats.coursesChange}
        ordersChange={stats.ordersChange}
        revenueChange={stats.revenueChange}
      />
      
      {/* Charts & Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Revenue Chart */}
        <ChartComponent
          title="Doanh thu theo tháng"
          data={chartData}
          chartType="bar"
          dataKey="value"
          filter={
            <Select
              value={yearFilter}
              onValueChange={setYearFilter}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Năm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
                <SelectItem value="2021">2021</SelectItem>
              </SelectContent>
            </Select>
          }
        />
        
        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Đơn hàng gần đây</CardTitle>
            <Link href="/admin/orders">
              <Button variant="link" size="sm">Xem tất cả</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {loadingOrders ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse flex justify-between py-3">
                    <div className="w-1/4 h-5 bg-gray-200 rounded"></div>
                    <div className="w-1/4 h-5 bg-gray-200 rounded"></div>
                    <div className="w-1/4 h-5 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã</TableHead>
                      <TableHead>Người dùng</TableHead>
                      <TableHead>Khóa học</TableHead>
                      <TableHead>Giá</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders ? recentOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">#{order.id}</TableCell>
                        <TableCell>
                          {order.user?.username || `User #${order.userId}`}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {order.course?.title || `Course #${order.courseId}`}
                        </TableCell>
                        <TableCell>{formatPrice(order.amount)}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              order.status === 'completed' 
                                ? 'default' 
                                : order.status === 'pending' 
                                ? 'secondary' 
                                : 'destructive'
                            }
                          >
                            {order.status === 'completed' 
                              ? 'Thành công' 
                              : order.status === 'pending' 
                              ? 'Đang xử lý' 
                              : 'Hủy'
                            }
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Link href={`/admin/orders/${order.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye size={16} />
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center">
                          Không có dữ liệu đơn hàng
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Additional Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* User Registration Trend */}
        <ChartComponent
          title="Đăng ký người dùng"
          subtitle="Số lượng người dùng mới theo tháng"
          data={[
            { name: "T1", value: 120 },
            { name: "T2", value: 132 },
            { name: "T3", value: 101 },
            { name: "T4", value: 134 },
            { name: "T5", value: 180 },
            { name: "T6", value: 210 },
            { name: "T7", value: 245 },
            { name: "T8", value: 276 },
            { name: "T9", value: 310 },
            { name: "T10", value: 350 },
            { name: "T11", value: 410 },
            { name: "T12", value: 485 }
          ]}
          chartType="line"
          dataKey="value"
          height={250}
        />
        
        {/* Course Enrollments by Category */}
        <ChartComponent
          title="Đăng ký theo danh mục"
          subtitle="Số lượng đăng ký khóa học theo danh mục"
          data={[
            { name: "Lập trình web", value: 756 },
            { name: "Phát triển di động", value: 532 },
            { name: "Marketing", value: 428 },
            { name: "Thiết kế", value: 310 },
            { name: "Kinh doanh", value: 275 }
          ]}
          chartType="bar"
          dataKey="value"
          height={250}
        />
      </div>
    </AdminLayout>
  );
}
