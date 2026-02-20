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
} from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { loginUser } from "@/src/service/APIservices";
import { useUser } from "@/src/Context/UserContext";

export default function LoginScreen({ onSwitchToRegister }: any) {
  const { refreshUser } = useUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert("Atenção", "Preencha o email e a senha.");
      return;
    }

    try {
      setLoading(true);
      await loginUser(email, password);
      await refreshUser(); // Atualiza o contexto — AuthFlow redireciona automaticamente
    } catch (error: any) {
      Alert.alert("Erro ao entrar", error.message ?? "Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>

      <Text style={styles.title}>💓 PinkLife</Text>

      <View style={styles.socialRow}>
        <TouchableOpacity style={[styles.iconButton, styles.google]}>
          <AntDesign name="google" size={26} color="#fff" />
        </TouchableOpacity>

        {Platform.OS === "ios" && (
          <TouchableOpacity style={[styles.iconButton, styles.apple]}>
            <Ionicons name="logo-apple" size={28} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      {/* Email */}
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Digite seu email"
          placeholderTextColor="#d38ab6"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Senha */}
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Digite sua senha"
          placeholderTextColor="#d38ab6"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          style={styles.showPass}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={20}
            color="#ec4899"
          />
        </TouchableOpacity>
      </View>

      {/* Botão Login */}
      <TouchableOpacity
        style={[styles.loginButton, loading && { opacity: 0.7 }]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.loginText}>Entrar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.link}>Esqueci minha senha</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.registerLink} onPress={onSwitchToRegister}>
        <Text style={styles.registerText}>Não tem uma conta? Criar conta</Text>
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
  showPass: {
    position: "absolute",
    right: 16,
    top: 16,
  },
  loginButton: {
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
  loginText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  link: {
    marginTop: 16,
    color: "#ec4899",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  registerLink: {
    marginTop: 24,
  },
  registerText: {
    color: "#ec4899",
    fontWeight: "600",
    textDecorationLine: "underline",
    fontSize: 16,
  },
  socialRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 32,
  },
  iconButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  google: {
    backgroundColor: "#DB4437",
  },
  apple: {
    backgroundColor: "#000",
  },
});