# HeroBanner Component

Component banner hero cao cấp với thiết kế hiện đại, hỗ trợ nhiều cách sử dụng linh hoạt.

## 🎨 Tính năng

- ✅ **3 cách sử dụng**: Static data, API by location code, API by banner ID
- ✅ **Responsive**: Tự động điều chỉnh trên mọi thiết bị
- ✅ **Customizable**: Tùy chỉnh màu sắc, vị trí hình ảnh, buttons
- ✅ **Loading State**: Skeleton loading đẹp mắt
- ✅ **Error Handling**: Xử lý lỗi gracefully
- ✅ **SEO Friendly**: Sử dụng Next.js Image optimization
- ✅ **Accessibility**: Hỗ trợ screen readers và keyboard navigation

## 📦 Installation

Component đã được tích hợp sẵn trong project. Import và sử dụng:

\`\`\`tsx
import HeroBanner from "@/components/public/banners/HeroBanner";
import type { HeroBannerData } from "@/components/public/banners";
\`\`\`

## 🚀 Cách sử dụng

### 1. Sử dụng với Static Data

\`\`\`tsx
const bannerData: HeroBannerData = {
  title: "Công Ty Xây Dựng",
  subtitle: "Uy Tín & Chất Lượng",
  description: "Chúng tôi cam kết mang đến những công trình chất lượng, bền vững và đẳng cấp.",
  image: "/images/construction-site.jpg",
  primaryButton: {
    text: "Khám Phá Dự Án",
    link: "/projects",
  },
  secondaryButton: {
    text: "Liên Hệ Ngay",
    link: "/contact",
  },
  titleColor: "#2563EB",
  subtitleColor: "#1F2937",
  descriptionColor: "#6B7280",
  backgroundColor: "#F9FAFB",
};

<HeroBanner data={bannerData} />
\`\`\`

### 2. Lấy từ API theo Location Code

\`\`\`tsx
<HeroBanner locationCode="homepage_hero" />
\`\`\`

### 3. Lấy từ API theo Banner ID

\`\`\`tsx
<HeroBanner bannerId={1} />
\`\`\`

### 4. Tùy chỉnh vị trí hình ảnh

\`\`\`tsx
<HeroBanner 
  locationCode="homepage_hero"
  imagePosition="left"  // Mặc định là "right"
/>
\`\`\`

### 5. Custom styling

\`\`\`tsx
<HeroBanner 
  locationCode="homepage_hero"
  containerClass="shadow-2xl my-8"
/>
\`\`\`

## 📋 Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `HeroBannerData` | `undefined` | Truyền data trực tiếp vào component |
| `locationCode` | `string` | `undefined` | Lấy banner từ API theo location code |
| `bannerId` | `number` | `undefined` | Lấy banner từ API theo ID |
| `containerClass` | `string` | `""` | Custom CSS class cho container |
| `imagePosition` | `"left" \| "right"` | `"right"` | Vị trí hiển thị hình ảnh |
| `showSkeleton` | `boolean` | `true` | Hiển thị skeleton khi loading |

## 🎯 HeroBannerData Interface

\`\`\`typescript
interface HeroBannerData {
  id?: number;
  title: string;                    // Tiêu đề chính (bắt buộc)
  subtitle?: string;                // Phụ đề
  description?: string;             // Mô tả
  image: string;                    // Đường dẫn hình ảnh (bắt buộc)
  primaryButton?: BannerButton;     // Nút chính
  secondaryButton?: BannerButton;   // Nút phụ
  titleColor?: string;              // Màu tiêu đề (hex)
  subtitleColor?: string;           // Màu phụ đề (hex)
  descriptionColor?: string;        // Màu mô tả (hex)
  backgroundColor?: string;         // Màu nền (hex)
}

interface BannerButton {
  text: string;                     // Text hiển thị trên nút
  link: string;                     // Đường dẫn
  target?: string;                  // "_self" hoặc "_blank"
  variant?: "primary" | "secondary";
}
\`\`\`

## 🔌 API Integration

### Cấu trúc API Response

Component tự động transform API response. API cần trả về format sau:

\`\`\`json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Công Ty Xây Dựng",
    "subtitle": "Uy Tín & Chất Lượng",
    "description": "Chúng tôi cam kết mang đến những công trình chất lượng...",
    "image": "/storage/banners/construction.jpg",
    "button_text": "Khám Phá Dự Án",
    "link": "/projects",
    "link_target": "_self",
    "metadata": {
      "secondary_button": {
        "text": "Liên Hệ Ngay",
        "link": "/contact",
        "target": "_self"
      },
      "title_color": "#2563EB",
      "subtitle_color": "#1F2937",
      "description_color": "#6B7280",
      "background_color": "#F9FAFB"
    }
  }
}
\`\`\`

### API Endpoints được sử dụng

- **By Location**: `GET /api/public/banners/location/{locationCode}`
- **By ID**: `GET /api/public/banners/{id}`

## 🎨 Thiết kế

Component được thiết kế dựa trên:
- **Desktop**: 2 cột (content + image)
- **Mobile**: Stack vertical (content trên, image dưới)
- **Responsive breakpoints**: Tailwind CSS breakpoints
- **Animation**: Smooth transitions và hover effects

## 📱 Responsive Behavior

- **Mobile (< 768px)**: Stack vertical, full width
- **Tablet (768px - 1024px)**: 2 cột với spacing vừa phải
- **Desktop (> 1024px)**: 2 cột với spacing rộng, max-width container

## 🎭 States

1. **Loading**: Hiển thị skeleton animation
2. **Error**: Hiển thị thông báo lỗi với styling đẹp
3. **Empty**: Không hiển thị gì (return null)
4. **Success**: Hiển thị banner đầy đủ

## 💡 Best Practices

1. **Hình ảnh**: Sử dụng hình ảnh tỷ lệ 4:3, tối thiểu 1200x900px
2. **Tiêu đề**: Ngắn gọn, tối đa 2 dòng
3. **Mô tả**: Tối đa 3-4 dòng
4. **Buttons**: Tối đa 2 nút (primary + secondary)
5. **Màu sắc**: Sử dụng màu tương phản để dễ đọc

## 🔧 Customization Examples

### Thay đổi màu sắc

\`\`\`tsx
<HeroBanner 
  data={{
    ...bannerData,
    titleColor: "#DC2626",        // Red
    subtitleColor: "#1F2937",     // Dark gray
    backgroundColor: "#FEF2F2",   // Light red
  }}
/>
\`\`\`

### Chỉ có 1 nút

\`\`\`tsx
<HeroBanner 
  data={{
    ...bannerData,
    primaryButton: {
      text: "Bắt Đầu Ngay",
      link: "/get-started",
    },
    secondaryButton: undefined,  // Không có nút phụ
  }}
/>
\`\`\`

## 🐛 Troubleshooting

### Hình ảnh không hiển thị
- Kiểm tra đường dẫn hình ảnh
- Đảm bảo `NEXT_PUBLIC_API_BASE_URL` được cấu hình đúng
- Kiểm tra CORS nếu hình ảnh từ external domain

### API không trả về data
- Kiểm tra network tab trong DevTools
- Xem console log để debug
- Đảm bảo API endpoint đúng format

## 📄 License

MIT © Your Company Name

## 👥 Contributors

- Your Name - Initial work

## 📞 Support

Nếu có vấn đề, vui lòng tạo issue hoặc liên hệ team.
