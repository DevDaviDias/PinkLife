import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Login
export async function loginUser(email: string, password: string) {
  const response = await axios.post(`${API_URL}/auth/login`, { email, password });
  return response.data; // retorna { msg, token }
}

// Cadastro
export async function registerUser(name: string, email: string, password: string, confirmpassword: string) {
  const response = await axios.post(`${API_URL}/auth/register`, {
    name,
    email,
    password,
    confirmpassword
  });
  return response.data; // retorna { msg }
}
