import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/layouts/AdminLayout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Link } from "wouter";

const ITEMS_PER_PAGE = 10;

export default function CoursesManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  
  // Fetch courses with filters
  const { data: coursesData, isLoading, refetch } = useQuery({
    queryKey: ['/api/admin/courses', currentPage, ITEMS_PER_PAGE, searchTerm, statusFilter],
  });
  
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    refetch();
  };
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // Handle filter change
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1); // Reset to first page when filter changes
  };
  
  return (
    <AdminLayout title="Quản lý Khóa học">
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Danh sách Khóa học</CardTitle>
              <CardDescription>
                Quản lý tất cả các khóa học trên hệ thống
              </CardDescription>
            </div>
            <Link href="/admin/courses/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Thêm khóa học
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-6">
            <form onSubmit={handleSearch} className="flex w-full md:w-2/3 max-w-sm items-center space-x-2">
              <Input
                placeholder="Tìm kiếm khóa học..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
              <Button type="submit" variant="secondary">
                <Search className="h-4 w-4" />
              </Button>
            </form>
            
            <div className="flex items-center space-x-4">
              <Tabs 
                defaultValue={statusFilter} 
                value={statusFilter} 
                onValueChange={handleStatusFilterChange}
                className="w-[280px]"
              >
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="all">Tất cả</TabsTrigger>
                  <TabsTrigger value="published">Đã xuất bản</TabsTrigger>
                  <TabsTrigger value="draft">Bản nháp</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
          
          <div className="text-center">
            <p>Chức năng đang được phát triển</p>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}