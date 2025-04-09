import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import AdminLayout from "@/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

// Define the course type
interface Course {
  id: number;
  title: string;
  description: string;
  slug: string;
  price: number;
  // Add other course properties as needed
}

export default function CourseEdit() {
  const [, params] = useRoute("/admin/courses/:id/edit");
  const courseId = params?.id;
  
  // Fetch course data if ID is available
  const { data: course, isLoading } = useQuery<Course | null>({
    queryKey: ['/api/courses', courseId],
    enabled: !!courseId && courseId !== "new",
  });
  
  if (isLoading) {
    return (
      <AdminLayout title="Chỉnh sửa khóa học">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout title="Chỉnh sửa khóa học">
      <div className="flex items-center mb-6">
        <Link href="/admin/courses">
          <Button variant="ghost" className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Trở lại
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">
          {courseId === "new" ? "Thêm khóa học mới" : `Chỉnh sửa: ${course && course.title ? course.title : ''}`}
        </h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Chi tiết khóa học</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <p>Chức năng đang được phát triển</p>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}