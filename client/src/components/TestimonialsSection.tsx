import React from "react";
import TestimonialCard from "@/components/TestimonialCard";
import { Skeleton } from "@/components/ui/skeleton";

interface TestimonialsSectionProps {
  testimonials: any[];
  isLoading: boolean;
}

export default function TestimonialsSection({ testimonials, isLoading }: TestimonialsSectionProps) {
  if (isLoading) {
    return (
      <section className="mb-12 bg-gray-50 rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-8 text-center">Học viên nói gì về chúng tôi</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex mb-4">
                <Skeleton className="h-4 w-4 mr-1" />
                <Skeleton className="h-4 w-4 mr-1" />
                <Skeleton className="h-4 w-4 mr-1" />
                <Skeleton className="h-4 w-4 mr-1" />
                <Skeleton className="h-4 w-4" />
              </div>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-6" />
              <div className="flex items-center">
                <Skeleton className="w-10 h-10 rounded-full mr-4" />
                <div>
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="mb-12 bg-gray-50 rounded-xl p-8">
      <h2 className="text-2xl font-bold mb-8 text-center">Học viên nói gì về chúng tôi</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard
            key={index}
            content={testimonial.content}
            avatarUrl={testimonial.avatarUrl}
            name={testimonial.name}
            role={testimonial.role}
            rating={testimonial.rating}
          />
        ))}
      </div>
    </section>
  );
}
