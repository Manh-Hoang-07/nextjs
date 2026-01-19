"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/navigation/Button";
import FormField from "@/components/ui/forms/FormField";
import Link from "next/link";

interface Project {
    id: string;
    name: string;
    slug: string;
    description: string;
    short_description: string;
    cover_image: string | null;
    location: string;
    status: "completed" | "in_progress" | "planned";
    client_name: string;
    images: string;
}

interface ProjectFilterProps {
    initialProjects: Project[];
}

export function ProjectFilter({ initialProjects }: ProjectFilterProps) {
    const [filteredProjects, setFilteredProjects] = useState<Project[]>(initialProjects);
    const [filters, setFilters] = useState({
        status: "all",
        search: "",
    });

    useEffect(() => {
        let filtered = [...initialProjects];

        if (filters.status !== "all") {
            filtered = filtered.filter(project => project.status === filters.status);
        }

        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filtered = filtered.filter(project =>
                project.name.toLowerCase().includes(searchLower) ||
                project.description.toLowerCase().includes(searchLower) ||
                project.client_name.toLowerCase().includes(searchLower) ||
                project.location.toLowerCase().includes(searchLower)
            );
        }

        setFilteredProjects(filtered);
    }, [initialProjects, filters]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed":
                return "bg-green-100 text-green-800";
            case "in-progress":
            case "in_progress":
                return "bg-yellow-100 text-yellow-800";
            case "planned":
                return "bg-blue-100 text-blue-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "completed":
                return "Hoàn thành";
            case "in-progress":
            case "in_progress":
                return "Đang thực hiện";
            case "planned":
                return "Kế hoạch";
            default:
                return status;
        }
    };

    return (
        <>
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        id="search"
                        name="search"
                        type="text"
                        label="Tìm kiếm"
                        placeholder="Tìm kiếm dự án..."
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    />

                    <FormField
                        id="status"
                        name="status"
                        type="select"
                        label="Trạng thái"
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        options={[
                            { value: "all", label: "Tất cả" },
                            { value: "completed", label: "Hoàn thành" },
                            { value: "in_progress", label: "Đang thực hiện" },
                            { value: "planned", label: "Kế hoạch" },
                        ]}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((project) => (
                    <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="h-48 bg-gray-200">
                            <Image
                                src={project.cover_image || "/images/placeholder.jpg"}
                                alt={project.name}
                                width={400}
                                height={200}
                                className="h-full w-full object-cover"
                                unoptimized
                            />
                        </div>
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-xl font-semibold text-gray-900">{project.name}</h3>
                                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(project.status)}`}>
                                    {getStatusText(project.status)}
                                </span>
                            </div>
                            <p className="text-gray-600 mb-4 line-clamp-2">{project.short_description}</p>
                            <div className="mb-4">
                                <p className="text-sm text-gray-500 mb-1">Khách hàng: {project.client_name}</p>
                                <p className="text-sm text-gray-500">Địa điểm: {project.location}</p>
                            </div>
                            <Link href={`/home/projects/${project.slug}`} className="block w-full">
                                <Button className="w-full">
                                    Xem chi tiết
                                </Button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {filteredProjects.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-600">Không tìm thấy dự án nào phù hợp với bộ lọc.</p>
                </div>
            )}
        </>
    );
}
