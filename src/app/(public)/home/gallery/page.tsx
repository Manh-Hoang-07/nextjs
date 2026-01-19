import { Metadata } from "next";
import GalleryClient from "./GalleryClient";

export const metadata: Metadata = {
  title: "Thư viện dự án",
  description: "Khám phá các thiết kế và giải pháp xây dựng tiêu biểu của chúng tôi.",
};

export default function GalleryPage() {
  return <GalleryClient />;
}