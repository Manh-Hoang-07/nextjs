"use client";

import { useState } from "react";

export default function BannersDemoPage() {
  const [selectedLocation, setSelectedLocation] = useState("");

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Banner Components Demo</h1>
      
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">Chọn vị trí banner:</label>
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">-- Chọn vị trí --</option>
          <option value="home_slider">Slider trang chủ</option>
          <option value="product_page_banner">Banner trang sản phẩm</option>
          <option value="product_detail_banner">Banner chi tiết sản phẩm</option>
          <option value="about_us_banner">Banner giới thiệu</option>
          <option value="contact_banner">Banner liên hệ</option>
          <option value="blog_banner">Banner blog</option>
          <option value="checkout_banner">Banner thanh toán</option>
          <option value="sidebar_banner">Banner sidebar</option>
        </select>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Cách sử dụng</h2>
        <p className="text-gray-600">Banner demo component needed from @/components/public/banners</p>
      </div>
    </div>
  );
}

