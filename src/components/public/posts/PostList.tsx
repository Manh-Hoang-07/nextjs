"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/api/client";
import { publicEndpoints } from "@/lib/api/endpoints";

interface PostCategory {
    id: string;
    name: string;
    slug: string;
}

interface PostTag {
    id: string;
    name: string;
}

interface Post {
    id: string;
    name: string;
    excerpt: string;
    slug: string;
    image: string;
    cover_image: string;
    view_count: string;
    primary_category: PostCategory;
    tags: PostTag[];
    featured?: boolean;
}

interface PostListProps {
    initialPosts: Post[];
    categories: PostCategory[];
}

export function PostList({ initialPosts, categories }: PostListProps) {
    const [posts, setPosts] = useState<Post[]>(initialPosts);
    const [isLoading, setIsLoading] = useState(false);
    const [filters, setFilters] = useState({
        category: "all",
        search: "",
    });

    const featuredPost = posts.find(p => p.featured) || posts[0];

    useEffect(() => {
        if (filters.category === "all" && !filters.search) {
            setPosts(initialPosts);
            return;
        }

        const fetchPosts = async () => {
            setIsLoading(true);
            try {
                const params: any = {};
                if (filters.category !== "all") {
                    params["primary_category.slug"] = filters.category;
                }
                if (filters.search) {
                    params["search"] = filters.search;
                }

                const response = await api.get(publicEndpoints.posts.list, { params });
                if (response.data?.success) {
                    setPosts(response.data.data || []);
                }
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setIsLoading(false);
            }
        };

        const timer = setTimeout(() => {
            fetchPosts();
        }, 500);

        return () => clearTimeout(timer);
    }, [filters, initialPosts]);

    return (
        <>
            {/* Featured Post Hero */}
            {featuredPost && !filters.search && filters.category === 'all' && (
                <div className="mb-20">
                    <Link href={`/home/posts/${featuredPost.slug}`}>
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl group cursor-pointer bg-white">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10 transition-opacity group-hover:opacity-90"></div>
                            <Image
                                src={featuredPost.cover_image || featuredPost.image}
                                alt={featuredPost.name}
                                width={1200}
                                height={500}
                                className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
                                priority
                                unoptimized
                            />
                            <div className="absolute bottom-0 left-0 z-20 p-8 md:p-12 w-full max-w-4xl">
                                <span className="inline-block px-4 py-1.5 rounded-full bg-primary text-white text-sm font-semibold mb-4">
                                    Nổi Bật
                                </span>
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight group-hover:text-primary-100 transition-colors">
                                    {featuredPost.name}
                                </h2>
                                <p className="text-lg text-gray-200 mb-6 line-clamp-2 md:line-clamp-none max-w-2xl">
                                    {featuredPost.excerpt}
                                </p>
                                <div className="flex items-center text-gray-300 text-sm gap-4">
                                    <span className="flex items-center">
                                        {featuredPost.primary_category.name}
                                    </span>
                                    <span>•</span>
                                    <span>{featuredPost.view_count} lược xem</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            )}

            {/* Filters Bar */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-12 transition-shadow hover:shadow-lg border border-gray-100">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="w-full md:w-1/3">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Tìm kiếm bài viết..."
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                            />
                            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-thin">
                        <button
                            onClick={() => setFilters({ ...filters, category: "all" })}
                            className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${filters.category === "all" ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                        >
                            Tất cả
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setFilters({ ...filters, category: cat.slug })}
                                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${filters.category === cat.slug ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post) => (
                        <article
                            key={post.id}
                            className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col group h-full"
                        >
                            <div className="relative h-56 overflow-hidden">
                                <Image
                                    src={post.image || post.cover_image}
                                    alt={post.name}
                                    width={400}
                                    height={224}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    unoptimized
                                />
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider text-gray-800">
                                    {post.primary_category.name}
                                </div>
                            </div>

                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                                    <Link href={`/home/posts/${post.slug}`} className="hover:underline">{post.name}</Link>
                                </h3>

                                <p className="text-gray-600 mb-4 line-clamp-3 text-sm flex-1">
                                    {post.excerpt}
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                                    <div className="flex items-center gap-3">
                                        <div className="flex flex-wrap gap-1">
                                            {post.tags?.slice(0, 2).map(tag => (
                                                <span key={tag.id} className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-500">#{tag.name}</span>
                                            ))}
                                        </div>
                                        <span className="flex items-center gap-1 text-[10px] text-gray-400">
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            {post.view_count}
                                        </span>
                                    </div>

                                    <Link
                                        href={`/home/posts/${post.slug}`}
                                        className="text-primary hover:text-primary-dark hover:bg-primary/5 px-3 py-1.5 rounded text-sm font-medium transition-colors"
                                    >
                                        Đọc tiếp →
                                    </Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}

            {!isLoading && posts.length === 0 && (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                    <p className="text-xl font-medium text-gray-900">Không tìm thấy bài viết nào.</p>
                </div>
            )}
        </>
    );
}
