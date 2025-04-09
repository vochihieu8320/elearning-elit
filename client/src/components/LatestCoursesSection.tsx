import React from "react";
import { Link } from "wouter";
import CourseCard from "@/components/CourseCard";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalCourse } from "@/types/external-course";

interface LatestCoursesSectionProps {
  courses: ExternalCourse[];
  isLoading: boolean;
}

export default function LatestCoursesSection({
  courses,
  isLoading,
}: LatestCoursesSectionProps) {
  if (isLoading) {
    return (
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Khóa học mới nhất</h2>
          <div className="h-4 w-20 bg-gray-200 rounded"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200"
            >
              <Skeleton className="w-full h-40" />
              <div className="p-4">
                <Skeleton className="h-5 w-full mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-1/3 mb-4" />
                <Skeleton className="h-5 w-1/3" />
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
        <h2 className="text-2xl font-bold">Khóa học phổ biến nhất</h2>
        <Link
          href="/courses"
          className="text-blue-800 hover:underline font-medium"
        >
          Xem tất cả
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {courses.map((course) => (
          <CourseCard
            key={course.maKhoaHoc}
            id={parseInt(course.maKhoaHoc, 10)}
            title={course.tenKhoaHoc}
            slug={course.maKhoaHoc}
            instructor={course.nguoiTao.hoTen}
            thumbnail={course.hinhAnh || "https://via.placeholder.com/300x200"}
            rating={4.5} // Default rating since API doesn't provide ratings
            reviewsCount={course.luotXem} // Using view count as review count
            price={0} // Default price since API doesn't provide price
            originalPrice={undefined}
          />
        ))}
      </div>
    </section>
  );
}
