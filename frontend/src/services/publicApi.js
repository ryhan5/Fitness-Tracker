import { apiRequest } from "./apiClient";

export const userCount = () => apiRequest('/public/user-count');
