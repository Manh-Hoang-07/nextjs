import { Metadata } from "next";
import BirthdayContent from "./BirthdayContent";

export const metadata: Metadata = {
    title: "Chúc Mừng Sinh Nhật 1 Tuổi - Vũ Gia Huy",
    description: "Kỷ niệm hành trình một năm đầu đời của Vũ Gia Huy - 24/01/2025",
    openGraph: {
        title: "Chúc Mừng Sinh Nhật 1 Tuổi - Vũ Gia Huy",
        description: "Kỷ niệm hành trình một năm đầu đời của Vũ Gia Huy - 24/01/2025",
        images: ["/images/baby_1.jpg"],
    },
};

export default function BirthdayHomePage() {
    return <BirthdayContent />;
}
