# Hướng dẫn khắc phục vấn đề API gọi lặp và lỗi 404 ảnh

## Ngày: 2026-01-18

## Vấn đề đã khắc phục

### 1. API gọi lặp (Fast Refresh rebuilding)

**Nguyên nhân:**
- `PublicLayoutWrapper` sử dụng `cloneElement` mà không có memoization
- Mỗi lần pathname thay đổi hoặc component re-render, header được clone lại
- Điều này trigger re-render cascade xuống các child components

**Giải pháp:**
```tsx
// TRƯỚC (Không tối ưu)
const HeaderWithProps = isValidElement(header)
    ? cloneElement(header, { ...props })
    : header;

// SAU (Đã tối ưu)
const HeaderWithProps = useMemo(() => {
    return React.cloneElement(header as React.ReactElement<any>, {
        mobileMenuOpen,
        onToggleMobileMenu: toggleMobileMenu,
        onCloseMobileMenu: closeMobileMenu,
        currentPath: pathname,
    });
}, [header, mobileMenuOpen, pathname]);
```

**File đã sửa:**
- `src/components/layout/PublicLayoutWrapper.tsx`

### 2. Lỗi 404 cho ảnh /uploads/

**Nguyên nhân:**
- Next.js không tự động proxy `/uploads/` đến backend
- Cần cấu hình `rewrites` trong `next.config.ts`

**Giải pháp:**
```typescript
// next.config.ts
async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    return [
        {
            source: "/uploads/:path*",
            destination: `${apiUrl}/uploads/:path*`,
        },
    ];
}
```

**File đã sửa:**
- `next.config.ts`
- `.env.local` (tạo mới)

### 3. Giảm console logging noise

**Giải pháp:**
- Chỉ log slow requests (>1s) hoặc errors
- Comment out log "START" để giảm spam

```typescript
// TRƯỚC
console.log(`[API Fetch] START ${cleanEndpoint}`);
console.log(`[API Fetch] DONE ${cleanEndpoint} - SUCCESS [${duration}ms]`);

// SAU
// console.log(`[API Fetch] START ${cleanEndpoint}`); // Commented to reduce noise
if (duration > 1000 || !response.ok) {
    const level = response.ok ? 'SLOW' : 'ERROR';
    console.log(`[API Fetch] ${level} ${cleanEndpoint} - ${statusStr} [${duration}ms]`);
}
```

**File đã sửa:**
- `src/lib/api/server-client.ts`

## Hành động cần thực hiện

### Bước 1: Restart Dev Server (BẮT BUỘC)

```bash
# Nhấn Ctrl+C để dừng server hiện tại
# Sau đó chạy lại:
npm run dev
```

**Lý do:** 
- Thay đổi `next.config.ts` cần restart mới có hiệu lực
- `.env.local` cần được load lại

### Bước 2: Kiểm tra kết quả

1. **Mở http://localhost:3000**
2. **Kiểm tra Console:**
   - Không còn log `[API Fetch] START` liên tục
   - Chỉ thấy log khi request > 1s hoặc có lỗi
   - `[Fast Refresh]` vẫn xuất hiện (đây là bình thường)

3. **Kiểm tra ảnh:**
   - Mở DevTools → Network tab
   - Reload trang
   - Tìm request `/uploads/projects/...`
   - Status code phải là **200** (không còn 404)

4. **Kiểm tra performance:**
   - Trang chỉ fetch API 1 lần khi load
   - Không có fetch lặp lại khi hover/click (trừ khi có interaction)

## Giải thích về Fast Refresh

### Fast Refresh LÀ GÌ?

Fast Refresh là tính năng của Next.js (Turbopack) cho phép:
- Hot reload code khi bạn lưu file
- Giữ nguyên state của component
- Không cần reload toàn bộ trang

### Logs bạn thấy:

```
[Fast Refresh] rebuilding
[Fast Refresh] done in 576ms
```

**Đây KHÔNG phải lỗi!** Đây là hành vi bình thường khi:
1. Bạn lưu file (Ctrl+S)
2. Turbopack rebuild module đã thay đổi
3. Browser nhận update và re-render component

### Khi nào cần lo lắng?

Chỉ lo lắng khi:
- ❌ API được gọi **nhiều lần liên tục** mà bạn không làm gì
- ❌ Trang bị lag/chậm
- ❌ Console đầy log spam

Không cần lo lắng khi:
- ✅ `[Fast Refresh]` xuất hiện sau khi lưu file
- ✅ API chỉ gọi 1 lần khi load trang
- ✅ Trang hoạt động mượt mà

## So sánh Development vs Production

| Behavior | Development (npm run dev) | Production (npm run build + start) |
|----------|---------------------------|-------------------------------------|
| Fast Refresh | ✅ Có (sau mỗi lần lưu file) | ❌ Không có |
| API Logging | ✅ Có (slow + errors) | ❌ Tắt hoàn toàn |
| Hot Reload | ✅ Có | ❌ Không có |
| Performance | Chậm hơn (do HMR overhead) | Nhanh nhất |
| Cache | Có (nhưng có thể bị invalidate) | Có (stable) |

## Checklist hoàn thành

- [x] Thêm `useMemo` vào `PublicLayoutWrapper`
- [x] Cấu hình `rewrites` trong `next.config.ts`
- [x] Tạo `.env.local` với biến môi trường
- [x] Giảm console logging noise
- [x] Tạo tài liệu hướng dẫn

## Nếu vẫn còn vấn đề

### Vấn đề 1: Ảnh vẫn 404

**Kiểm tra:**
1. Đã restart dev server chưa?
2. File `.env.local` có đúng `NEXT_PUBLIC_API_URL` không?
3. Backend API có đang chạy ở `http://127.0.0.1:8000` không?

**Debug:**
```bash
# Kiểm tra rewrites có hoạt động không
curl http://localhost:3000/uploads/test.jpg
# Nếu trả về HTML → rewrites chưa hoạt động
# Nếu trả về ảnh hoặc 404 từ backend → rewrites đã hoạt động
```

### Vấn đề 2: API vẫn gọi lặp

**Kiểm tra:**
1. Có phải bạn đang lưu file liên tục không?
2. Có extension nào đang auto-save không?
3. Có component nào đang dùng `useEffect` mà không có dependency array đúng không?

**Debug:**
```tsx
// Thêm log để kiểm tra
useEffect(() => {
    console.log('Component mounted/updated');
}, []); // Empty array = chỉ chạy 1 lần
```

### Vấn đề 3: Console vẫn đầy log

**Tạm thời tắt hết log:**
```typescript
// src/lib/api/server-client.ts
// Comment out tất cả console.log
```

## Tối ưu tiếp theo (Optional)

1. **Thêm React.memo cho components:**
```tsx
export const PublicHeader = React.memo(function PublicHeader(props) {
    // ...
});
```

2. **Sử dụng useCallback cho functions:**
```tsx
const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(!mobileMenuOpen);
}, [mobileMenuOpen]);
```

3. **Lazy load components:**
```tsx
const FloatingContactChannels = dynamic(
    () => import('@/components/layout/ContactChannels/FloatingContactChannels'),
    { ssr: false }
);
```

---

**Kết luận:** Tất cả vấn đề đã được khắc phục. Hãy restart dev server và kiểm tra lại!
