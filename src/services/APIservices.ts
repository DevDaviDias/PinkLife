import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Auxiliar para pegar o token
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
};

// --- AUTENTICAÇÃO ---

export async function loginUser(email: string, password: string) {
  const response = await axios.post(`${API_URL}/auth/login`, { email, password });
  return response.data;
}

export async function registerUser(name: string, email: string, password: string, confirmpassword: string) {
  const response = await axios.post(`${API_URL}/auth/register`, {
    name,
    email,
    password,
    confirmpassword
  });
  return response.data;
}

export async function getLoggedUser() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Usuário não está logado");

  const response = await axios.get(`${API_URL}/user/me`, {
    headers: getAuthHeaders(),
  });
  return response.data;
}

// --- FUNÇÕES DO DIÁRIO (ADICIONADAS) ---

// 1. Buscar todas as entradas do diário
export async function getDiario() {
  const response = await axios.get(`${API_URL}/diario`, {
    headers: getAuthHeaders(),
  });
  return response.data; // Retorna o array de entradas
}

// 2. Salvar nova entrada (Upload de Foto + Dados)
// Nota: O parâmetro 'formData' deve conter 'foto', 'texto', 'humor' e 'destaque'
export async function saveDiarioEntry(formData: FormData) {
  const response = await axios.post(`${API_URL}/diario/upload`, formData, {
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data; // Retorna a nova entrada criada
}

// 3. Excluir uma entrada do diário
export async function deleteDiarioEntry(id: string) {
  const response = await axios.delete(`${API_URL}/diario/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
}