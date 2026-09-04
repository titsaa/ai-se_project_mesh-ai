import type { CurrentUser } from "../types";

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export const BASE_URL = "/api";

export type KnowledgeDoc = {
  _id: string;
  title: string;
  fileName: string;
  userId: string;
  createdAt: string;
};

export type Chat = {
  _id: string;
  title: string;
  userId: string;
  createdAt: string;
};

export type Message = {
  _id: string;
  chatId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

export type ApiResponse<T> = {
  success: boolean;
  data: T | null;
  error: { message: string } | null;
};

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const token = localStorage.getItem("auth-token") ?? "";

  const res = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (res.status === 401) {
    const body = await res.json().catch(() => null);
    const message = body?.error?.message || "Invalid credentials";

    if (localStorage.getItem("auth-token")) {
      localStorage.removeItem("auth-token");
      window.location.href = "/login";
    }

    throw new Error(message);
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error?.message || "Request failed");
  }

  return res.json();
}

export const getDocuments = async (): Promise<ApiResponse<KnowledgeDoc[]>> => {
  await delay(700);
  return {
    success: true,
    data: [
      {
        _id: "1",
        title: "Code Review Guidelines",
        fileName: "code-review-guidelines.pdf",
        userId: "u1",
        createdAt: new Date().toISOString(),
      },
      {
        _id: "2",
        title: "API Reference",
        fileName: "api-reference.pdf",
        userId: "u1",
        createdAt: new Date().toISOString(),
      },
      {
        _id: "3",
        title: "Onboarding Guide",
        fileName: "onboarding-guide.pdf",
        userId: "u1",
        createdAt: new Date().toISOString(),
      },
      {
        _id: "4",
        title: "Code of Conduct",
        fileName: "code_of_conduct.pdf",
        userId: "u1",
        createdAt: new Date().toISOString(),
      },
    ],
    error: null,
  };
};

export const getChats = async () => {
  return request<Chat[]>(`${BASE_URL}/chats`);
};

export const createChat = async (title: string) => {
  return request<Chat>(`${BASE_URL}/chats`, {
    method: "POST",
    body: JSON.stringify({ title }),
  });
};

export const getChat = async (id: string) => {
  return request<{ chat: Chat; messages: Message[] }>(
    `${BASE_URL}/chats/${id}`,
  );
};

export const sendMessage = async (chatId: string, question: string) => {
  return request<Message[]>(`${BASE_URL}/chats/${chatId}/messages`, {
    method: "POST",
    body: JSON.stringify({ question }),
  });
};

export function getCurrentUser(): Promise<ApiResponse<CurrentUser>> {
  return request<CurrentUser>(`${BASE_URL}/users/me`);
}

export function registerUser(
  name: string,
  email: string,
  password: string,
): Promise<ApiResponse<{ userId: string; email: string; name: string }>> {
  return request<{ userId: string; email: string; name: string }>(
    `${BASE_URL}/auth/register`,
    {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    },
  );
}

export function loginUser(
  email: string,
  password: string,
): Promise<ApiResponse<{ token: string; user: CurrentUser }>> {
  return request<{ token: string; user: CurrentUser }>(
    `${BASE_URL}/auth/login`,
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
    },
  );
}
