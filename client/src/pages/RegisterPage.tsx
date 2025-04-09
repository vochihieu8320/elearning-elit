import React, { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import MainLayout from "@/layouts/MainLayout";

// Define form schema
const registerSchema = z
  .object({
    fullName: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự"),
    username: z.string().min(3, "Tên đăng nhập phải có ít nhất 3 ký tự"),
    email: z.string().email("Email không hợp lệ"),
    phone: z.string().min(10, "Số điện thoại phải có ít nhất 10 ký tự"),
    groupCode: z.string().min(2, "Mã nhóm không được để trống"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z.string(),
    agreeTerms: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [location, navigate] = useLocation();
  const { register, isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Set up form
  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      username: "",
      email: "",
      phone: "",
      groupCode: "GP01", // Default group code
      password: "",
      confirmPassword: "",
      agreeTerms: false,
    },
  });

  const { isSubmitting } = form.formState;

  // Handle form submission
  const onSubmit = async (data: RegisterForm) => {
    try {
      // Use event to prevent default form behavior and handle it ourselves
      console.log("Form submitted with data:", data);
  
      // Validate all required fields
      if (!data.username || !data.password || !data.fullName || !data.email || !data.phone) {
        console.error("Missing required fields");
        
        toast({
          title: "Đăng ký thất bại",
          description: "Vui lòng điền đầy đủ thông tin",
          variant: "destructive",
        });
        
        return;
      }
  
      // Password validation
      if (data.password !== data.confirmPassword) {
        console.error("Password confirmation doesn't match");
        
        toast({
          title: "Đăng ký thất bại",
          description: "Mật khẩu xác nhận không khớp",
          variant: "destructive",
        });
        
        return;
      }
      
      // Show processing toast
      toast({
        title: "Đang xử lý",
        description: "Vui lòng đợi trong giây lát...",
        variant: "default",
      });
      
      // Use the register method from AuthContext
      await register({
        username: data.username,
        password: data.password,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        groupCode: data.groupCode || "GP01"
      });
      
      // Show success toast before redirecting
      toast({
        title: "Đăng ký thành công",
        description: "Tài khoản của bạn đã được tạo thành công",
        variant: "default",
      });
      
      // Redirect to login page after successful registration with success parameter
      navigate("/login?registered=true");
    } catch (error) {
      // Error handling is already done in the register method of AuthContext
      console.error("Registration failed with error:", error);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">
              Đăng ký tài khoản
            </CardTitle>
            <CardDescription>
              Tạo tài khoản mới để truy cập các khóa học
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Họ và tên</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nguyễn Văn A"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên đăng nhập</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="nguyenvana"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormDescription>
                        Tên đăng nhập không được chứa khoảng trắng
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="example@gmail.com"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số điện thoại</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="0909123456"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mật khẩu</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="******"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormDescription>
                        Mật khẩu phải có ít nhất 6 ký tự
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Xác nhận mật khẩu</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="******"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* <FormField
                  control={form.control}
                  name="agreeTerms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <label
                          htmlFor="agreeTerms"
                          className="text-sm font-medium leading-none cursor-pointer"
                        >
                          Tôi đồng ý với{" "}
                          <Link href="/terms" className="text-blue-800 hover:text-blue-900">
                              điều khoản dịch vụ
                          </Link>{" "}
                          và{" "}
                          <Link href="/privacy" className="text-blue-800 hover:text-blue-900">
                              chính sách bảo mật
                          </Link>
                        </label>
                      </div>
                    </FormItem>
                  )}
                /> */}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Đang xử lý..." : "Đăng ký"}
                </Button>
              </form>
            </Form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              {/* <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Hoặc đăng ký với
                </span>
              </div> */}
            </div>

            {/* <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="w-full">
                <i className="fab fa-google mr-2"></i> Google
              </Button>
              <Button variant="outline" className="w-full">
                <i className="fab fa-facebook-f mr-2"></i> Facebook
              </Button>
            </div> */}
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-600">
              Đã có tài khoản?{" "}
              <Link href="/login" className="text-blue-800 hover:text-blue-900 font-medium">
                Đăng nhập
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
}
