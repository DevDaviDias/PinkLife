import axios, { AxiosError } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// --- CONFIGURAÇÃO BASE ---

const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("EXPO_PUBLIC_API_URL não definida no .env");
}

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 segundos
  headers: {
    "Content-Type": "application/json",
  },
});

// --- INTERCEPTORS ---

// Adiciona o token em todas as requisições
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.error("Erro ao pegar token:", err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Trata erros globais de resposta
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expirado — limpa sessão
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("userData");
      console.warn("Sessão expirada. Faça login novamente.");
    }
    return Promise.reject(error);
  }
);

// --- HELPER DE ERRO ---

function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    return (error.response?.data as any)?.message ?? error.message;
  }
  return "Erro inesperado.";
}

// --- TIPOS ---

export interface UserData {
  id: string;
  name: string;
  email: string;
  progress: Record<string, any>;
}

export interface AuthResponse {
  token: string;
  user: UserData;
}

export interface DiarioEntry {
  id: string;
  data: string;
  texto: string;
  humor: string;
  destaque: string;
  fotoUrl: string;
}

// --- AUTENTICAÇÃO ---

export async function loginUser(
  email: string,
  password: string
): Promise<AuthResponse> {
  try {
    const { data } = await api.post<AuthResponse>("/auth/login", {
      email,
      password,
    });

    // Salva token e dados do usuário automaticamente
    await AsyncStorage.setItem("token", data.token);
    await AsyncStorage.setItem("userData", JSON.stringify(data.user));

    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function registerUser(
  name: string,
  email: string,
  password: string,
  confirmpassword: string
): Promise<AuthResponse> {
  try {
    const { data } = await api.post<AuthResponse>("/auth/register", {
      name,
      email,
      password,
      confirmpassword,
    });

    await AsyncStorage.setItem("token", data.token);
    await AsyncStorage.setItem("userData", JSON.stringify(data.user));

    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function logoutUser(): Promise<void> {
  await AsyncStorage.removeItem("token");
  await AsyncStorage.removeItem("userData");
}

export async function getLoggedUser(): Promise<UserData> {
  try {
    const { data } = await api.get<UserData>("/user/me");
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

// --- DIÁRIO ---

export async function getDiario(): Promise<DiarioEntry[]> {
  try {
    const { data } = await api.get<DiarioEntry[]>("/diario");
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function saveDiarioEntry(
  formData: FormData
): Promise<DiarioEntry> {
  try {
    const { data } = await api.post<DiarioEntry>("/diario/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function deleteDiarioEntry(id: string): Promise<void> {
  try {
    await api.delete(`/diario/${id}`);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export default api;