import { api } from "./client";
import { ContactPayload } from "@/types/api";
import { publicEndpoints } from "./endpoints";

/**
 * Gửi liên hệ (Client-side)
 */
export async function submitContact(payload: ContactPayload) {
    const { data } = await api.post(publicEndpoints.contacts.create, payload);
    return data;
}
