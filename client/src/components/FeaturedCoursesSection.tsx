import React from "react";
import { Link } from "wouter";
import { Course } from "@shared/schema";
import CourseCard from "@/components/CourseCard";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalCourse } from "@/types/external-course";

interface FeaturedCoursesSectionProps {
  courses: Course[] | ExternalCourse[];
  isLoading: boolean;
  isExternalData?: boolean;
}

export default function FeaturedCoursesSection({
  courses,
  isLoading,
  isExternalData = false,
}: FeaturedCoursesSectionProps) {
  if (isLoading) {
    return (
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Khóa học nổi bật</h2>
          <div className="h-4 w-20 bg-gray-200 rounded"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200"
            >
              <Skeleton className="w-full h-48" />
              <div className="p-5">
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-1/3 mb-4" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-6 w-1/5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (courses.length === 0) {
    return null;
  }

  return (
    <section className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Khóa học mới nhất</h2>
        <Link href="/courses">
          <a className="text-blue-800 hover:underline font-medium">
            Xem tất cả
          </a>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isExternalData
          ? (courses as ExternalCourse[]).map((course) => (
              <CourseCard
                key={course.maKhoaHoc}
                id={parseInt(course.maKhoaHoc)}
                title={course.tenKhoaHoc}
                slug={course.maKhoaHoc}
                instructor={course.nguoiTao.hoTen}
                thumbnail={course.hinhAnh}
                rating={4.5} // Default rating for external courses
                reviewsCount={10} // Default reviews count for external courses
                price={499000}
                badges={[
                  ...(new Date(course.ngayTao) >
                  new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                    ? ["new"]
                    : []),
                ]}
              />
            ))
          : (courses as Course[]).map((course) => (
              <CourseCard
                key={course.id}
                id={course.id}
                title={course.title}
                slug={course.maKhoaHoc}
                instructor="Nguyễn Văn A" // In a real app, this would come from the instructor data
                thumbnail={course.thumbnail}
                rating={course.averageRating}
                reviewsCount={course.totalRatings}
                price={course.price}
                originalPrice={course.originalPrice || undefined}
                badges={[
                  ...(course.isFeatured ? ["bestseller"] : []),
                  ...(course.isPopular ? ["hot"] : []),
                ]}
              />
            ))}
      </div>
    </section>
  );
}
