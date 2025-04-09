import React, { useState } from "react";
import { Link } from "wouter";
import { User } from "@shared/schema";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eye, Edit, Lock, Unlock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface UserManagementProps {
  users: User[];
  totalUsers: number;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onRefresh: () => void;
}

export default function UserManagement({
  users,
  totalUsers,
  currentPage,
  itemsPerPage,
  onPageChange,
  onRefresh
}: UserManagementProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<Record<number, boolean>>({});

  const toggleUserActiveStatus = async (userId: number, currentStatus: boolean) => {
    try {
      setIsLoading(prev => ({ ...prev, [userId]: true }));
      
      await apiRequest('PATCH', `/api/admin/users/${userId}/toggle-status`, {
        isActive: !currentStatus
      });
      
      toast({
        title: "Trạng thái người dùng đã được cập nhật",
        description: `Người dùng đã được ${!currentStatus ? 'kích hoạt' : 'khóa'} thành công`,
        variant: "default",
      });
      
      onRefresh();
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể cập nhật trạng thái người dùng",
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  const totalPages = Math.ceil(totalUsers / itemsPerPage);
  const showingStart = ((currentPage - 1) * itemsPerPage) + 1;
  const showingEnd = Math.min(currentPage * itemsPerPage, totalUsers);

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
              <TableHead>Người dùng</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Vai trò</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày đăng ký</TableHead>
              <TableHead>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">#{user.id}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-4">
                      <AvatarImage src={user.avatar || ''} alt={user.username} />
                      <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.fullName || user.username}</div>
                      <div className="text-sm text-gray-500">@{user.username}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.role === 'admin' ? 'secondary' : 'outline'}>
                    {user.role === 'admin' ? 'Admin' : user.role === 'instructor' ? 'Giảng viên' : 'Học viên'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.isActive ? 'default' : 'destructive'}>
                    {user.isActive ? 'Hoạt động' : 'Bị khóa'}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleDateString('vi-VN')}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Link href={`/admin/users/${user.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye size={16} />
                      </Button>
                    </Link>
                    <Link href={`/admin/users/${user.id}/edit`}>
                      <Button variant="ghost" size="sm">
                        <Edit size={16} />
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      disabled={isLoading[user.id]}
                      onClick={() => toggleUserActiveStatus(user.id, user.isActive)}
                    >
                      {user.isActive ? <Lock size={16} /> : <Unlock size={16} />}
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
          Hiển thị {showingStart}-{showingEnd} của {totalUsers} người dùng
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
