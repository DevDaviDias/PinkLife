import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react-native";
import axios from "axios";

const RegisterImg = require("../../../../assets/images/hello-kitty-dashboard.jpg");

interface RegisterProps {
  onRegisterSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export default function Register({ onRegisterSuccess, onSwitchToLogin }: RegisterProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Ops! 😢", "As senhas não conferem.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        name, email, password, confirmPassword,
      });
      Alert.alert("Yay! 🎉", response.data.msg || "Cadastro realizado com sucesso!");
      setName(""); setEmail(""); setPassword(""); setConfirmPassword("");
      setTimeout(() => onRegisterSuccess?.(), 2000);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        Alert.alert("Ops! 😢", err.response?.data?.msg || "Erro ao tentar cadastrar.");
      } else {
        Alert.alert("Ops! 😢", "Erro inesperado.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Bolinhas decorativas */}
      <View style={styles.bubble1} />
      <View style={styles.bubble2} />
      <View style={styles.bubble3} />
      <View style={styles.bubble4} />

      {/* Ilustração */}
      <Image source={RegisterImg} style={styles.illustration} resizeMode="cover" />

      {/* Título */}
      <Text style={styles.title}>💗 PinkLife</Text>
      <Text style={styles.subtitle}>Crie sua conta e comece a brilhar ✨</Text>

      {/* Nome */}
      <View style={styles.inputWrapper}>
        <User size={18} color="#f9a8d4" style={styles.inputIcon} />
        <TextInput
          placeholder="Seu nome completo"
          placeholderTextColor="#f9a8d4"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
      </View>

      {/* Email */}
      <View style={styles.inputWrapper}>
        <Mail size={18} color="#f9a8d4" style={styles.inputIcon} />
        <TextInput
          placeholder="Seu email"
          placeholderTextColor="#f9a8d4"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
      </View>

      {/* Senha */}
      <View style={styles.inputWrapper}>
        <Lock size={18} color="#f9a8d4" style={styles.inputIcon} />
        <TextInput
          placeholder="Sua senha"
          placeholderTextColor="#f9a8d4"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={styles.input}
        />
        <TouchableOpacity style={styles.showPass} onPress={() => setShowPassword(!showPassword)}>
          {showPassword ? <EyeOff size={18} color="#ec4899" /> : <Eye size={18} color="#ec4899" />}
        </TouchableOpacity>
      </View>

      {/* Confirmar senha */}
      <View style={styles.inputWrapper}>
        <Lock size={18} color="#f9a8d4" style={styles.inputIcon} />
        <TextInput
          placeholder="Confirme sua senha"
          placeholderTextColor="#f9a8d4"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
          style={styles.input}
        />
        <TouchableOpacity style={styles.showPass} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
          {showConfirmPassword ? <EyeOff size={18} color="#ec4899" /> : <Eye size={18} color="#ec4899" />}
        </TouchableOpacity>
      </View>

      {/* Botão criar conta */}
      <TouchableOpacity
        style={[styles.registerButton, loading && { opacity: 0.7 }]}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.registerTextBtn}>Criar conta 🌸</Text>
        )}
      </TouchableOpacity>

      {/* Link login */}
      {onSwitchToLogin && (
        <TouchableOpacity style={styles.switchLink} onPress={onSwitchToLogin}>
          <Text style={styles.switchText}>
            Já tem conta?{" "}
            <Text style={styles.switchTextBold}>Fazer login 💕</Text>
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff0f6",
    padding: 24,
    overflow: "hidden",
  },
  bubble1: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#fce7f3",
    top: -60,
    right: -60,
    opacity: 0.6,
  },
  bubble2: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#fbcfe8",
    bottom: 80,
    left: -40,
    opacity: 0.5,
  },
  bubble3: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#fde68a",
    top: 180,
    right: -20,
    opacity: 0.3,
  },
  bubble4: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#a78bfa",
    bottom: 160,
    right: 30,
    opacity: 0.2,
  },
  illustration: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#ec4899",
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#be185d",
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 13,
    color: "#f9a8d4",
    fontWeight: "500",
    marginBottom: 24,
    marginTop: 4,
    textAlign: "center",
  },
  inputWrapper: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#fce7f3",
    marginBottom: 12,
    paddingHorizontal: 14,
    shadowColor: "#ec4899",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    padding: 14,
    color: "#be185d",
    fontWeight: "600",
    fontSize: 14,
  },
  showPass: {
    padding: 4,
  },
  registerButton: {
    width: "100%",
    backgroundColor: "#ec4899",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#ec4899",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
    marginBottom: 16,
  },
  registerTextBtn: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 17,
  },
  switchLink: {
    marginTop: 4,
  },
  switchText: {
    color: "#f9a8d4",
    fontSize: 14,
    textAlign: "center",
  },
  switchTextBold: {
    color: "#ec4899",
    fontWeight: "800",
  },
});