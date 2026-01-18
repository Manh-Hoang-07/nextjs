# Hướng dẫn sử dụng Performance Components

## 1. NavigationProgress (Đã tích hợp sẵn)

Component này đã được tích hợp vào root layout và tự động hoạt động cho toàn bộ app.

**Không cần làm gì thêm** - thanh progress bar sẽ tự động hiển thị khi chuyển trang.

---

## 2. OptimizedLink - Link tối ưu với instant feedback

Thay thế `next/link` bằng `OptimizedLink` để có trải nghiệm tốt hơn.

### Cách sử dụng:

```tsx
import { OptimizedLink } from '@/components/ui/OptimizedLink';

// Thay vì:
<Link href="/about">About</Link>

// Dùng:
<OptimizedLink href="/about">About</OptimizedLink>
```

### Ưu điểm:
- ✅ Hiển thị loading state ngay lập tức khi click
- ✅ Tự động prefetch để tải nhanh hơn
- ✅ Xử lý smart cho external links và modifier keys
- ✅ Opacity feedback khi đang navigate

### Props:

```tsx
interface OptimizedLinkProps {
  href: string | UrlObject;
  children: ReactNode;
  className?: string;
  prefetch?: boolean; // default: true
  onClick?: (e: MouseEvent) => void;
  // ... all other Next.js Link props
}
```

---

## 3. PageTransition - Transition overlay cho pages

Dùng để wrap content của page cần transition đặc biệt.

### Cách sử dụng:

```tsx
import { PageTransition } from '@/components/ui/PageTransition';

export default function MyPage() {
  return (
    <PageTransition>
      <div>
        {/* Your page content */}
      </div>
    </PageTransition>
  );
}
```

### Khi nào dùng:
- ❌ **Không cần** cho hầu hết các pages (đã có NavigationProgress)
- ✅ **Nên dùng** cho pages có nhiều data loading
- ✅ **Nên dùng** cho pages cần transition đặc biệt
- ✅ **Nên dùng** cho modal/dialog pages

---

## 4. Server-Side Caching Best Practices

### Cho Public Pages (không cần auth):

```tsx
import { serverFetch } from '@/lib/api/server-client';

// Enable ISR
export const revalidate = 300; // 5 minutes

async function getData() {
  const { data, error } = await serverFetch('/api/endpoint', {
    skipCookies: true, // Important for public data!
    next: {
      revalidate: 300,
      tags: ['my-data'],
    },
  });
  
  return data;
}
```

### Cho Protected Pages (cần auth):

```tsx
import { serverFetch } from '@/lib/api/server-client';

async function getData() {
  const { data, error } = await serverFetch('/api/endpoint', {
    // skipCookies: false (default) - will include auth token
    next: {
      revalidate: 60, // Shorter cache for user-specific data
      tags: ['user-data'],
    },
  });
  
  return data;
}
```

### Cache Invalidation:

```tsx
import { revalidateTag } from 'next/cache';

// Invalidate specific cache
revalidateTag('my-data');

// Or revalidate path
import { revalidatePath } from 'next/cache';
revalidatePath('/projects');
```

---

## 5. Loading States Best Practices

### Skeleton Loading:

```tsx
import { Suspense } from 'react';

function MySkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
      <div className="h-4 bg-gray-200 rounded w-full mb-2" />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<MySkeleton />}>
      <DataComponent />
    </Suspense>
  );
}
```

---

## 6. Performance Checklist

Khi tạo page mới, hãy check:

- [ ] Có dùng `serverFetch` thay vì client-side fetch?
- [ ] Có set `revalidate` phù hợp?
- [ ] Có `skipCookies: true` cho public data?
- [ ] Có Suspense boundary với skeleton loading?
- [ ] Có dùng `OptimizedLink` cho navigation?
- [ ] Có cache tags để invalidate khi cần?

---

## 7. Troubleshooting

### Trang vẫn chậm?

1. Check Network tab - API có chậm không?
2. Check có dùng `serverFetch` chưa?
3. Check `revalidate` time có hợp lý không?
4. Check có quá nhiều sequential API calls không?

### Loading indicator không hiện?

1. Check `NavigationProgress` đã có trong root layout chưa?
2. Check browser console có error không?
3. Thử hard refresh (Ctrl+Shift+R)

### Cache không work?

1. Check có `skipCookies: true` cho public data chưa?
2. Check `revalidate` có được set chưa?
3. Check có dynamic params làm cache bị bypass không?
