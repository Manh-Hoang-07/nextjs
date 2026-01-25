type Id = string | number;

export const userEndpoints = {
    auth: {
        login: "/api/auth/login",
        register: "/api/auth/register",
        sendOtpRegister: "/api/auth/register/send-otp",
        sendOtpForgotPassword: "/api/auth/forgot-password/send-otp",
        resetPassword: "/api/auth/reset-password",
        logout: "/api/auth/logout",
        refresh: "/api/auth/refresh",
    },
    profile: {
        me: "/api/user/profile",
        update: "/api/user/profile",
        changePassword: "/api/user/profile/change-password",
    },
    groups: {
        list: "/api/user/groups",
    },
    uploads: {
        file: "/api/upload/file",
        files: "/api/upload/files",
        image: "/api/upload/image",
    },
} as const;
