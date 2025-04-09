import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import {
  BarChart4,
  BookOpen,
  FileText,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  MessagesSquare,
  Settings,
  Users,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Courses", href: "/admin/courses", icon: BookOpen },
    { name: "Orders", href: "/admin/orders", icon: FileText },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart4 },
    { name: "Comments", href: "/admin/comments", icon: MessagesSquare },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];
  
  // Handle logout
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user) return "U";
    
    const fullName = user.fullName || user.username;
    return fullName
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <div className="h-screen flex overflow-hidden bg-background">
      {/* Sidebar for desktop */}
      <div className={cn(
        "fixed inset-y-0 left-0 bg-card/60 backdrop-blur-sm border-r z-20 w-64 transition-all duration-300 ease-in-out",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-full flex flex-col">
          <div className="py-5 px-4 flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-primary" />
                <span className="text-xl font-semibold">Admin Panel</span>
              </div>
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSidebarOpen(false)}
              className="md:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <Separator />
          
          <div className="flex-1 py-6 overflow-y-auto">
            <nav className="space-y-1 px-3">
              {navigation.map((item) => {
                const isActive = location === item.href;
                return (
                  <Link key={item.name} href={item.href}>
                    <div className={cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer",
                      isActive 
                        ? "bg-primary/10 text-primary" 
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}>
                      <item.icon className={cn(
                        "mr-3 h-5 w-5",
                        isActive ? "text-primary" : "text-muted-foreground"
                      )} />
                      {item.name}
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
          
          <div className="flex-shrink-0 p-4">
            <Link href="/">
              <div className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer">
                <Home className="mr-3 h-5 w-5" />
                Back to Website
              </div>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className={cn(
        "flex-1 flex flex-col w-0 overflow-hidden transition-all duration-300",
        sidebarOpen ? "md:pl-64" : "pl-0"
      )}>
        {/* Top navigation */}
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
          <div className="flex items-center justify-between h-16 px-4 md:px-6">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setSidebarOpen(true)}
                className={cn(sidebarOpen ? "md:hidden" : "")}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="ml-4 text-lg font-medium">{title}</h1>
            </div>
            
            <div className="flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar || ""} alt={user?.username || ""} />
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="py-6 px-4 md:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}