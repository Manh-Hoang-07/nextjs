import { Metadata } from "next";
import FAQsClient from "./FAQsClient";

export const metadata: Metadata = {
  title: "Câu hỏi thường gặp",
  description: "Tìm câu trả lời cho các câu hỏi phổ biến về dịch vụ của chúng tôi.",
};

export default function FAQsPage() {
  return <FAQsClient />;
}