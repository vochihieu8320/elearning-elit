import React from "react";
import { Link } from "wouter";

export default function PopularCategoriesSection() {
  const popularCategories = [
    {
      title: "Lập trình Web",
      icon: "code",
      description: "HTML, CSS, JavaScript, React, Angular, Node.js và nhiều kỹ năng hơn để phát triển web chuyên nghiệp.",
      slug: "lap-trinh-web",
      count: 123
    },
    {
      title: "Phát triển di động",
      icon: "mobile-alt",
      description: "Android, iOS, React Native, Flutter và các công nghệ hiện đại khác để xây dựng ứng dụng di động.",
      slug: "phat-trien-di-dong",
      count: 87
    },
    {
      title: "Digital Marketing",
      icon: "chart-line",
      description: "SEO, Google Ads, Facebook Ads, Email Marketing và chiến lược tiếp thị số toàn diện.",
      slug: "marketing",
      count: 95
    }
  ];

  return (
    <section className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Danh mục phổ biến</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {popularCategories.map((category, index) => (
          <Link key={index} href={`/courses?category=${category.slug}`}>
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center mb-4">
                <i className={`fas fa-${category.icon} text-blue-800 text-2xl mr-4`}></i>
                <h3 className="text-xl font-semibold">{category.title}</h3>
              </div>
              <p className="text-gray-600 mb-4">{category.description}</p>
              <span className="text-sm text-gray-500">{category.count} khóa học</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
