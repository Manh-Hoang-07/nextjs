"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/api/client";
import { publicEndpoints } from "@/lib/api/endpoints";

interface HeroBannerData {
    id?: number;
    title: string;
    subtitle?: string;
    description?: string;
    image: string;
    button_text?: string;
    link?: string;
    link_target?: string;
    titleColor?: string;
    subtitleColor?: string;
    descriptionColor?: string;
    backgroundColor?: string;
}

interface HeroBannerProps {
    // Option 1: Truyền data trực tiếp
    data?: HeroBannerData;

    // Option 2: Lấy từ API theo location code
    locationCode?: string;

    // Option 3: Lấy từ API theo banner ID
    bannerId?: number;

    // Customization
    containerClass?: string;
    imagePosition?: "left" | "right";
    showSkeleton?: boolean;
    imageOnly?: boolean; // Chỉ hiển thị ảnh, không có text/button
}

export default function HeroBanner({
    data,
    locationCode,
    bannerId,
    containerClass = "",
    imagePosition = "right",
    showSkeleton = true,
    imageOnly = false,
}: HeroBannerProps) {
    const [bannerData, setBannerData] = useState<HeroBannerData | null>(data || null);
    const [loading, setLoading] = useState(false);

    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

    const getImageUrl = (path: string | null | undefined): string => {
        if (!path) return "/placeholder-banner.jpg";
        if (path.startsWith("http://") || path.startsWith("https://")) {
            return path;
        }
        if (path.startsWith("/")) {
            return `${apiBase}${path}`;
        }
        return path;
    };

    const fetchBannerData = useCallback(async () => {
        // Nếu đã có data truyền vào, không cần fetch
        if (data) {
            setBannerData(data);
            return;
        }

        // Nếu không có locationCode và bannerId, không fetch
        if (!locationCode && !bannerId) {
            setBannerData(null);
            return;
        }

        setLoading(true);

        try {
            let response;

            if (bannerId) {
                // Fetch theo ID
                response = await api.get(publicEndpoints.banners.show(bannerId));
                if (response.data?.success && response.data?.data) {
                    setBannerData(transformApiBanner(response.data.data));
                } else {
                    setBannerData(null);
                }
            } else if (locationCode) {
                // Fetch theo location code
                response = await api.get(publicEndpoints.banners.getByLocation(locationCode));
                let bannersData: any[] = [];

                if (response.data?.success && response.data?.data) {
                    bannersData = Array.isArray(response.data.data) ? response.data.data : [];
                } else if (Array.isArray(response.data)) {
                    bannersData = response.data;
                }

                if (bannersData.length > 0) {
                    setBannerData(transformApiBanner(bannersData[0]));
                } else {
                    setBannerData(null);
                }
            }
        } catch (err: any) {
            console.error("Error fetching banner:", err);
            setBannerData(null);
        } finally {
            setLoading(false);
        }
    }, [data, locationCode, bannerId]);

    // Transform API response to component data structure
    const transformApiBanner = (apiBanner: any): HeroBannerData | null => {
        // Nếu không có data cần thiết, return null
        if (!apiBanner.title || !apiBanner.image) {
            return null;
        }

        return {
            id: apiBanner.id,
            title: apiBanner.title,
            subtitle: apiBanner.subtitle || "",
            description: apiBanner.description || "",
            image: apiBanner.image,
            button_text: apiBanner.button_text || "",
            link: apiBanner.link || "",
            link_target: apiBanner.link_target || "_self",
            titleColor: apiBanner.title_color || apiBanner.metadata?.title_color,
            subtitleColor: apiBanner.subtitle_color || apiBanner.metadata?.subtitle_color,
            descriptionColor: apiBanner.description_color || apiBanner.metadata?.description_color,
            backgroundColor: apiBanner.background_color || apiBanner.metadata?.background_color,
        };
    };

    useEffect(() => {
        fetchBannerData();
    }, [fetchBannerData]);

    // Loading skeleton
    if (loading && showSkeleton) {
        return (
            <div className={`hero-banner bg-gray-50 rounded-lg overflow-hidden ${containerClass}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center animate-pulse">
                        <div className="space-y-6">
                            <div className="h-12 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-8 bg-gray-200 rounded w-full"></div>
                            <div className="h-20 bg-gray-200 rounded w-full"></div>
                            <div className="h-12 bg-gray-200 rounded w-40"></div>
                        </div>
                        <div className="aspect-[4/3] bg-gray-200 rounded-2xl"></div>
                    </div>
                </div>
            </div>
        );
    }

    // Nếu không có data từ API, ẩn banner
    if (!bannerData) {
        return null;
    }

    const contentSection = (
        <div className="space-y-6">
            {/* Title */}
            {bannerData.title && (
                <h1
                    className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
                    style={{ color: bannerData.titleColor || "#2563EB" }}
                >
                    {bannerData.title}
                </h1>
            )}

            {/* Subtitle */}
            {bannerData.subtitle && (
                <h2
                    className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight"
                    style={{ color: bannerData.subtitleColor || "#1F2937" }}
                >
                    {bannerData.subtitle}
                </h2>
            )}

            {/* Description */}
            {bannerData.description && (
                <p
                    className="text-base md:text-lg leading-relaxed max-w-xl"
                    style={{ color: bannerData.descriptionColor || "#6B7280" }}
                >
                    {bannerData.description}
                </p>
            )}

            {/* Button - Chỉ hiển thị nếu có button_text và link */}
            {bannerData.button_text && bannerData.link && (
                <div className="pt-4">
                    <Link
                        href={bannerData.link}
                        target={bannerData.link_target || "_self"}
                        rel={bannerData.link_target === "_blank" ? "noopener noreferrer" : undefined}
                        className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        {bannerData.button_text}
                        <svg
                            className="w-5 h-5 ml-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                        </svg>
                    </Link>
                </div>
            )}
        </div>
    );

    const imageSection = (
        <div className="relative">
            <div className="aspect-[4/3] relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                    src={getImageUrl(bannerData.image)}
                    alt={bannerData.title || "Hero Banner"}
                    fill
                    className="object-cover"
                    priority
                    unoptimized
                />
            </div>
        </div>
    );

    // Nếu imageOnly = true, chỉ hiển thị ảnh full-width
    if (imageOnly) {
        return (
            <div className={`hero-banner-image-only rounded-lg overflow-hidden ${containerClass}`}>
                <div className="relative w-full aspect-[21/9] md:aspect-[16/6] lg:aspect-[21/7]">
                    <Image
                        src={getImageUrl(bannerData.image)}
                        alt={bannerData.title || "Banner"}
                        fill
                        className="object-cover"
                        priority
                        unoptimized
                    />
                </div>
            </div>
        );
    }

    return (
        <div
            className={`hero-banner rounded-lg overflow-hidden ${containerClass}`}
            style={{ backgroundColor: bannerData.backgroundColor || "#F9FAFB" }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {imagePosition === "left" ? (
                        <>
                            {imageSection}
                            {contentSection}
                        </>
                    ) : (
                        <>
                            {contentSection}
                            {imageSection}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
