import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Redirect, useLocation } from "wouter";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2 } from "lucide-react";

// Schema for login
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// Schema for register
const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  email: z.string().email("Invalid email address"),
  fullName: z.string().min(1, "Full name is required"),
  role: z.enum(["student", "instructor"]),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<string>("login");
  const { user, login, register, isLoading } = useAuth();

  // Login form
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
      fullName: "",
      role: "student",
    },
  });

  // Handle login form submission
  async function onLoginSubmit(values: z.infer<typeof loginSchema>) {
    console.log("Login form submission:", values);
    
    try {
      console.log("Attempting to login with:", values.username, values.password);
      
      // Make direct API call to login
      const response = await fetch('https://elearning0706.cybersoft.edu.vn/api/QuanLyNguoiDung/DangNhap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taiKhoan: values.username,
          matKhau: values.password
        }),
      });
      
      console.log("Login API response:", response);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Login error:", errorText);
        throw new Error(errorText || "Login failed");
      }
      
      const data = await response.json();
      console.log("Login successful:", data);
      
      // Store the user data and token in localStorage for session management
      localStorage.setItem('user', JSON.stringify(data));
      localStorage.setItem('token', data.accessToken);
      
      // Redirect to home page
      window.location.href = '/';
      
    } catch (error) {
      console.error("Error during login:", error);
      // Show a more visible error message
      alert("Login failed: " + (error instanceof Error ? error.message : "Invalid credentials"));
    }
  }

  // Handle register form submission
  async function onRegisterSubmit(values: z.infer<typeof registerSchema>) {
    console.log("Register form submission:", values);
    
    try {
      // Create a formData object to see in console
      const registerData = {
        username: values.username,
        password: values.password,
        email: values.email,
        fullName: values.fullName,
        phone: "0123456789", // Default phone number
        groupCode: "GP01", // Default group code
      };
      
      console.log("Calling register with data:", registerData);
      
      // Make the API call directly since there might be an issue with the context
      const response = await fetch('https://elearning0706.cybersoft.edu.vn/api/QuanLyNguoiDung/DangKy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taiKhoan: values.username,
          matKhau: values.password,
          hoTen: values.fullName,
          soDT: "0123456789", // Default phone number
          maNhom: "GP01", // Default group code
          email: values.email
        }),
      });
      
      console.log("API response:", response);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Registration error:", errorText);
        throw new Error(errorText || "Registration failed");
      }
      
      const data = await response.json();
      console.log("Registration successful:", data);
      
      // Switch to login tab after successful registration
      setActiveTab("login");
      
      // Show a success message
      alert("Registration successful! Please login with your new account.");
    } catch (error) {
      console.error("Error during registration:", error);
      // Show a more visible error message
      alert("Registration failed: " + (error instanceof Error ? error.message : "Unknown error"));
    }
  }

  // If user is already logged in, redirect to homepage
  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left side - Auth forms */}
      <div className="flex flex-col justify-center w-full p-8 lg:w-1/2">
        <div className="flex flex-col space-y-2 text-center mb-8">
          <h1 className="text-3xl font-bold">Welcome to EduPlatform</h1>
          <p className="text-muted-foreground">Your gateway to learning excellence</p>
        </div>

        <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="max-w-md mx-auto w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Account Login</CardTitle>
                <CardDescription>Enter your credentials to access your account</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="johndoe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="********" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Logging in...
                        </>
                      ) : (
                        "Login"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex justify-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <button
                    onClick={() => setActiveTab("register")}
                    className="text-primary underline underline-offset-4 hover:text-primary/90"
                  >
                    Sign up
                  </button>
                </p>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Register Tab */}
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>Enter your details to create a new account</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="johndoe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="johndoe@example.com" type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="********" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="********" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={registerForm.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>I want to join as</FormLabel>
                          <div className="grid grid-cols-2 gap-4 mt-2">
                            <Button
                              type="button"
                              variant={field.value === "student" ? "default" : "outline"}
                              onClick={() => field.onChange("student")}
                              className="w-full"
                            >
                              Student
                            </Button>
                            <Button
                              type="button"
                              variant={field.value === "instructor" ? "default" : "outline"}
                              onClick={() => field.onChange("instructor")}
                              className="w-full"
                            >
                              Instructor
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        "Register"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex justify-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <button
                    onClick={() => setActiveTab("login")}
                    className="text-primary underline underline-offset-4 hover:text-primary/90"
                  >
                    Sign in
                  </button>
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Right side - Hero section */}
      <div className="hidden lg:block w-1/2 bg-primary/10">
        <div className="flex items-center justify-center h-full p-8">
          <div className="max-w-md">
            <h2 className="text-3xl font-bold mb-6">Unlock Your Potential with Our Learning Platform</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="bg-primary/20 p-2 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Expert Instructors</h3>
                  <p className="text-sm text-muted-foreground">Learn from industry experts with real-world experience</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-primary/20 p-2 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Flexible Learning</h3>
                  <p className="text-sm text-muted-foreground">Study at your own pace, anytime and anywhere</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-primary/20 p-2 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Diverse Course Library</h3>
                  <p className="text-sm text-muted-foreground">Access thousands of courses across various disciplines</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-primary/20 p-2 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Interactive Learning</h3>
                  <p className="text-sm text-muted-foreground">Engage with quizzes, projects, and community discussions</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}