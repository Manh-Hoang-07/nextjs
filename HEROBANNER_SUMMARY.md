# ✅ HeroBanner Component - Hoàn thành!

## 📦 Files đã tạo

1. **Component chính**: `src/components/public/banners/HeroBanner.tsx`
2. **Type exports**: `src/components/public/banners/index.ts`
3. **Demo page**: `src/app/(public)/demo/banner/page.tsx`
4. **Documentation**: `src/components/public/banners/README.md`
5. **Integration examples**: `src/components/public/banners/INTEGRATION_EXAMPLE.tsx`

## 🎯 Tính năng chính

✅ **Chỉ 1 nút duy nhất** từ `button_text`, `link`, `link_target`
✅ **Tự động ẩn** nếu API không trả về data
✅ **3 cách sử dụng**: Static data, API by location, API by ID
✅ **Responsive** trên mọi thiết bị
✅ **Loading skeleton** đẹp mắt
✅ **Customizable** màu sắc và layout

## 🚀 Cách sử dụng nhanh

### 1. Import component

\`\`\`tsx
import HeroBanner from "@/components/public/banners/HeroBanner";
\`\`\`

### 2. Sử dụng với Static Data

\`\`\`tsx
<HeroBanner
  data={{
    title: "Công Ty Xây Dựng",
    subtitle: "Uy Tín & Chất Lượng",
    description: "Chúng tôi cam kết mang đến những công trình chất lượng...",
    image: "/images/construction.jpg",
    button_text: "Khám Phá Dự Án",
    link: "/projects",
    link_target: "_self",
  }}
/>
\`\`\`

### 3. Lấy từ API theo Location Code

\`\`\`tsx
<HeroBanner locationCode="homepage_hero" />
\`\`\`

### 4. Lấy từ API theo Banner ID

\`\`\`tsx
<HeroBanner bannerId={1} />
\`\`\`

## 📋 Cấu trúc API Response

API cần trả về format sau:

\`\`\`json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Công Ty Xây Dựng",
    "subtitle": "Uy Tín & Chất Lượng",
    "description": "Chúng tôi cam kết...",
    "image": "/storage/banners/construction.jpg",
    "button_text": "Khám Phá Dự Án",
    "link": "/projects",
    "link_target": "_self",
    "metadata": {
      "title_color": "#2563EB",
      "subtitle_color": "#1F2937",
      "description_color": "#6B7280",
      "background_color": "#F9FAFB"
    }
  }
}
\`\`\`

## 🔧 Tích hợp vào trang chủ

### Bước 1: Mở file `src/components/home/HomePageContent.tsx`

### Bước 2: Thêm import

\`\`\`tsx
import HeroBanner from "@/components/public/banners/HeroBanner";
\`\`\`

### Bước 3: Thêm vào component

\`\`\`tsx
export default function HomePageContent() {
  // ... existing code ...

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Thêm Hero Banner ở đây */}
      <HeroBanner locationCode="homepage_hero" containerClass="mb-8" />

      {/* Phần content hiện tại */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Featured Comics Slider */}
        <section className="mb-8">
          ...
        </section>
      </div>
    </div>
  );
}
\`\`\`

## 🎨 Tạo Banner trong Admin

### Bước 1: Vào trang Admin Banners
Truy cập: `http://localhost:3000/admin/banners`

### Bước 2: Tạo Banner mới
Click "Thêm banner mới" và điền thông tin:

- **Title**: Công Ty Xây Dựng
- **Subtitle**: Uy Tín & Chất Lượng
- **Description**: Chúng tôi cam kết mang đến những công trình chất lượng, bền vững và đẳng cấp.
- **Image**: Upload hình ảnh (tỷ lệ 4:3 recommended)
- **Button Text**: Khám Phá Dự Án
- **Link**: /home/projects
- **Link Target**: _self (hoặc _blank để mở tab mới)
- **Location**: Chọn "homepage_hero" (hoặc location code bạn muốn)
- **Status**: Active

### Bước 3: (Optional) Thêm màu sắc custom trong Metadata

\`\`\`json
{
  "title_color": "#2563EB",
  "subtitle_color": "#1F2937",
  "description_color": "#6B7280",
  "background_color": "#F9FAFB"
}
\`\`\`

## 📱 Test Component

### 1. Xem Demo Page
Truy cập: `http://localhost:3000/demo/banner`

### 2. Test trên trang chủ
Truy cập: `http://localhost:3000/home`

### 3. Test responsive
- Resize browser window
- Test trên mobile device
- Kiểm tra loading state
- Kiểm tra khi không có data

## ⚠️ Lưu ý quan trọng

1. **Nếu API không trả về data** → Banner tự động ẩn (return null)
2. **Chỉ có 1 nút** → Từ `button_text`, `link`, `link_target`
3. **Không có button_text hoặc link** → Nút sẽ không hiển thị
4. **Hình ảnh** → Nên dùng tỷ lệ 4:3, tối thiểu 1200x900px
5. **Màu sắc** → Có thể custom qua props hoặc metadata

## 🎯 Props Available

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `data` | `HeroBannerData` | `undefined` | No | Truyền data trực tiếp |
| `locationCode` | `string` | `undefined` | No | Lấy từ API theo location |
| `bannerId` | `number` | `undefined` | No | Lấy từ API theo ID |
| `containerClass` | `string` | `""` | No | Custom CSS class |
| `imagePosition` | `"left" \| "right"` | `"right"` | No | Vị trí hình ảnh |
| `showSkeleton` | `boolean` | `true` | No | Hiển thị skeleton loading |

## 📚 Tài liệu chi tiết

- **README**: `src/components/public/banners/README.md`
- **Integration Examples**: `src/components/public/banners/INTEGRATION_EXAMPLE.tsx`
- **Demo Page**: `http://localhost:3000/demo/banner`

## ✨ Next Steps

1. ✅ Component đã sẵn sàng sử dụng
2. 🎨 Tạo banner trong Admin panel
3. 🏠 Tích hợp vào trang chủ
4. 📱 Test trên nhiều thiết bị
5. 🚀 Deploy lên production

---

**Chúc bạn sử dụng component thành công! 🎉**
