import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { loginUser } from "@/src/service/APIservices";
import { useUser } from "@/src/Context/UserContext";

const LoginImg = require("../../../../assets/images/hello-kitty-dashboard.jpg");

export default function LoginScreen({ onSwitchToRegister }: any) {
  const { refreshUser } = useUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert("Atenção 🌸", "Preencha o email e a senha.");
      return;
    }
    try {
      setLoading(true);
      await loginUser(email, password);
      await refreshUser();
    } catch (error: any) {
      Alert.alert("Ops! 😢", error.message ?? "Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      {/* Bolinhas decorativas de fundo */}
      <View style={styles.bubble1} />
      <View style={styles.bubble2} />
      <View style={styles.bubble3} />
      <View style={styles.bubble4} />

      {/* Ilustração no topo */}
      <Image source={LoginImg} style={styles.illustration} resizeMode="cover" />

      {/* Título fofo */}
      <Text style={styles.title}>💗 PinkLife</Text>
      <Text style={styles.subtitle}>Seu app mais fofo de organização 🌸</Text>

      {/* Botões sociais */}
      <View style={styles.socialRow}>
        <TouchableOpacity style={[styles.socialButton, styles.google]}>
          <AntDesign name="google" size={20} color="#fff" />
          <Text style={styles.socialText}>Google</Text>
        </TouchableOpacity>

        {Platform.OS === "ios" && (
          <TouchableOpacity style={[styles.socialButton, styles.apple]}>
            <Ionicons name="logo-apple" size={20} color="#fff" />
            <Text style={styles.socialText}>Apple</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Divisor */}
      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>ou entre com email</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Email */}
      <View style={styles.inputWrapper}>
        <Ionicons name="mail-outline" size={18} color="#f9a8d4" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Seu email"
          placeholderTextColor="#f9a8d4"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Senha */}
      <View style={styles.inputWrapper}>
        <Ionicons name="lock-closed-outline" size={18} color="#f9a8d4" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Sua senha"
          placeholderTextColor="#f9a8d4"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          style={styles.showPass}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Ionicons name={showPassword ? "eye-off" : "eye"} size={18} color="#ec4899" />
        </TouchableOpacity>
      </View>

      {/* Esqueci senha */}
      <TouchableOpacity style={{ alignSelf: "flex-end", marginBottom: 16 }}>
        <Text style={styles.link}>Esqueci minha senha 🥺</Text>
      </TouchableOpacity>

      {/* Botão Login */}
      <TouchableOpacity
        style={[styles.loginButton, loading && { opacity: 0.7 }]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.loginText}>Entrar 💕</Text>
        )}
      </TouchableOpacity>

      {/* Criar conta */}
      <TouchableOpacity style={styles.registerLink} onPress={onSwitchToRegister}>
        <Text style={styles.registerText}>
          Não tem conta?{" "}
          <Text style={styles.registerTextBold}>Criar conta 🌟</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff0f6",
    alignItems: "center",
    justifyContent: "center",
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
    width: 110,
    height: 110,
    borderRadius: 55,
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
  },
  socialRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
    width: "100%",
  },
  socialButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 12,
    borderRadius: 14,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  socialText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  google: {
    backgroundColor: "#DB4437",
    shadowColor: "#DB4437",
  },
  apple: {
    backgroundColor: "#000",
    shadowColor: "#000",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
    gap: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#fce7f3",
  },
  dividerText: {
    fontSize: 12,
    color: "#f9a8d4",
    fontWeight: "500",
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
  link: {
    color: "#f472b6",
    fontWeight: "600",
    fontSize: 13,
  },
  loginButton: {
    width: "100%",
    backgroundColor: "#ec4899",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#ec4899",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
    marginBottom: 16,
  },
  loginText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 17,
  },
  registerLink: {
    marginTop: 4,
  },
  registerText: {
    color: "#f9a8d4",
    fontSize: 14,
  },
  registerTextBold: {
    color: "#ec4899",
    fontWeight: "800",
  },
});