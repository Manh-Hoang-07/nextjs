# Hướng dẫn Cache System Config

## Tổng quan

System Config (`system-configs/general`) là dữ liệu cấu hình chung của toàn bộ website (tên site, logo, thông tin liên hệ, v.v.). Dữ liệu này **ít khi thay đổi** nên được cache lâu để tối ưu hiệu năng.

## Cấu hình Cache hiện tại

### Thời gian cache: **2 giờ (7200 giây)**

```typescript
// src/lib/api/public.ts
export async function getSystemConfig(group: string = "general") {
    const { data } = await serverFetch<SystemConfig>(
        publicEndpoints.systemConfigs.getByGroup(group), 
        {
            revalidate: 7200, // Cache 2 giờ
            tags: ["system-config", `system-config-${group}`],
            skipCookies: true
        }
    );
    return data;
}
```

### Lợi ích:
- ✅ **Giảm tải API**: Mỗi 2 giờ chỉ gọi API 1 lần (thay vì mỗi request)
- ✅ **Tăng tốc độ**: TTFB giảm từ ~300ms → <10ms (lấy từ cache)
- ✅ **Tiết kiệm băng thông**: Giảm 99% request đến backend
- ✅ **SEO tốt hơn**: Trang load nhanh hơn

## Khi nào cache được refresh?

### 1. Tự động (ISR - Incremental Static Regeneration)
Cache sẽ tự động refresh sau **2 giờ** kể từ lần fetch đầu tiên.

**Ví dụ:**
- 10:00 - User A truy cập → Fetch API → Cache lưu đến 12:00
- 10:30 - User B truy cập → Lấy từ cache (không gọi API)
- 11:00 - User C truy cập → Lấy từ cache (không gọi API)
- 12:01 - User D truy cập → Cache hết hạn → Fetch API mới → Cache lưu đến 14:01

### 2. Thủ công (On-demand Revalidation)
Khi admin cập nhật system config, có thể **force refresh** cache ngay lập tức.

## Cách force refresh cache (On-demand)

### Từ Backend (NestJS)

Sau khi admin cập nhật system config, gọi API revalidate của Next.js:

```typescript
// NestJS - system-configs.service.ts
async updateSystemConfig(group: string, data: any) {
    // 1. Cập nhật database
    const updated = await this.systemConfigRepository.update(group, data);
    
    // 2. Revalidate cache Next.js
    await this.revalidateNextjsCache(`system-config-${group}`);
    
    return updated;
}

private async revalidateNextjsCache(tag: string) {
    try {
        const nextjsUrl = process.env.NEXTJS_URL || 'http://localhost:3000';
        const secret = process.env.REVALIDATE_SECRET;
        
        await fetch(`${nextjsUrl}/api/revalidate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-revalidate-secret': secret,
            },
            body: JSON.stringify({ tag }),
        });
        
        console.log(`✅ Revalidated Next.js cache: ${tag}`);
    } catch (error) {
        console.error('❌ Failed to revalidate Next.js cache:', error);
    }
}
```

### Từ Postman/cURL (Manual)

```bash
# Revalidate tất cả system config
curl -X POST http://localhost:3000/api/revalidate \
  -H "Content-Type: application/json" \
  -H "x-revalidate-secret: your-super-secret-key-change-this-in-production" \
  -d '{"tag": "system-config"}'

# Revalidate chỉ group "general"
curl -X POST http://localhost:3000/api/revalidate \
  -H "Content-Type: application/json" \
  -H "x-revalidate-secret: your-super-secret-key-change-this-in-production" \
  -d '{"tag": "system-config-general"}'
```

**Response thành công:**
```json
{
  "success": true,
  "message": "Revalidated tag: system-config-general",
  "timestamp": "2026-01-18T15:45:00.000Z"
}
```

## Cấu hình môi trường

### File `.env.local` (Next.js)

```env
# Revalidate Secret (phải giống với Backend)
REVALIDATE_SECRET=your-super-secret-key-change-this-in-production
```

### File `.env` (NestJS Backend)

```env
# Next.js URL
NEXTJS_URL=http://localhost:3000

# Revalidate Secret (phải giống với Next.js)
REVALIDATE_SECRET=your-super-secret-key-change-this-in-production
```

⚠️ **Quan trọng:** Đổi `REVALIDATE_SECRET` thành key phức tạp trong production!

## Monitoring & Debug

### Kiểm tra cache có hoạt động không?

1. **Mở DevTools → Network tab**
2. **Reload trang lần 1** → Thấy request đến API backend (slow)
3. **Reload trang lần 2** → Không thấy request (fast) → Cache đang hoạt động ✅

### Kiểm tra thời gian cache còn lại

Next.js không expose thông tin này trực tiếp, nhưng bạn có thể:
- Xem response headers: `x-nextjs-cache: HIT` hoặc `MISS`
- Log timestamp trong component (dev mode)

### Logs trong server console

```bash
# Khi cache HIT (lấy từ cache)
[Cache] HIT system-config-general

# Khi cache MISS (fetch API mới)
[API Fetch] SLOW GET public/system-configs/general - SUCCESS [423ms]
```

## Tùy chỉnh thời gian cache

### Nếu muốn cache lâu hơn (4 giờ):

```typescript
// src/lib/api/public.ts
revalidate: 14400, // 4 giờ
```

### Nếu muốn cache ngắn hơn (30 phút):

```typescript
// src/lib/api/public.ts
revalidate: 1800, // 30 phút
```

### Nếu muốn tắt cache (không khuyến khích):

```typescript
// src/lib/api/public.ts
revalidate: 0, // Không cache
```

## Best Practices

### ✅ Nên làm:
1. Cache system config **ít nhất 30 phút**
2. Implement on-demand revalidation trong backend
3. Log khi revalidate thành công/thất bại
4. Dùng secret key phức tạp trong production

### ❌ Không nên:
1. Cache quá ngắn (<5 phút) → Mất lợi ích cache
2. Không bảo vệ API revalidate → Bị spam
3. Quên revalidate sau khi update → User thấy data cũ

## Troubleshooting

### Vấn đề: Cache không refresh sau 2 giờ

**Nguyên nhân:** Next.js chỉ refresh khi có request mới sau khi cache hết hạn.

**Giải pháp:** Dùng on-demand revalidation hoặc đợi user truy cập.

### Vấn đề: API revalidate trả về 401

**Nguyên nhân:** Secret key không khớp.

**Giải pháp:** Kiểm tra `REVALIDATE_SECRET` trong `.env.local` và backend.

### Vấn đề: Vẫn thấy data cũ sau khi revalidate

**Nguyên nhân:** Browser cache hoặc CDN cache.

**Giải pháp:** Hard refresh (Ctrl+Shift+R) hoặc clear browser cache.

---

## Tóm tắt

| Metric | Giá trị |
|--------|---------|
| Thời gian cache | **2 giờ (7200s)** |
| Tags | `system-config`, `system-config-general` |
| Revalidate API | `/api/revalidate` |
| Secret header | `x-revalidate-secret` |
| TTFB (cached) | ~10ms |
| TTFB (uncached) | ~300ms |

**Kết luận:** System config được cache tối ưu, giảm tải API và tăng tốc độ trang đáng kể! 🚀
