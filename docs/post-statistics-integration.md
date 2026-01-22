# Post Statistics Integration

## Tổng quan
Đã tích hợp trang thống kê bài viết (Post Statistics) vào hệ thống admin theo tài liệu API mới.

## Các thay đổi đã thực hiện

### 1. API Endpoints (`src/lib/api/endpoints/admin.ts`)
Thêm 2 endpoints mới cho thống kê:
- `posts.stats(id)`: Lấy thống kê lượt xem theo ngày của một bài viết
- `posts.overview`: Lấy thống kê tổng quan hệ thống

### 2. Types (`src/types/api.ts`)
Thêm 2 interfaces mới:
- `PostViewStats`: Dữ liệu thống kê lượt xem theo ngày
- `PostStatisticsOverview`: Dữ liệu tổng quan hệ thống

### 3. Page Route (`src/app/(dashboard)/admin/posts/statistics/page.tsx`)
Tạo route mới cho trang thống kê tại `/admin/posts/statistics`

### 4. Component (`src/components/admin/Posts/AdminPostStatistics.tsx`)
Component chính với các tính năng:
- **Overview Cards**: 7 thẻ thống kê tổng quan với gradient và animation
- **Doughnut Charts**: 2 biểu đồ tròn cho phân bố trạng thái bài viết và bình luận
- **Top Posts**: Danh sách top 10 bài viết được xem nhiều nhất
- **Individual Stats**: Thống kê chi tiết theo bài viết với line chart
- **Date Filtering**: Lọc theo khoảng thời gian

### 5. Styles (`src/components/admin/Posts/AdminPostStatistics.css`)
CSS với thiết kế hiện đại:
- Gradient backgrounds
- Smooth animations (fadeInDown, fadeInUp)
- Hover effects
- Responsive design
- Premium color schemes

## Dependencies đã cài đặt
```bash
npm install date-fns chart.js react-chartjs-2
```

## Tính năng chính

### 1. Thống kê tổng quan
- Tổng số bài viết
- Bài viết đã xuất bản
- Bản nháp
- Đã lên lịch
- Tổng bình luận
- Bình luận chờ duyệt
- Lượt xem 30 ngày gần nhất

### 2. Biểu đồ phân bố
- Phân bố trạng thái bài viết (Doughnut chart)
- Trạng thái bình luận (Doughnut chart)

### 3. Top bài viết
- Hiển thị top 10 bài viết có lượt xem cao nhất
- Link trực tiếp đến trang edit bài viết
- Hiển thị ngày xuất bản và số lượt xem

### 4. Thống kê chi tiết
- Chọn bài viết từ dropdown
- Lọc theo khoảng thời gian (start_date, end_date)
- Line chart hiển thị lượt xem theo ngày
- Tổng lượt xem và trung bình/ngày

## Menu Configuration
Theo tài liệu, menu đã được cấu hình:
```javascript
{
  code: 'post-stats',
  name: 'Thống kê bài viết',
  path: '/admin/posts/statistics',
  api_path: 'api/admin/posts/statistics',
  icon: '📈',
  type: MenuType.route,
  status: BasicStatus.active,
  parent_code: 'post-management',
  sort_order: 50,
  is_public: false,
  show_in_menu: true,
  permission_code: 'post.manage',
}
```

## Design Highlights
- **Modern & Premium**: Gradient colors, smooth animations
- **Interactive**: Hover effects, transitions
- **Responsive**: Mobile-friendly layout
- **Accessible**: Proper labels, semantic HTML
- **Performance**: Optimized chart rendering

## API Response Format

### Overview Response
```json
{
  "success": true,
  "data": {
    "total_posts": 150,
    "published_posts": 120,
    "draft_posts": 25,
    "scheduled_posts": 5,
    "total_comments": 450,
    "pending_comments": 12,
    "total_views_last_30_days": 15230,
    "top_viewed_posts": [...]
  }
}
```

### Post Stats Response
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "post_id": "1",
      "view_date": "2024-01-20",
      "view_count": 150,
      "updated_at": "2024-01-20T23:59:59.000Z"
    }
  ]
}
```

## Lưu ý
- Tất cả ID đều là string để tránh lỗi BigInt
- Sử dụng Chart.js v4 với react-chartjs-2
- Date formatting sử dụng date-fns với locale tiếng Việt
- Component hoàn toàn client-side ('use client')
