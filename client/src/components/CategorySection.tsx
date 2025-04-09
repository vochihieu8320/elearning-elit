import React from "react";
import { useQuery } from "@tanstack/react-query";
import CategoryCard from "@/components/CategoryCard";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalCategory } from "@/types/external-category";

interface CategorySectionProps {
  isLoading?: boolean;
}

export default function CategorySection({ isLoading: propIsLoading }: CategorySectionProps) {
  // Map the API category IDs to our icon keys
  const getCategoryIcon = (categoryId: string): string => {
    const iconMapping: Record<string, string> = {
      'BackEnd': 'development',
      'Design': 'art',
      'DiDong': 'development',
      'FrontEnd': 'development',
      'FullStack': 'development',
      'TuDuy': 'academics'
    };
    
    return iconMapping[categoryId] || 'academics';
  };

  // Fetch categories from external API
  const { data: externalCategories, isLoading: loadingExternalCategories } = useQuery<ExternalCategory[]>({
    queryKey: ['external-categories'],
    queryFn: async () => {
      const response = await fetch('https://elearning0706.cybersoft.edu.vn/api/QuanLyKhoaHoc/LayDanhMucKhoaHoc');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      return await response.json();
    },
  });

  // Determine if loading from props or from query
  const isLoading = propIsLoading || loadingExternalCategories;
  
  return (
    <section className="py-12 bg-muted/50">
      <div className="container">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Browse Categories</h2>
          <p className="text-muted-foreground mt-2">
            Explore our diverse range of course categories to find exactly what you're looking for
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-card rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <Skeleton className="h-12 w-12 rounded-full mr-4" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {externalCategories?.map((category) => (
              <CategoryCard
                key={category.maDanhMuc}
                name={category.tenDanhMuc}
                slug={category.maDanhMuc}
                icon={getCategoryIcon(category.maDanhMuc)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}