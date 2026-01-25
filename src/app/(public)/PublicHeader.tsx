"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Bars3Icon,
  XMarkIcon,
  PhoneIcon,
  ChevronDownIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { useSystemConfig } from "@/hooks/useSystemConfig";

import { SystemConfig } from "@/types/api";

interface PublicHeaderProps {
  mobileMenuOpen?: boolean;
  onToggleMobileMenu?: () => void;
  onCloseMobileMenu?: () => void;
  currentPath?: string;
  systemConfig: SystemConfig | null;
}

export function PublicHeader({
  mobileMenuOpen = false,
  onToggleMobileMenu = () => { },
  onCloseMobileMenu = () => { },
  currentPath = "",
  systemConfig,
}: PublicHeaderProps) {
  const [expandedMobileMenus, setExpandedMobileMenus] = useState<string[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const [internalMobileMenuOpen, setInternalMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync scroll lock with menu state
  useEffect(() => {
    if (internalMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [internalMobileMenuOpen]);

  // Handle pathname changes (auto-close menu)
  useEffect(() => {
    setInternalMobileMenuOpen(false);
  }, [pathname]);

  const siteName = systemConfig?.site_name || "Công Ty Xây Dựng";

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Navigation items
  const navigationItems = [
    { name: "Trang chủ", path: "/", icon: "" },
    {
      name: "Dự án",
      path: "/home/projects",
      icon: "",
      children: [
        { name: "Dự án nổi bật", path: "/home/projects", icon: "" },
        { name: "Dự án đang thi công", path: "/home/projects?status=ongoing", icon: "" },
        { name: "Dự án đã hoàn thành", path: "/home/projects?status=completed", icon: "" },
      ],
    },
    {
      name: "Dịch vụ",
      path: "/home/services",
      icon: "",
      children: [
        { name: "Thiết kế xây dựng", path: "/home/services/design", icon: "" },
        { name: "Thi công xây dựng", path: "/home/services/construction", icon: "" },
        { name: "Giám sát thi công", path: "/home/services/supervision", icon: "" },
      ],
    },
    {
      name: "Về chúng tôi",
      path: "/home/about",
      icon: "",
      children: [
        { name: "Giới thiệu chung", path: "/home/about", icon: "" },
        { name: "Đội ngũ nhân sự", path: "/home/staff", icon: "" },
        { name: "Chứng chỉ & Giấy phép", path: "/home/certificates", icon: "" },
      ],
    },
    { name: "Tin tức", path: "/home/posts", icon: "" },
  ];

  const isActive = (path: string) => pathname === path || pathname?.startsWith(path + "/");

  const toggleMobileSubmenu = (name: string) => {
    setExpandedMobileMenus((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  /* Always use white background */
  const headerClass = "bg-white shadow-sm border-b border-gray-100";

  const handleToggle = () => {
    setInternalMobileMenuOpen(!internalMobileMenuOpen);
    onToggleMobileMenu();
  };

  const handleClose = () => {
    setInternalMobileMenuOpen(false);
    onCloseMobileMenu();
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${headerClass}`}
      >
        <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo area */}
            <div className="flex items-center gap-3 shrink-0">
              <Link href="/" className="flex items-center gap-3 group">
                <div className={`relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-105 overflow-hidden shrink-0`}>
                  {systemConfig?.site_logo ? (
                    <Image
                      src={systemConfig.site_logo}
                      alt={siteName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  )}
                </div>
                <span className="text-xl font-bold tracking-tight text-gray-900 whitespace-nowrap">
                  {siteName}
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navigationItems.map((item) => (
                <div key={item.name} className="relative group px-1">
                  {item.children ? (
                    <button className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${isActive(item.path)
                      ? "bg-primary/10 text-primary"
                      : "text-gray-700 hover:text-primary hover:bg-gray-50"
                      }`}>
                      {item.name}
                      <ChevronDownIcon className="w-4 h-4 opacity-50 group-hover:rotate-180 transition-transform duration-200" />
                    </button>
                  ) : (
                    <Link
                      href={item.path}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${isActive(item.path)
                        ? "bg-primary/10 text-primary"
                        : "text-gray-700 hover:text-primary hover:bg-gray-50"
                        }`}
                    >
                      {item.name}
                    </Link>
                  )}

                  {/* Dropdown */}
                  {item.children && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-2 min-w-[240px] overflow-hidden">
                        {item.children.map((child) => (
                          <Link
                            key={child.path}
                            href={child.path}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-sm font-medium text-gray-700 hover:text-primary transition-colors whitespace-nowrap"
                          >
                            <span className="text-xl opacity-80">{child.icon}</span>
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 shrink-0">
              <Link href="/home/contact" className="hidden lg:flex">
                <button className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-full font-medium shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all whitespace-nowrap">
                  <PhoneIcon className="w-4 h-4" />
                  <span>Tư vấn</span>
                </button>
              </Link>

              <button
                className="lg:hidden p-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-all active:scale-95 z-[70]"
                onClick={handleToggle}
                aria-label="Toggle menu"
              >
                <Bars3Icon className="w-7 h-7" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {internalMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[80] backdrop-blur-sm lg:hidden transition-all duration-300"
          onClick={handleClose}
        />
      )}

      {/* Mobile Menu Sidebar */}
      <div className={`fixed inset-y-0 right-0 w-[300px] bg-white z-[90] shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden ${internalMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}>
        <div className="flex flex-col h-full">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <span className="font-bold text-lg text-gray-900">Danh mục</span>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <nav className="space-y-1">
              {navigationItems.map((item) => (
                <div key={item.name} className="overflow-hidden">
                  {item.children ? (
                    <div>
                      <button
                        onClick={() => toggleMobileSubmenu(item.name)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left font-medium transition-colors ${isActive(item.path) ? "bg-primary/5 text-primary" : "text-gray-700 hover:bg-gray-50"
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{item.icon}</span>
                          {item.name}
                        </div>
                        <ChevronDownIcon
                          className={`w-5 h-5 text-gray-400 transition-transform ${expandedMobileMenus.includes(item.name) ? "rotate-180" : ""
                            }`}
                        />
                      </button>
                      <div
                        className={`space-y-1 pl-12 pr-2 transition-all duration-300 ${expandedMobileMenus.includes(item.name)
                          ? "max-h-[500px] opacity-100 py-2"
                          : "max-h-0 opacity-0 overflow-hidden"
                          }`}
                      >
                        {item.children.map((child) => (
                          <Link
                            key={child.path}
                            href={child.path}
                            onClick={handleClose}
                            className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${pathname === child.path
                              ? "text-primary bg-primary/5"
                              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                              }`}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={item.path}
                      onClick={handleClose}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive(item.path) ? "bg-primary/5 text-primary" : "text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>

          <div className="p-5 border-t border-gray-100">
            <Link href="/home/contact" onClick={handleClose}>
              <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium shadow-lg shadow-primary/25 active:scale-95 transition-all">
                <PhoneIcon className="w-5 h-5" />
                <span>Liên hệ ngay</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}