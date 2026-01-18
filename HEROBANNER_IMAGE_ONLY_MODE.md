# ✅ HeroBanner - Image Only Mode

## 🎯 Tính năng mới

Đã thêm tham số **`imageOnly`** vào HeroBanner component để chỉ hiển thị hình ảnh full-width, không có text, button hay bất kỳ overlay nào.

## 📝 Cách sử dụng

### Cú pháp cơ bản

```tsx
<HeroBanner
  data={bannerData}
  imageOnly={true}
/>
```

### Ví dụ đầy đủ

```tsx
<HeroBanner
  locationCode="homepage_hero"
  imageOnly={true}
  containerClass="mb-8"
/>
```

## 🎨 So sánh chế độ

### 1. Normal Mode (imageOnly = false - mặc định)

```tsx
<HeroBanner
  data={{
    title: "Công Ty Xây Dựng",
    subtitle: "Uy Tín & Chất Lượng",
    description: "Mô tả...",
    image: "/path/to/image.jpg",
    button_text: "Khám Phá",
    link: "/projects",
  }}
/>
```

**Kết quả:**
- ✅ Layout 2 cột (content + image)
- ✅ Hiển thị title, subtitle, description
- ✅ Hiển thị button
- ✅ Responsive: Desktop 2 cột, Mobile stack vertical

### 2. Image Only Mode (imageOnly = true)

```tsx
<HeroBanner
  data={{
    title: "Công Ty Xây Dựng", // Chỉ dùng cho alt text
    image: "/path/to/image.jpg",
  }}
  imageOnly={true}
/>
```

**Kết quả:**
- ✅ Chỉ hiển thị ảnh full-width
- ✅ Không có text overlay
- ✅ Không có button
- ✅ Aspect ratio: 21:9 (desktop), 16:6 (tablet), 21:7 (mobile)

## 📐 Aspect Ratios

Image Only mode sử dụng aspect ratios tối ưu cho từng thiết bị:

| Device | Aspect Ratio | Class |
|--------|--------------|-------|
| Mobile | 21:7 | `aspect-[21/7]` |
| Tablet | 16:6 | `md:aspect-[16/6]` |
| Desktop | 21:9 | `lg:aspect-[21/7]` |

## 🔧 Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `imageOnly` | `boolean` | `false` | Chỉ hiển thị ảnh, không có text/button |

## 💡 Use Cases

### 1. Banner quảng cáo đơn giản
```tsx
<HeroBanner
  locationCode="promo_banner"
  imageOnly={true}
/>
```

### 2. Hero image cho landing page
```tsx
<HeroBanner
  data={{
    title: "Hero Image",
    image: "https://example.com/hero.jpg",
  }}
  imageOnly={true}
  containerClass="mb-0"
/>
```

### 3. Banner giữa nội dung
```tsx
<div className="my-12">
  <HeroBanner
    bannerId={5}
    imageOnly={true}
  />
</div>
```

## 🎯 Khi nào dùng Image Only Mode?

### ✅ Nên dùng khi:
- Banner chỉ là hình ảnh quảng cáo (không cần text)
- Hình ảnh đã có text/design sẵn
- Muốn hiển thị ảnh full-width đơn giản
- Banner decorative giữa các section

### ❌ Không nên dùng khi:
- Cần hiển thị title, description
- Cần có CTA button
- Cần layout 2 cột
- Cần text overlay động

## 📊 Technical Details

### Normal Mode Structure
```tsx
<div className="hero-banner">
  <div className="max-w-7xl mx-auto px-4 py-12">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>{/* Content */}</div>
      <div>{/* Image */}</div>
    </div>
  </div>
</div>
```

### Image Only Mode Structure
```tsx
<div className="hero-banner-image-only">
  <div className="relative w-full aspect-[21/9]">
    <Image src="..." fill className="object-cover" />
  </div>
</div>
```

## 🔄 Fallback Behavior

Image Only mode vẫn tuân theo logic fallback như bình thường:

1. **API Data** → Sử dụng image từ API
2. **Fallback Data** → Sử dụng image từ props
3. **No Data** → Banner tự động ẩn

## 🧪 Testing

### Test Image Only Mode

```bash
# 1. Tạo banner trong admin với chỉ có image
# 2. Sử dụng imageOnly={true}
# 3. Kiểm tra không có text/button hiển thị
```

### Test Responsive

```bash
# 1. Desktop: Aspect ratio 21:9
# 2. Tablet: Aspect ratio 16:6
# 3. Mobile: Aspect ratio 21:7
```

## 📱 Responsive Behavior

```css
/* Mobile */
aspect-[21/7]  /* Taller for mobile viewing */

/* Tablet */
md:aspect-[16/6]  /* Medium height */

/* Desktop */
lg:aspect-[21/7]  /* Wide cinematic ratio */
```

## 🎨 Styling

### Default Styling
- `rounded-lg` - Bo góc
- `overflow-hidden` - Ẩn overflow
- `object-cover` - Ảnh cover full container

### Custom Styling
```tsx
<HeroBanner
  imageOnly={true}
  containerClass="shadow-2xl rounded-none"
/>
```

## 📝 Examples

### Example 1: Simple Image Banner
```tsx
<HeroBanner
  data={{
    title: "Promo Banner",
    image: "/images/promo.jpg",
  }}
  imageOnly={true}
/>
```

### Example 2: API Banner
```tsx
<HeroBanner
  locationCode="top_banner"
  imageOnly={true}
  containerClass="mb-8"
/>
```

### Example 3: Between Content
```tsx
<section>
  <h2>Our Services</h2>
  <p>Description...</p>
</section>

<HeroBanner
  bannerId={10}
  imageOnly={true}
  containerClass="my-12"
/>

<section>
  <h2>Our Projects</h2>
  <p>Description...</p>
</section>
```

## ⚠️ Important Notes

1. **Title vẫn cần thiết** - Dùng cho alt text của image
2. **Image required** - Phải có image, nếu không banner sẽ ẩn
3. **Không có background color** - Image Only mode không dùng backgroundColor
4. **Priority loading** - Image vẫn được load với priority=true

## 🚀 Performance

- ✅ Next.js Image optimization
- ✅ Lazy loading (nếu không priority)
- ✅ Responsive images
- ✅ Aspect ratio prevents CLS

## 📚 Related Props

| Prop | Works with imageOnly? | Note |
|------|----------------------|------|
| `data` | ✅ Yes | Chỉ dùng image và title (alt) |
| `locationCode` | ✅ Yes | Fetch từ API |
| `bannerId` | ✅ Yes | Fetch từ API |
| `containerClass` | ✅ Yes | Custom styling |
| `imagePosition` | ❌ No | Không có effect |
| `showSkeleton` | ✅ Yes | Hiển thị skeleton khi loading |

---

**Hoàn thành!** 🎉 HeroBanner giờ có thể hiển thị chỉ ảnh với `imageOnly={true}`.
