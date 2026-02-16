import axios from "axios";

// Pega a URL da API (Render ou Local)
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor inteligente: só roda no navegador para evitar erros de build
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// --- AUTENTICAÇÃO & USUÁRIO ---

export async function loginUser(email: string, password: string) {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
}

export async function registerUser(name: string, email: string, password: string, confirmpassword: string) {
  const response = await api.post("/auth/register", { name, email, password, confirmpassword });
  return response.data;
}

// ESSA FUNÇÃO É ESSENCIAL PARA O DEBUG PANEL
export async function getLoggedUser() {
  const response = await api.get("/user/me"); 
  return response.data;
}

// --- FUNÇÕES DO DIÁRIO ---

export async function getDiario() {
  const response = await api.get("/diario");
  return response.data;
}

export async function saveDiarioEntry(formData: FormData) {
  // O Axios configura o boundary do multipart automaticamente
  const response = await api.post("/diario/upload", formData);
  return response.data;
}

export async function deleteDiarioEntry(id: string) {
  const response = await api.delete(`/diario/${id}`);
  return response.data;
}