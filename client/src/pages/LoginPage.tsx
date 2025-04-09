import React, { useEffect } from "react";
import { Link, useLocation, useSearch } from "wouter";
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
const loginSchema = z.object({
  username: z.string().min(1, "Tên đăng nhập không được để trống"),
  password: z.string().min(1, "Mật khẩu không được để trống"),
  rememberMe: z.boolean().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [location, navigate] = useLocation();
  const { login, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const search = useSearch();
  
  // Check for registration success message in URL parameters
  useEffect(() => {
    const params = new URLSearchParams(search);
    if (params.get('registered') === 'true') {
      toast({
        title: "Đăng ký thành công",
        description: "Vui lòng đăng nhập để tiếp tục",
        variant: "default",
      });
    }
  }, [search, toast]);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Set up form
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
  });

  const { isSubmitting } = form.formState;

  // Handle form submission
  const onSubmit = async (data: LoginForm) => {
    try {
      console.log("Login form submission:", data);
      
      // Show processing toast
      toast({
        title: "Đang xử lý",
        description: "Vui lòng đợi trong giây lát...",
        variant: "default",
      });
      
      // Use login method from AuthContext
      await login(data.username, data.password);
      
      // Show success toast
      toast({
        title: "Đăng nhập thành công",
        description: "Chào mừng bạn trở lại!",
        variant: "default",
      });
      
      // Navigate to home page
      navigate("/");
    } catch (error) {
      // Error is already handled in the login method of AuthContext
      console.error("Login failed:", error);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Đăng nhập</CardTitle>
            <CardDescription>
              Nhập thông tin đăng nhập của bạn để truy cập vào tài khoản
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
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên đăng nhập</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập tên đăng nhập"
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
                          placeholder="Nhập mật khẩu"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-between">
                  {/* <FormField
                    control={form.control}
                    name="rememberMe"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <label
                          htmlFor="rememberMe"
                          className="text-sm font-medium cursor-pointer"
                        >
                          Nhớ tài khoản
                        </label>
                      </FormItem>
                    )}
                  />
                   */}
                  {/* <Link href="/forgot-password">
                    <a className="text-sm text-blue-800 hover:text-blue-900">
                      Quên mật khẩu?
                    </a>
                  </Link> */}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
                </Button>
              </form>
            </Form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              {/* <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Hoặc đăng nhập với
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
              Bạn chưa có tài khoản?{" "}
              <Link href="/register" className="text-blue-800 hover:text-blue-900 font-medium">
                Đăng ký ngay
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
}
