import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/lib/protected-route";
import NotFound from "@/pages/not-found";

// Pages
import HomePage from "@/pages/HomePage";
import CoursesPage from "@/pages/CoursesPage";
import CourseDetailsPage from "@/pages/CourseDetailsPage";
import CourseCategoryPage from "@/pages/CourseCategoryPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import MyCoursesPage from "@/pages/MyCoursesPage";
import DashboardPage from "@/pages/DashboardPage";
import ProfilePage from "@/pages/ProfilePage";

// Admin Pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import UsersManagement from "@/pages/admin/UsersManagement";
import CoursesManagement from "@/pages/admin/CoursesManagement";
import CourseEdit from "@/pages/admin/CourseEdit";

function Router() {
  return (
    <Switch>
      {/* Auth Pages - Always accessible */}
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      
      {/* Public Pages - Will redirect to /login if user is not authenticated */}
      <ProtectedRoute path="/" component={HomePage} />
      <ProtectedRoute path="/courses" component={CoursesPage} />
      <ProtectedRoute path="/courses/category/:categoryId" component={CourseCategoryPage} />
      <ProtectedRoute path="/courses/:slug" component={CourseDetailsPage} />
      <ProtectedRoute path="/course/:maKhoaHoc" component={CourseDetailsPage} />
      
      {/* Authenticated User Pages */}
      <ProtectedRoute path="/my-courses" component={MyCoursesPage} />
      <ProtectedRoute path="/profile" component={ProfilePage} />
      <ProtectedRoute path="/dashboard" component={DashboardPage} />
      
      {/* Admin Pages */}
      <ProtectedRoute path="/admin" component={AdminDashboard} />
      <ProtectedRoute path="/admin/users" component={UsersManagement} />
      <ProtectedRoute path="/admin/courses" component={CoursesManagement} />
      <ProtectedRoute path="/admin/courses/:id/edit" component={CourseEdit} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
