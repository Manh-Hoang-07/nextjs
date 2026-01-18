"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

interface AdminHeaderProps {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
  currentPath: string;
}

export function AdminHeader({ onToggleSidebar, sidebarOpen, currentPath }: AdminHeaderProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [userName, setUserName] = useState("Admin User");
  const pathname = usePathname();

  // Lấy tên trang từ pathname
  const getPageTitle = () => {
    const pathSegments = pathname.split("/");
    const lastSegment = pathSegments[pathSegments.length - 1];
    
    if (lastSegment === "dashboard") return "Dashboard";
    if (lastSegment === "users") return "Users";
    if (lastSegment === "posts") return "Posts";
    if (lastSegment === "projects") return "Projects";
    if (lastSegment === "about-sections") return "About Sections";
    if (lastSegment === "banners") return "Banners";
    if (lastSegment === "banner-locations") return "Banner Locations";
    if (lastSegment === "certificates") return "Certificates";
    if (lastSegment === "contacts") return "Contacts";
    if (lastSegment === "contexts") return "Contexts";
    if (lastSegment === "faqs") return "FAQs";
    if (lastSegment === "gallery") return "Gallery";
    if (lastSegment === "groups") return "Groups";
    if (lastSegment === "menus") return "Menus";
    if (lastSegment === "partners") return "Partners";
    if (lastSegment === "permissions") return "Permissions";
    if (lastSegment === "post-categories") return "Post Categories";
    if (lastSegment === "post-tags") return "Post Tags";
    if (lastSegment === "roles") return "Roles";
    if (lastSegment === "staff") return "Staff";
    if (lastSegment === "system-configs") return "System Configs";
    if (lastSegment === "testimonials") return "Testimonials";
    if (lastSegment === "warehouses") return "Warehouses";
    
    return "Admin Panel";
  };

  const pageTitle = getPageTitle();

  // Đóng menu khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (userMenuOpen && !target.closest(".user-menu")) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [userMenuOpen]);

  const handleLogout = () => {
    // Xử lý logout ở đây
    window.location.href = "/auth/login";
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Menu button and title */}
          <div className="flex items-center">
            <button
              type="button"
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
              onClick={onToggleSidebar}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
            <h1 className="ml-4 text-lg font-semibold text-gray-900">{pageTitle}</h1>
          </div>

          {/* Right side - Notifications and user menu */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button
              type="button"
              className="p-1 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* User menu */}
            <div className="relative user-menu">
              <button
                type="button"
                className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <span className="sr-only">Open user menu</span>
                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <UserCircleIcon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
              </button>

              {/* User dropdown */}
              {userMenuOpen && (
                <div className="absolute right-0 z-50 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{userName}</p>
                    <p className="text-xs text-gray-500">admin@example.com</p>
                  </div>
                  <Link
                    href="/user/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <UserCircleIcon className="mr-3 h-4 w-4" aria-hidden="true" />
                    Your Profile
                  </Link>
                  <Link
                    href="/admin/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <svg className="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <ArrowRightOnRectangleIcon className="mr-3 h-4 w-4" aria-hidden="true" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}