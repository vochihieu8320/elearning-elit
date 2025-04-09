import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useLocation } from 'wouter';
import MainLayout from '@/layouts/MainLayout';
import { ExternalCourse } from '@/types/external-course';
import { ExternalCategory } from '@/types/external-category';
import { Skeleton } from '@/components/ui/skeleton';
import CourseCard from '@/components/CourseCard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function CourseCategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [location, setLocation] = useLocation();
  const [categoryName, setCategoryName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryId || '');
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 8;

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

  // Fetch courses for this category
  const { data: allCourses, isLoading: coursesLoading, error } = useQuery<ExternalCourse[]>({
    queryKey: ['category-courses', selectedCategory],
    queryFn: async () => {
      const response = await fetch(`https://elearning0706.cybersoft.edu.vn/api/QuanLyKhoaHoc/LayKhoaHocTheoDanhMuc?maDanhMuc=${selectedCategory}&MaNhom=GP01`);
      if (!response.ok) {
        throw new Error('Failed to fetch courses for this category');
      }
      return await response.json();
    },
    enabled: !!selectedCategory,
  });

  // Set category name when categories are loaded
  useEffect(() => {
    if (categories) {
      const category = categories.find(cat => cat.maDanhMuc === selectedCategory);
      if (category) {
        setCategoryName(category.tenDanhMuc);
      }
    }
  }, [categories, selectedCategory]);

  // Update URL when category changes
  useEffect(() => {
    if (selectedCategory && selectedCategory !== categoryId) {
      setLocation(`/courses/category/${selectedCategory}`);
    }
  }, [selectedCategory, categoryId, setLocation]);

  // Filter courses by search term
  const filteredCourses = allCourses ? allCourses.filter(course => {
    const courseTitle = course.tenKhoaHoc?.toLowerCase() || '';
    const instructorName = course.nguoiTao?.hoTen?.toLowerCase() || '';
    const searchTermLower = searchTerm.toLowerCase();
    
    return courseTitle.includes(searchTermLower) || instructorName.includes(searchTermLower);
  }) : [];

  // Pagination logic
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  // Handle category change
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  };

  // Handle search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{categoryName || 'Category'} Courses</h1>
          <p className="text-muted-foreground mt-2">
            Explore the best courses in the {categoryName || 'selected'} category
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-8">
          {/* Left Sidebar with Category Filter */}
          <div className="md:w-1/4">
            <Card className="p-4">
              <h3 className="font-medium text-lg mb-4">Categories</h3>
              
              {categoriesLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-6 w-full" />
                  ))}
                </div>
              ) : (
                <RadioGroup 
                  value={selectedCategory} 
                  onValueChange={handleCategoryChange}
                  className="space-y-2"
                >
                  {categories?.map((category) => (
                    <div key={category.maDanhMuc} className="flex items-center space-x-2">
                      <RadioGroupItem value={category.maDanhMuc} id={`category-${category.maDanhMuc}`} />
                      <Label 
                        htmlFor={`category-${category.maDanhMuc}`}
                        className="cursor-pointer"
                      >
                        {category.tenDanhMuc}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            </Card>
          </div>

          {/* Main Content */}
          <div className="md:w-3/4">
            {/* Search Input */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search courses..."
                className="pl-10"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>

            {/* Course Listing */}
            {error ? (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  Failed to load courses. Please try again later.
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
            ) : currentCourses.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {currentCourses.map((course) => (
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
                <h3 className="text-lg font-medium mb-2">No courses found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm ? 'No matches for your search term.' : 'There are no courses available in this category yet.'}
                </p>
                {searchTerm && (
                  <Button variant="outline" onClick={() => setSearchTerm('')}>
                    Clear Search
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}