import type {
  AuthResponse,
  JobsListResponse,
  JobDetailResponse,
  CreateJobResponse,
  MyPostedJobsResponse,
  ApplyJobResponse,
  ProfileResponse,
  ProfileListResponse,
} from "@/lib/types"

import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// --------------------------------------
// API CONFIG
// --------------------------------------
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// --------------------------------------
// GENERIC FETCH FUNCTION
// --------------------------------------
async function fetchAPI<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  }
  
  console.log("➡ Fetching:", `${API_URL}${endpoint}`)

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  })


  if (!res.ok) {
    let errorMessage = "API Error"
    try {
      const errorBody = await res.json()
      errorMessage = errorBody.message || errorMessage
    } catch {}
    throw new Error(errorMessage)
  }

  return res.json() as Promise<T>
}

// --------------------------------------
// AUTH API
// --------------------------------------
export const authAPI = {
  register: (data: { name: string; email: string; password: string; role: string }) =>
    fetchAPI<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    fetchAPI<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),
}

// --------------------------------------
// USER API
// --------------------------------------
export const userAPI = {
  getMe: () => fetchAPI("/users/me"),
}

// --------------------------------------
// PROFILE API
// --------------------------------------
export const profileAPI = {
  createOrUpdate: (data: Record<string, unknown>) =>
    fetchAPI<ProfileResponse>("/profile", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getMyProfile: () => fetchAPI<ProfileResponse>("/profile/me"),

  getByUserId: (id: string) => fetchAPI<ProfileResponse>(`/profile/user/${id}`),

  search: (params: Record<string, string>) => {
    const query = new URLSearchParams(params).toString()
    return fetchAPI<ProfileListResponse>(`/profile/search?${query}`)
  },
}

// --------------------------------------
// JOBS API
// --------------------------------------
export const jobAPI = {
  create: (data: Record<string, unknown>) =>
    fetchAPI<CreateJobResponse>("/jobs", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getAll: () => fetchAPI<JobsListResponse>("/jobs"),

  getById: (id: string) => fetchAPI<JobDetailResponse>(`/jobs/${id}`),

  apply: (id: string) =>
    fetchAPI<ApplyJobResponse>(`/jobs/${id}/apply`, {
      method: "POST",
    }),

  getMyPosted: () => fetchAPI<MyPostedJobsResponse>("/jobs/me/posted"),

  delete: (id: string) =>
    fetchAPI<{ message: string }>(`/jobs/${id}`, {
      method: "DELETE",
    }),
}

// --------------------------------------
// EVENTS API
// --------------------------------------
export const eventAPI = {
  create: (data: Record<string, unknown>) =>
    fetchAPI("/events", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getAll: () => fetchAPI("/events"),

  getById: (id: string) => fetchAPI(`/events/${id}`),

  update: (id: string, data: Record<string, unknown>) =>
    fetchAPI(`/events/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) => fetchAPI(`/events/${id}`, { method: "DELETE" }),

  register: (id: string) =>
    fetchAPI(`/events/${id}/register`, { method: "POST" }),

  getParticipants: (id: string) =>
    fetchAPI(`/events/${id}/participants`),
}

// --------------------------------------
// CONNECTIONS API
// --------------------------------------
export const connectionAPI = {
  send: (recipientId: string) =>
    fetchAPI("/connections/send", {
      method: "POST",
      body: JSON.stringify({ recipientId }),
    }),

  accept: (id: string) => fetchAPI(`/connections/${id}/accept`, { method: "PUT" }),

  reject: (id: string) => fetchAPI(`/connections/${id}/reject`, { method: "PUT" }),

  getAll: () => fetchAPI("/connections"),

  getPending: () => fetchAPI("/connections/pending"),

  checkStatus: (userId: string) => fetchAPI<{ status: string; connectionId?: string; isPendingForMe?: boolean }>(`/connections/status/${userId}`),
}

// --------------------------------------
// ANNOUNCEMENTS API
// --------------------------------------
export const announcementAPI = {
  create: (data: Record<string, unknown>) =>
    fetchAPI("/announcements", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getAll: () => fetchAPI("/announcements"),

  getById: (id: string) => fetchAPI(`/announcements/${id}`),

  delete: (id: string) =>
    fetchAPI(`/announcements/${id}`, { method: "DELETE" }),
}

// --------------------------------------
// DASHBOARD API
// --------------------------------------
export const dashboardAPI = {
  getStudent: () => fetchAPI("/dashboard/student"),
  getAlumni: () => fetchAPI("/dashboard/alumni"),
  getAdmin: () => fetchAPI("/dashboard/admin"),
}

// --------------------------------------
// CHAT API
// --------------------------------------
export const chatAPI = {
  sendMessage: (receiverId: string, message: string) =>
    fetchAPI("/chat", {
      method: "POST",
      body: JSON.stringify({ receiverId, message }),
    }),

  getMessages: (userId: string) => fetchAPI(`/chat/${userId}`),

  markAsRead: (userId: string) =>
    fetchAPI(`/chat/${userId}/read`, { method: "PUT" }),

  getChatUsers: () => fetchAPI<{ users: Array<{ _id: string; name: string; email: string; role: string }> }>("/chat/list/all"),
}

// --------------------------------------
// NOTIFICATIONS API
// --------------------------------------
export const notificationAPI = {
  getAll: () => fetchAPI<{ notifications: Array<any> }>("/notifications"),

  markAsRead: (id: string) =>
    fetchAPI(`/notifications/${id}/read`, { method: "PUT" }),

  markAllAsRead: () =>
    fetchAPI("/notifications/read-all", { method: "PUT" }),
}

// --------------------------------------
// GLOBAL SEARCH API
// --------------------------------------
export const searchAPI = {
  global: (query: string) =>
    fetchAPI<{
      query: string
      result: {
        users: Array<any>
        profiles: Array<any>
        jobs: Array<any>
        events: Array<any>
        announcements: Array<any>
      }
    }>(`/search?query=${encodeURIComponent(query)}`),
}


// Recommendation Jobs
export const getRecommendedJobs = async (token: string) => {
  const res = await API.get("/recommendations/jobs", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// Recommendation Mentors
export const getRecommendedMentors = async (token: string) => {
  const res = await API.get("/recommendations/mentors", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};