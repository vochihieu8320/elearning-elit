import React, { useState } from "react";
import { Link } from "wouter";
import { Course } from "@shared/schema";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eye, Edit, Trash, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface CourseListProps {
  courses: Course[];
  totalCourses: number;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onEdit: (courseId: number) => void;
}

export default function CourseList({
  courses,
  totalCourses,
  currentPage,
  itemsPerPage,
  onPageChange,
  onEdit
}: CourseListProps) {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState<Record<number, boolean>>({});

  // Format price to VND
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + '₫';
  };

  const handleDelete = async (courseId: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa khóa học này không?")) {
      return;
    }

    try {
      setIsDeleting(prev => ({ ...prev, [courseId]: true }));
      
      await apiRequest('DELETE', `/api/courses/${courseId}`, {});
      
      toast({
        title: "Xóa thành công",
        description: "Khóa học đã được xóa thành công",
      });
      
      // Invalidate the courses query to refetch data
      queryClient.invalidateQueries({ queryKey: ['/api/courses'] });
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể xóa khóa học",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(prev => ({ ...prev, [courseId]: false }));
    }
  };

  const totalPages = Math.ceil(totalCourses / itemsPerPage);
  const showingStart = ((currentPage - 1) * itemsPerPage) + 1;
  const showingEnd = Math.min(currentPage * itemsPerPage, totalCourses);
  
  // Generate array of pages to display
  const getDisplayedPages = () => {
    const maxPagesToShow = 5; // Number of page links to show
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;
    
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  return (
    <Card className="shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Khóa học</TableHead>
              <TableHead>Danh mục</TableHead>
              <TableHead>Giá</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Đánh giá</TableHead>
              <TableHead>Học viên</TableHead>
              <TableHead>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course.id}>
                <TableCell className="font-medium">#{course.id}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <img 
                      src={course.thumbnail} 
                      alt={course.title} 
                      className="w-12 h-12 object-cover rounded mr-3" 
                    />
                    <div>
                      <div className="font-medium line-clamp-1">{course.title}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {course.isFeatured && (
                          <Badge variant="secondary" className="mr-1">Nổi bật</Badge>
                        )}
                        {course.isPopular && (
                          <Badge variant="secondary">Phổ biến</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{course.categoryId}</TableCell>
                <TableCell>{formatPrice(course.price)}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {course.isPublished ? (
                      <Badge variant="default">Đã xuất bản</Badge>
                    ) : (
                      <Badge variant="outline">Bản nháp</Badge>
                    )}
                    <br />
                    {course.isApproved ? (
                      <Badge variant="default">Đã duyệt</Badge>
                    ) : (
                      <Badge variant="destructive">Chờ duyệt</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-amber-500 mr-1 fill-current" />
                    <span>{course.averageRating.toFixed(1)}</span>
                    <span className="text-gray-500 text-xs ml-1">({course.totalRatings})</span>
                  </div>
                </TableCell>
                <TableCell>{course.totalStudents}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Link href={`/courses/${course.slug}`}>
                      <Button variant="ghost" size="sm">
                        <Eye size={16} />
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onEdit(course.id)}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      disabled={isDeleting[course.id]}
                      onClick={() => handleDelete(course.id)}
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="px-6 py-4 flex flex-col sm:flex-row justify-between items-center border-t">
        <div className="text-sm text-gray-500 mb-4 sm:mb-0">
          Hiển thị {showingStart}-{showingEnd} của {totalCourses} khóa học
        </div>
        
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            
            {getDisplayedPages().map(page => (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={page === currentPage}
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </Card>
  );
}
