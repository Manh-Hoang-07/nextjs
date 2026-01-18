# Fix Log - Component Error

## Thời gian: 2026-01-18 15:40

## Lỗi gặp phải:
```
Error: Element type is invalid: expected a string (for built-in components) 
or a class/function (for composite components) but got: undefined.
```

## Nguyên nhân:
Khi thay đổi type của `header` prop từ `React.ReactNode` sang `React.ReactElement` trong `PublicLayoutWrapper`, code không kiểm tra xem `header` có phải là ReactElement hợp lệ trước khi clone.

## Giải pháp:
Thêm `isValidElement` check trước khi `cloneElement`:

```tsx
// TRƯỚC (Gây lỗi)
const HeaderWithProps = useMemo(() => {
    return React.cloneElement(header as React.ReactElement<any>, {
        // ...props
    });
}, [header, mobileMenuOpen, pathname]);

// SAU (Đã fix)
const HeaderWithProps = useMemo(() => {
    if (!isValidElement(header)) {
        return header;
    }
    return React.cloneElement(header as React.ReactElement<any>, {
        // ...props
    });
}, [header, mobileMenuOpen, pathname]);
```

## File đã sửa:
- `src/components/layout/PublicLayoutWrapper.tsx`

## Kết quả:
✅ Trang load thành công
✅ Không còn lỗi "Element type is invalid"
✅ useMemo vẫn hoạt động để tránh re-render không cần thiết
