import React from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

interface NavItemProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const NavItem = ({ href, children, className }: NavItemProps) => {
  const [location] = useLocation();
  const isActive = location === href;
  
  return (
    <Link href={href}>
      <span className={cn(
        "px-2 py-1 text-gray-700 hover:text-blue-800 font-medium cursor-pointer",
        isActive && "text-blue-800",
        className
      )}>
        {children}
      </span>
    </Link>
  );
};

export default function MainNav() {
  return (
    <nav className="hidden md:flex items-center space-x-4">
      <NavItem href="/">Trang chủ</NavItem>
      <NavItem href="/courses">Khóa học</NavItem>
      <NavItem href="/instructors">Giảng viên</NavItem>
      <NavItem href="/about">Về chúng tôi</NavItem>
      <NavItem href="/contact">Liên hệ</NavItem>
      <NavItem href="/admin">Admin</NavItem>
    </nav>
  );
}
