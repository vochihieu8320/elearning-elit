import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import MainLayout from "@/layouts/MainLayout";
import { ExternalCategory } from "@/types/external-category";
import CourseCard from "@/components/CourseCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious,
  PaginationEllipsis 
} from "@/components/ui/pagination";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Define the shape of the paginated API response
interface PaginatedCoursesResponse {
  currentPage: number;
  count: number;
  totalPages: number;
  totalCount: number;
  items: Array<{
    maKhoaHoc: string;
    biDanh: string;
    tenKhoaHoc: string;
    moTa: string;
    luotXem: number;
    hinhAnh: string;
    maNhom: string;
    ngayTao: string;
    soLuongHocVien: number;
    nguoiTao: {
      taiKhoan: string;
      hoTen: string;
      maLoaiNguoiDung: string;
      tenLoaiNguoiDung: string;
    };
    danhMucKhoaHoc: {
      maDanhMucKhoahoc: string;
      tenDanhMucKhoaHoc: string;
    };
  }>;
}

export default function CoursesPage() {
  const [location, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10); // Number of courses per page
  const [selectedCategory, setSelectedCategory] = useState("");

  // Parse URL params on initial load
  useEffect(() => {
    const params = new URLSearchParams(location.split("?")[1]);
    const search = params.get("search");
    const page = params.get("page");
    const category = params.get("category");
    
    if (search) {
      setSearchTerm(search);
    }
    
    if (page) {
      setCurrentPage(parseInt(page));
    }
    
    if (category) {
      setSelectedCategory(category);
    }
  }, [location]);

  // Fetch all categories
  const { data: categories, isLoading: categoriesLoading } = useQuery<ExternalCategory[]>({
    queryKey: ['all-categories'],
    queryFn: async () => {
      const response = await fetch('https://elearning0706.cybersoft.edu.vn/api/QuanLyKhoaHoc/LayDanhMucKhoaHoc');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      return await response.json();
    },
  });

  // Fetch courses with search and pagination
  const { 
    data: coursesResponse, 
    isLoading: coursesLoading, 
    error: coursesError
  } = useQuery<PaginatedCoursesResponse>({
    queryKey: ['search-courses', searchTerm, currentPage, pageSize, selectedCategory],
    queryFn: async () => {
      // Build the URL based on whether we're searching or filtering by category
      let url;
      if (searchTerm) {
        url = `https://elearning0706.cybersoft.edu.vn/api/QuanLyKhoaHoc/LayDanhSachKhoaHoc_PhanTrang?tenKhoaHoc=${searchTerm}&page=${currentPage}&pageSize=${pageSize}&MaNhom=GP01`;
      } else if (selectedCategory) {
        url = `https://elearning0706.cybersoft.edu.vn/api/QuanLyKhoaHoc/LayKhoaHocTheoDanhMuc?maDanhMuc=${selectedCategory}&MaNhom=GP01`;
      } else {
        url = `https://elearning0706.cybersoft.edu.vn/api/QuanLyKhoaHoc/LayDanhSachKhoaHoc_PhanTrang?page=${currentPage}&pageSize=${pageSize}&MaNhom=GP01`;
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }
      
      // For category filtering, we need to transform the response to match our pagination structure
      if (selectedCategory && !searchTerm) {
        const courses = await response.json();
        // Create a paginated structure manually since the category endpoint doesn't paginate
        const startIndex = (currentPage - 1) * pageSize;
        const paginatedItems = courses.slice(startIndex, startIndex + pageSize);
        
        return {
          currentPage: currentPage,
          count: paginatedItems.length,
          totalPages: Math.ceil(courses.length / pageSize),
          totalCount: courses.length,
          items: paginatedItems
        };
      }
      
      return await response.json();
    },
    enabled: true // Always fetch some courses
  });

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
    setSelectedCategory(""); // Clear category filter when searching
    
    // Update URL with search params
    const searchParams = new URLSearchParams();
    if (searchTerm) {
      searchParams.set("search", searchTerm);
    }
    setLocation(`/courses${searchTerm ? `?${searchParams.toString()}` : ''}`);
  };

  // Handle category selection
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1); // Reset to first page on category change
    setSearchTerm(""); // Clear search term when changing category
    
    // Update URL with category param
    setLocation(`/courses?category=${categoryId}`);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    
    // Update URL with page number
    const searchParams = new URLSearchParams();
    if (searchTerm) {
      searchParams.set("search", searchTerm);
    }
    if (selectedCategory) {
      searchParams.set("category", selectedCategory);
    }
    searchParams.set("page", page.toString());
    setLocation(`/courses?${searchParams.toString()}`);
    
    // Scroll to top of the page
    window.scrollTo(0, 0);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setCurrentPage(1);
    setLocation("/courses");
  };

  // Get total pages from API response or default to 1
  const totalPages = coursesResponse?.totalPages || 1;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Tìm kiếm khóa học</h1>
          <p className="text-muted-foreground mt-2">
            Khám phá các khóa học phù hợp với nhu cầu học tập của bạn
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-8">
          {/* Left Sidebar with Category Filter */}
          <div className="md:w-1/4">
            <Card className="p-4">
              <h3 className="font-medium text-lg mb-4">Danh mục</h3>
              
              {categoriesLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-6 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  <div 
                    className={`px-2 py-1 rounded cursor-pointer hover:bg-gray-100 ${!selectedCategory ? 'bg-primary/10 font-medium text-primary' : ''}`}
                    onClick={() => clearFilters()}
                  >
                    Tất cả khóa học
                  </div>
                  
                  {categories?.map((category) => (
                    <div 
                      key={category.maDanhMuc} 
                      className={`px-2 py-1 rounded cursor-pointer hover:bg-gray-100 ${selectedCategory === category.maDanhMuc ? 'bg-primary/10 font-medium text-primary' : ''}`}
                      onClick={() => handleCategoryChange(category.maDanhMuc)}
                    >
                      {category.tenDanhMuc}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Main Content */}
          <div className="md:w-3/4">
            {/* Search Form */}
            <div className="mb-6">
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Tìm kiếm khóa học..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button type="submit">Tìm kiếm</Button>
              </form>
            </div>

            {/* Results Info */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">
                {selectedCategory && categories ? 
                  categories.find(c => c.maDanhMuc === selectedCategory)?.tenDanhMuc : 
                  searchTerm ? `Kết quả tìm kiếm cho "${searchTerm}"` : 'Tất cả khóa học'}
              </h2>
              <p className="text-muted-foreground">
                {coursesResponse ? `Tìm thấy ${coursesResponse.totalCount} khóa học` : ''}
              </p>
            </div>

            {/* Course Listing */}
            {coursesError ? (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Lỗi</AlertTitle>
                <AlertDescription>
                  Không thể tải khóa học. Vui lòng thử lại sau.
                </AlertDescription>
              </Alert>
            ) : coursesLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-card rounded-lg shadow-sm p-4">
                    <Skeleton className="h-40 w-full rounded-md mb-4" />
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                ))}
              </div>
            ) : coursesResponse && coursesResponse.items.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {coursesResponse.items.map((course) => (
                    <CourseCard
                      key={course.maKhoaHoc}
                      id={0} // Not used with external courses
                      title={course.tenKhoaHoc}
                      slug={course.maKhoaHoc}
                      instructor={course.nguoiTao?.hoTen || 'Unknown Instructor'}
                      thumbnail={course.hinhAnh || '/placeholder-course.jpg'}
                      rating={4.5} // Not provided by API
                      reviewsCount={10} // Not provided by API
                      price={0} // Not provided by API
                      badges={[`${course.luotXem || 0} views`, course.danhMucKhoaHoc?.tenDanhMucKhoaHoc || '']}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination className="mt-8">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: totalPages }).map((_, index) => {
                        const pageNumber = index + 1;
                        
                        // Show first page, last page, and 1 page before and after current page
                        if (
                          pageNumber === 1 ||
                          pageNumber === totalPages ||
                          (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                        ) {
                          return (
                            <PaginationItem key={pageNumber}>
                              <PaginationLink
                                onClick={() => handlePageChange(pageNumber)}
                                isActive={currentPage === pageNumber}
                              >
                                {pageNumber}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        }
                        
                        // Show ellipsis
                        if (
                          (pageNumber === 2 && currentPage > 3) ||
                          (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
                        ) {
                          return (
                            <PaginationItem key={pageNumber}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                        }
                        
                        return null;
                      })}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </>
            ) : (
              <div className="text-center py-8 bg-card rounded-lg">
                <h3 className="text-lg font-medium mb-2">Không tìm thấy khóa học</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm 
                    ? 'Không có khóa học nào phù hợp với từ khóa tìm kiếm.' 
                    : selectedCategory 
                      ? 'Không có khóa học nào trong danh mục này.'
                      : 'Không tìm thấy khóa học nào.'
                  }
                </p>
                <Button variant="outline" onClick={clearFilters}>
                  Xem tất cả khóa học
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
