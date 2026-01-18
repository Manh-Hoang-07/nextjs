type Id = string | number;

export const userEndpoints = {
    auth: {
        login: "/api/auth/login",
        register: "/api/auth/register",
        logout: "/api/auth/logout",
        refresh: "/api/auth/refresh",
    },
    profile: {
        me: "/api/users/me",
        update: "/api/users/me",
        changePassword: "/api/users/me/password",
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
