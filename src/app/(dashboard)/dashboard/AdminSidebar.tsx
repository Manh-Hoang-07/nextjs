"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  UserIcon,
  DocumentTextIcon,
  FolderIcon,
  CogIcon,
  ChartBarIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  TagIcon,
  PhotoIcon,
  QuestionMarkCircleIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  TruckIcon,
  CurrencyDollarIcon,
  ArchiveBoxIcon,
  ClipboardDocumentListIcon,
  BellIcon,
  GlobeAltIcon,
  BookmarkIcon,
  HeartIcon,
  ClockIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const adminLinks = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: HomeIcon,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: UserIcon,
  },
  {
    name: "Posts",
    href: "/admin/posts",
    icon: DocumentTextIcon,
  },
  {
    name: "Projects",
    href: "/admin/projects",
    icon: FolderIcon,
  },
  {
    name: "About Sections",
    href: "/admin/about-sections",
    icon: BuildingOfficeIcon,
  },
  {
    name: "Banners",
    href: "/admin/banners",
    icon: PhotoIcon,
  },
  {
    name: "Banner Locations",
    href: "/admin/banner-locations",
    icon: GlobeAltIcon,
  },
  {
    name: "Certificates",
    href: "/admin/certificates",
    icon: AcademicCapIcon,
  },
  {
    name: "Contacts",
    href: "/admin/contacts",
    icon: BellIcon,
  },
  {
    name: "Contexts",
    href: "/admin/contexts",
    icon: GlobeAltIcon,
  },
  {
    name: "FAQs",
    href: "/admin/faqs",
    icon: QuestionMarkCircleIcon,
  },
  {
    name: "Gallery",
    href: "/admin/gallery",
    icon: PhotoIcon,
  },
  {
    name: "Groups",
    href: "/admin/groups",
    icon: UserGroupIcon,
  },
  {
    name: "Menus",
    href: "/admin/menus",
    icon: ClipboardDocumentListIcon,
  },
  {
    name: "Partners",
    href: "/admin/partners",
    icon: BuildingOfficeIcon,
  },
  {
    name: "Permissions",
    href: "/admin/permissions",
    icon: ShieldCheckIcon,
  },
  {
    name: "Post Categories",
    href: "/admin/post-categories",
    icon: TagIcon,
  },
  {
    name: "Post Tags",
    href: "/admin/post-tags",
    icon: TagIcon,
  },
  {
    name: "Roles",
    href: "/admin/roles",
    icon: ShieldCheckIcon,
  },
  {
    name: "Staff",
    href: "/admin/staff",
    icon: UserCircleIcon,
  },
  {
    name: "System Configs",
    href: "/admin/system-configs",
    icon: CogIcon,
  },
  {
    name: "Testimonials",
    href: "/admin/testimonials",
    icon: BookmarkIcon,
  },
  {
    name: "Warehouses",
    href: "/admin/warehouses",
    icon: ArchiveBoxIcon,
  },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
}

export function AdminSidebar({ isOpen, onClose, currentPath }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-700">
          <h2 className="text-lg font-semibold">Admin Panel</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="mt-5 px-2">
          <div className="space-y-1">
            {adminLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? "bg-slate-700 text-white"
                      : "text-slate-300 hover:bg-slate-700 hover:text-white"
                  }`}
                  onClick={onClose}
                >
                  <link.icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      isActive ? "text-blue-400" : "text-slate-400 group-hover:text-slate-300"
                    }`}
                    aria-hidden="true"
                  />
                  {link.name}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Desktop sidebar */}
      <div
        className={`hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:w-64 lg:overflow-y-auto lg:bg-gradient-to-b lg:from-slate-900 lg:via-slate-800 lg:to-slate-900 lg:text-white lg:block ${
          isOpen ? "lg:block" : "lg:hidden"
        }`}
      >
        <div className="flex items-center h-16 px-4 border-b border-slate-700">
          <h2 className="text-lg font-semibold">Admin Panel</h2>
        </div>
        <nav className="mt-5 px-2">
          <div className="space-y-1">
            {adminLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? "bg-slate-700 text-white"
                      : "text-slate-300 hover:bg-slate-700 hover:text-white"
                  }`}
                >
                  <link.icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      isActive ? "text-blue-400" : "text-slate-400 group-hover:text-slate-300"
                    }`}
                    aria-hidden="true"
                  />
                  {link.name}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </>
  );
}