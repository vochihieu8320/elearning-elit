import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/layouts/AdminLayout";
import UserManagement from "@/components/UserManagement";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "@shared/schema";
import { Search, UserPlus } from "lucide-react";

export default function UsersManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const itemsPerPage = 10;

  // Fetch users with pagination
  const {
    data: usersData,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['/api/admin/users', currentPage, itemsPerPage, searchQuery, roleFilter, statusFilter],
  });

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
    refetch();
  };

  // Handle role filter change
  const handleRoleFilterChange = (value: string) => {
    setRoleFilter(value);
    setCurrentPage(1); // Reset to first page on filter change
    refetch();
  };

  // Handle status filter change
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1); // Reset to first page on filter change
    refetch();
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    refetch();
  };

  return (
    <AdminLayout title="Quản lý người dùng">
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Người dùng</CardTitle>
              <CardDescription>
                Quản lý tất cả người dùng trong hệ thống
              </CardDescription>
            </div>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Thêm người dùng
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <form onSubmit={handleSearch} className="flex flex-1 gap-2">
                <div className="relative flex-grow">
                  <Input
                    type="text"
                    placeholder="Tìm kiếm theo tên, email, username..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
                <Button type="submit">Tìm kiếm</Button>
              </form>
              
              <div className="flex gap-2">
                <Tabs 
                  defaultValue={roleFilter} 
                  value={roleFilter} 
                  onValueChange={handleRoleFilterChange}
                  className="w-[180px]"
                >
                  <TabsList className="grid grid-cols-3">
                    <TabsTrigger value="all">Tất cả</TabsTrigger>
                    <TabsTrigger value="student">Học viên</TabsTrigger>
                    <TabsTrigger value="admin">Admin</TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <Tabs 
                  defaultValue={statusFilter} 
                  value={statusFilter} 
                  onValueChange={handleStatusFilterChange}
                  className="w-[180px]"
                >
                  <TabsList className="grid grid-cols-2">
                    <TabsTrigger value="all">Tất cả</TabsTrigger>
                    <TabsTrigger value="active">Hoạt động</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
            
            <UserManagement
              users={usersData?.users || []}
              totalUsers={usersData?.total || 0}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onRefresh={refetch}
            />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
