# Tích hợp API User Profile - Hoàn thành

## Tổng quan
Đã tích hợp thành công các API endpoint cho quản lý thông tin cá nhân người dùng theo tài liệu API được cung cấp.

## Các thay đổi đã thực hiện

### 1. Cập nhật API Endpoints
**File**: `src/lib/api/endpoints/user.ts`
- ✅ Cập nhật endpoint profile từ `/api/users/me` → `/api/user/profile`
- ✅ Cập nhật endpoint change password từ `/api/users/me/password` → `/api/user/profile/change-password`

### 2. Tạo User Service
**File**: `src/services/user.service.ts` (MỚI)

Các function đã implement:
- ✅ `getProfile()` - Lấy thông tin tài khoản hiện tại (GET `/api/user/profile`)
- ✅ `updateProfile(data)` - Cập nhật thông tin tài khoản (PATCH `/api/user/profile`)
- ✅ `changePassword(data)` - Đổi mật khẩu (PATCH `/api/user/profile/change-password`)

**Type Definitions**:
```typescript
interface UpdateProfileRequest {
  name?: string;
  image?: string;
  birthday?: string; // YYYY-MM-DD
  gender?: string;   // male, female, other
  address?: string;
  about?: string;
}

interface ChangePasswordRequest {
  old_password: string;
  password: string;
  password_confirmation: string;
}
```

### 3. Tích hợp vào UI Components

#### a. Trang Edit Profile
**File**: `src/app/(user)/user/profile/edit/page.tsx`
- ✅ Import `userService`
- ✅ Gọi `userService.updateProfile()` khi submit form
- ✅ Xử lý response và cập nhật AuthStore
- ✅ Làm sạch dữ liệu (convert null → undefined) trước khi gửi API
- ✅ Hiển thị thông báo thành công/lỗi

#### b. Trang Change Password
**File**: `src/app/(user)/user/profile/change-password/page.tsx`
- ✅ Import `userService`
- ✅ Gọi `userService.changePassword()` khi submit form
- ✅ Map field names: `currentPassword` → `old_password`, `newPassword` → `password`
- ✅ Xử lý error từ API response
- ✅ Reset form sau khi đổi mật khẩu thành công

#### c. User Profile Client (View & Edit Modal)
**File**: `src/app/(user)/user/profile/UserProfileClient.tsx`
- ✅ Fetch profile data từ API khi component mount
- ✅ Hiển thị đầy đủ thông tin: name, email, phone, birthday, gender, address, about
- ✅ Cập nhật modal edit để match với API structure
- ✅ Tích hợp API update trong modal
- ✅ Sync data với AuthStore sau khi update
- ✅ Chuyển đổi tiếng Anh → tiếng Việt cho labels

## Mapping Dữ liệu

### API Response Structure
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "hoangmanh",
    "email": "manh@example.com",
    "phone": "0987654321",
    "status": "active",
    "profile": {
      "name": "Mạnh Hoàng",
      "image": "/uploads/avatars/user-1.jpg",
      "birthday": "1995-01-01",
      "gender": "male",
      "address": "Hà Nội, Việt Nam",
      "about": "Lập trình viên đam mê công nghệ."
    }
  }
}
```

### Data Flattening
Do API trả về nested structure (`data.profile.*`), đã implement logic flatten data để tương thích với AuthStore:

```typescript
const userData = {
  ...response.data,
  name: response.data.profile?.name || response.data.name,
  image: response.data.profile?.image || response.data.image,
  birthday: response.data.profile?.birthday || response.data.birthday,
  gender: response.data.profile?.gender || response.data.gender,
  address: response.data.profile?.address || response.data.address,
  about: response.data.profile?.about || response.data.about,
};
```

## Lưu ý quan trọng

### 1. Trường không được update qua API
- ❌ **phone** - Không có trong API spec cho update profile
- ❌ **email** - Không có trong API spec cho update profile
- ℹ️ Các trường này chỉ hiển thị, không cho phép chỉnh sửa

### 2. Validation
- **name**: Bắt buộc, min 1 ký tự, max 100 ký tự
- **password**: Min 6 ký tự khi đổi mật khẩu
- **birthday**: Format YYYY-MM-DD
- **gender**: Enum (male, female, other)

### 3. Error Handling
Tất cả API calls đều có error handling:
- Hiển thị message từ `error.response?.data?.message`
- Fallback message nếu không có message từ server
- Console log errors để debug

### 4. State Management
- Local component state cho form data
- AuthStore được cập nhật sau mỗi thay đổi thành công
- Profile data được sync giữa các components

## Testing Checklist

- [ ] Xem thông tin profile
- [ ] Chỉnh sửa thông tin (name, birthday, gender, address, about)
- [ ] Upload ảnh đại diện
- [ ] Đổi mật khẩu thành công
- [ ] Xử lý lỗi khi mật khẩu cũ sai
- [ ] Xử lý lỗi khi mật khẩu xác nhận không khớp
- [ ] Kiểm tra data được sync với AuthStore
- [ ] Kiểm tra hiển thị đúng sau khi refresh page

## API Endpoints Summary

| Endpoint | Method | Mô tả | Auth Required |
|----------|--------|-------|---------------|
| `/api/user/profile` | GET | Lấy thông tin profile | ✅ |
| `/api/user/profile` | PATCH | Cập nhật profile | ✅ |
| `/api/user/profile/change-password` | PATCH | Đổi mật khẩu | ✅ |

## Các file đã tạo/sửa

### Tạo mới:
1. `src/services/user.service.ts` - User service với type definitions

### Cập nhật:
1. `src/lib/api/endpoints/user.ts` - API endpoints
2. `src/app/(user)/user/profile/edit/page.tsx` - Edit profile page
3. `src/app/(user)/user/profile/change-password/page.tsx` - Change password page
4. `src/app/(user)/user/profile/UserProfileClient.tsx` - Profile view component

---

**Trạng thái**: ✅ Hoàn thành
**Ngày**: 2026-01-25
