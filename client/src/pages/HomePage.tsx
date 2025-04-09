import React from "react";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/layouts/MainLayout";
import Hero from "@/components/Hero";
import CategorySection from "@/components/CategorySection";
import FeaturedCoursesSection from "@/components/FeaturedCoursesSection";
import PopularCategoriesSection from "@/components/PopularCategoriesSection";
import LatestCoursesSection from "@/components/LatestCoursesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import BecomeInstructorSection from "@/components/BecomeInstructorSection";
import { Category, Course } from "@shared/schema";
import { ExternalCourse } from "@/types/external-course";

export default function HomePage() {
  // Categories are now fetched directly in the CategorySection component

  // Fetch featured courses
  const { data: featuredCourses, isLoading: loadingFeatured } = useQuery<
    Course[]
  >({
    queryKey: ["/api/courses/featured"],
  });

  // Fetch courses from external API and get the top courses by view count
  const { data: externalCourses, isLoading: loadingExternal } = useQuery<
    ExternalCourse[]
  >({
    queryKey: ["external-courses-popular"],
    queryFn: async () => {
      const response = await fetch(
        "https://elearning0706.cybersoft.edu.vn/api/QuanLyKhoaHoc/LayDanhSachKhoaHoc?MaNhom=GP01",
      );
      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }
      const data = await response.json();

      // Sort courses by view count (luotXem) and get the top 5
      return data
        .sort((a: ExternalCourse, b: ExternalCourse) => b.luotXem - a.luotXem)
        .slice(0, 5);
    },
  });

  // Fetch courses from external API and get the newest courses by creation date
  const { data: latestExternalCourses, isLoading: loadingLatestExternal } =
    useQuery<ExternalCourse[]>({
      queryKey: ["external-courses-latest"],
      queryFn: async () => {
        const response = await fetch(
          "https://elearning0706.cybersoft.edu.vn/api/QuanLyKhoaHoc/LayDanhSachKhoaHoc?MaNhom=GP01",
        );
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }
        const data = await response.json();

        // Sort courses by creation date (ngayTao) and get the 3 newest
        return data
          .sort(
            (a: ExternalCourse, b: ExternalCourse) =>
              new Date(b.ngayTao).getTime() - new Date(a.ngayTao).getTime(),
          )
          .slice(0, 5);
      },
    });

  // Fetch testimonials
  const { data: testimonials, isLoading: loadingTestimonials } = useQuery<
    any[]
  >({
    queryKey: ["/api/testimonials"],
    select: (data) => data || [],
  });

  return (
    <MainLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Banner */}
        <Hero />

        {/* Categories Quick Access */}
        <CategorySection />

        {/* Popular Courses from External API */}
        <LatestCoursesSection
          courses={externalCourses || []}
          isLoading={loadingExternal}
        />

        {/* Latest Courses from External API */}
        <FeaturedCoursesSection
          courses={latestExternalCourses || []}
          isLoading={loadingLatestExternal}
          isExternalData={true}
        />

        {/* Testimonials */}
        <TestimonialsSection
          testimonials={testimonials || []}
          isLoading={loadingTestimonials}
        />

        {/* Become an Instructor */}
        <BecomeInstructorSection />
      </div>
    </MainLayout>
  );
}
