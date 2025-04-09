import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { Star, Clock, Users, BookOpen, Eye, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface CourseCardProps {
  id: number;
  title: string;
  slug: string;
  instructor: string;
  thumbnail: string;
  rating: number;
  reviewsCount: number;
  price: number;
  originalPrice?: number;
  badges?: string[];
  maKhoaHoc?: string; // External course ID for API calls
}

export default function CourseCard({
  id,
  title,
  slug,
  instructor,
  thumbnail,
  rating,
  reviewsCount,
  price,
  originalPrice,
  badges = [],
  maKhoaHoc = "",
}: CourseCardProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [location, setLocation] = useLocation();
  const [isRegistering, setIsRegistering] = useState(false);

  // Calculate the discount percentage
  const discountPercentage = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  // Format price
  const formattedPrice =
    price === 0
      ? "Free"
      : new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(price);

  const formattedOriginalPrice = originalPrice
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(originalPrice)
    : null;

  // Handle course registration
  const handleRegister = async () => {
    try {
      // If user is not logged in, redirect to auth page
      if (!user) {
        toast({
          title: "Chưa đăng nhập",
          description: "Vui lòng đăng nhập để đăng ký khóa học",
          variant: "destructive",
        });
        setLocation("/auth");
        return;
      }

      setIsRegistering(true);

      // Get access token from localStorage
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        toast({
          title: "Lỗi xác thực",
          description: "Vui lòng đăng nhập lại để tiếp tục",
          variant: "destructive",
        });
        setLocation("/auth");
        return;
      }

      // Get current user info from localStorage
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

      // Create payload for API call
      const payload = {
        maKhoaHoc: maKhoaHoc || slug, // Use maKhoaHoc if available, fallback to slug
        taiKhoan: currentUser.taiKhoan,
      };

      // Call API to register for the course
      const response = await fetch(
        "https://elearning0706.cybersoft.edu.vn/api/QuanLyKhoaHoc/DangKyKhoaHoc",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      // Display success message
      toast({
        title: "Đăng ký thành công",
        description: `Bạn đã đăng ký khóa học "${title}" thành công`,
      });

      // Redirect to My Courses page
      setLocation("/my-courses");
    } catch (error: any) {
      // If error message contains "đã đăng ký", it means user already registered
      if (error.message && error.message.includes("đã đăng ký")) {
        toast({
          title: "Thông báo",
          description: "Bạn đã đăng ký khóa học này rồi",
        });
        setLocation("/my-courses");
      } else {
        toast({
          title: "Lỗi",
          description: error.message || "Đã xảy ra lỗi khi đăng ký khóa học",
          variant: "destructive",
        });
      }
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <Card className="overflow-hidden h-full transition-all hover:shadow-md flex flex-col">
      <div className="relative">
        <Link href={`/course/${slug}`}>
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-48 object-cover cursor-pointer"
          />
        </Link>
        {discountPercentage > 0 && (
          <Badge variant="destructive" className="absolute top-3 right-3">
            {discountPercentage}% OFF
          </Badge>
        )}
        {badges.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {badges.map((badge, index) => (
              <Badge key={index} variant="secondary">
                {badge}
              </Badge>
            ))}
          </div>
        )}
      </div>
      <CardContent className="p-5 flex-grow">
        <div className="mb-3">
          <Link href={`/course/${slug}`}>
            <h3 className="font-semibold text-lg cursor-pointer hover:text-primary transition-colors">
              {title}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground">{instructor}</p>
        </div>
        <div className="flex items-center text-sm mb-2">
          <div className="flex items-center text-muted-foreground">
            <Eye className="h-4 w-4 mr-1" />
            <span>{reviewsCount.toLocaleString()} lượt xem</span>
          </div>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <div className="flex items-center mr-3">
            <BookOpen className="h-4 w-4 mr-1" />
            <span>{badges[0] || "0 học viên"}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center items-center p-5 pt-0 border-t">
        <Button
          variant="default"
          size="sm"
          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold w-full shadow-lg transform hover:scale-105 transition-all duration-200 relative top-[10px] rounded-md py-2"
          onClick={handleRegister}
          disabled={isRegistering}
        >
          {isRegistering ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang đăng ký...
            </>
          ) : (
            "Đăng Ký Ngay"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
