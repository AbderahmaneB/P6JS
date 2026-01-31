import axios from "axios";
import {
  mockLogin,
  mockGetUserInfo,
  mockGetUserActivity,
  UserInfo,
  RunningSession,
} from "@/data/mockData";

const API_BASE_URL = "http://localhost:8000/api";

// Toggle between mock and real API
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface LoginResponse {
  token: string;
  userId: string;
}

export async function loginUser(
  username: string,
  password: string
): Promise<LoginResponse> {
  if (USE_MOCK) {
    const result = mockLogin(username, password);
    if (!result) throw new Error("Invalid credentials");
    return result;
  }

  const response = await apiClient.post<LoginResponse>("/login", {
    username,
    password,
  });
  return response.data;
}

export async function getUserInfo(token: string): Promise<UserInfo> {
  if (USE_MOCK) {
    // Extract userId from mock token
    const userId = token.replace("mock-token-", "");
    const result = mockGetUserInfo(userId);
    if (!result) throw new Error("User not found");
    return result;
  }

  const response = await apiClient.get<UserInfo>("/user-info", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function getUserActivity(
  token: string,
  startWeek: string,
  endWeek: string
): Promise<RunningSession[]> {
  if (USE_MOCK) {
    const userId = token.replace("mock-token-", "");
    return mockGetUserActivity(userId, startWeek, endWeek);
  }

  const response = await apiClient.get<RunningSession[]>("/user-activity", {
    headers: { Authorization: `Bearer ${token}` },
    params: { startWeek, endWeek },
  });
  return response.data;
}
