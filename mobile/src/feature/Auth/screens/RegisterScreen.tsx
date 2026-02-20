import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, ScrollView, Platform } from "react-native";
import axios from "axios";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react-native";

interface RegisterProps {
  onRegisterSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export default function Register({ onRegisterSuccess, onSwitchToLogin }: RegisterProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleRegister = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    if (password !== confirmPassword) {
      setError("As senhas não conferem");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/auth/register`, { name, email, password, confirmPassword });
      setSuccess(response.data.msg || "Cadastro realizado com sucesso!");
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        onRegisterSuccess && onRegisterSuccess();
      }, 2000);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.msg || "Erro ao tentar cadastrar");
      } else {
        setError("Erro inesperado");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>💓 PinkLife</Text>

      {/* Mensagens de sucesso ou erro */}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {success ? <Text style={styles.success}>{success}</Text> : null}

      {/* Nome */}
      <View style={styles.inputWrapper}>
        <TextInput
          placeholder="Nome completo"
          placeholderTextColor="#d38ab6"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <User size={22} color="#ec4899" style={styles.icon} />
      </View>

      {/* Email */}
      <View style={styles.inputWrapper}>
        <TextInput
          placeholder="Digite seu email"
          placeholderTextColor="#d38ab6"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
        <Mail size={22} color="#ec4899" style={styles.icon} />
      </View>

      {/* Senha */}
      <View style={styles.inputWrapper}>
        <TextInput
          placeholder="Digite sua senha"
          placeholderTextColor="#d38ab6"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={styles.input}
        />
        <TouchableOpacity style={styles.showPass} onPress={() => setShowPassword(!showPassword)}>
          {showPassword ? <EyeOff size={22} color="#ec4899" /> : <Eye size={22} color="#ec4899" />}
        </TouchableOpacity>
      </View>

      {/* Confirmar senha */}
      <View style={styles.inputWrapper}>
        <TextInput
          placeholder="Confirme sua senha"
          placeholderTextColor="#d38ab6"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
          style={styles.input}
        />
        <TouchableOpacity style={styles.showPass} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
          {showConfirmPassword ? <EyeOff size={22} color="#ec4899" /> : <Eye size={22} color="#ec4899" />}
        </TouchableOpacity>
      </View>

      {/* Botão criar conta */}
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.registerTextBtn}>Criar conta</Text>}
      </TouchableOpacity>

      {/* Link para login */}
      {onSwitchToLogin && (
        <TouchableOpacity style={styles.switchLink} onPress={onSwitchToLogin}>
          <Text style={styles.switchText}>Já tem uma conta? Fazer login</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff0f6",
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ec4899",
    marginBottom: 32,
  },
  inputWrapper: {
    width: "100%",
    position: "relative",
    marginBottom: 16,
  },
  input: {
    width: "100%",
    backgroundColor: "#ffe6f0",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#fbcfe8",
    color: "#000",
  },
  icon: {
    position: "absolute",
    right: 16,
    top: 16,
  },
  showPass: {
    position: "absolute",
    right: 16,
    top: 16,
  },
  registerButton: {
    width: "100%",
    backgroundColor: "#ec4899",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 16,
    shadowColor: "#ec4899",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  registerTextBtn: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  error: {
    color: "#B91C1C",
    marginBottom: 10,
    fontWeight: "600",
    textAlign: "center",
  },
  success: {
    color: "#047857",
    marginBottom: 10,
    fontWeight: "600",
    textAlign: "center",
  },
  switchLink: {
    marginTop: 24,
  },
  switchText: {
    color: "#ec4899",
    fontWeight: "600",
    textDecorationLine: "underline",
    fontSize: 16,
    textAlign: "center",
  },
});