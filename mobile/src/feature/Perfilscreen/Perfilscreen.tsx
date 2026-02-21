import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  User,
  Mail,
  LogOut,
  Camera,
  Dumbbell,
  BookOpen,
  DollarSign,
  Heart,
  BookHeart,
  Pencil,
  Check,
  X,
} from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "@/src/Context/UserContext";
import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function PerfilScreen() {
  const { user, setUser, refreshUser } = useUser();
  const [editandoNome, setEditandoNome] = useState(false);
  const [novoNome, setNovoNome] = useState(user?.name || "");
  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  // --- Estatísticas vindas do contexto ---
  const totalTreinos = user?.progress?.treinos?.length ?? 0;
  const totalSessoes = user?.progress?.historicoEstudos?.length ?? 0;
  const totalTransacoes = user?.progress?.financas?.length ?? 0;
  const totalDiario = user?.progress?.diario?.length ?? 0;
  const diasSaude = Object.keys(user?.progress?.saude ?? {}).length;

  async function escolherFoto() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Permissão necessária 📷", "Precisamos de acesso à sua galeria!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setFotoUri(result.assets[0].uri);
    }
  }

  async function salvarNome() {
    if (!novoNome.trim()) return;
    setSalvando(true);
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.put(`${API_URL}/user/profile`, { name: novoNome }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await refreshUser();
      setEditandoNome(false);
      Alert.alert("Salvo! 💕", "Nome atualizado com sucesso!");
    } catch {
      Alert.alert("Ops! 😢", "Erro ao salvar nome.");
    } finally {
      setSalvando(false);
    }
  }

  async function handleLogout() {
    Alert.alert(
      "Sair da conta 👋",
      "Tem certeza que deseja sair?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sair",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem("token");
            await AsyncStorage.removeItem("@userData");
            setUser(null);
          },
        },
      ]
    );
  }

  const iniciais = user?.name
    ?.split(" ")
    .map(n => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() ?? "??";

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Cabeçalho */}
      <Text style={styles.pageTitle}>👤 Perfil</Text>
      <Text style={styles.pageSubtitle}>Suas informações e conquistas 🌸</Text>

      {/* Card de perfil */}
      <View style={styles.perfilCard}>
        {/* Foto */}
        <TouchableOpacity style={styles.fotoWrapper} onPress={escolherFoto}>
          {fotoUri ? (
            <Image source={{ uri: fotoUri }} style={styles.foto} />
          ) : (
            <View style={styles.fotoPlaceholder}>
              <Text style={styles.iniciais}>{iniciais}</Text>
            </View>
          )}
          <View style={styles.cameraBtn}>
            <Camera size={14} color="#fff" />
          </View>
        </TouchableOpacity>

        {/* Nome */}
        <View style={styles.nomeRow}>
          {editandoNome ? (
            <View style={styles.nomeEditRow}>
              <TextInput
                value={novoNome}
                onChangeText={setNovoNome}
                style={styles.nomeInput}
                autoFocus
              />
              {salvando ? (
                <ActivityIndicator color="#ec4899" size="small" />
              ) : (
                <>
                  <TouchableOpacity onPress={salvarNome} style={styles.iconBtn}>
                    <Check size={18} color="#ec4899" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => { setEditandoNome(false); setNovoNome(user?.name || ""); }} style={styles.iconBtn}>
                    <X size={18} color="#f9a8d4" />
                  </TouchableOpacity>
                </>
              )}
            </View>
          ) : (
            <View style={styles.nomeReadRow}>
              <Text style={styles.nomeText}>{user?.name}</Text>
              <TouchableOpacity onPress={() => setEditandoNome(true)} style={styles.iconBtn}>
                <Pencil size={16} color="#f9a8d4" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Email */}
        <View style={styles.emailRow}>
          <Mail size={14} color="#f9a8d4" />
          <Text style={styles.emailText}>{user?.email}</Text>
        </View>
      </View>

      {/* Estatísticas */}
      <Text style={styles.secaoTitulo}>📊 Suas Estatísticas</Text>
      <View style={styles.statsGrid}>
        <StatCard icon={<Dumbbell size={20} color="#ec4899" />} valor={totalTreinos} label="Fichas de Treino" cor="#fce7f3" />
        <StatCard icon={<BookOpen size={20} color="#7c3aed" />} valor={totalSessoes} label="Sessões de Estudo" cor="#ede9fe" />
        <StatCard icon={<DollarSign size={20} color="#ca8a04" />} valor={totalTransacoes} label="Transações" cor="#fef9c3" />
        <StatCard icon={<Heart size={20} color="#ef4444" />} valor={diasSaude} label="Dias Registrados" cor="#fee2e2" />
        <StatCard icon={<BookHeart size={20} color="#ec4899" />} valor={totalDiario} label="Memórias no Diário" cor="#fce7f3" />
      </View>

      {/* Botão logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <LogOut size={20} color="#fff" />
        <Text style={styles.logoutText}>Sair da conta</Text>
      </TouchableOpacity>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

function StatCard({ icon, valor, label, cor }: {
  icon: React.ReactNode;
  valor: number;
  label: string;
  cor: string;
}) {
  return (
    <View style={[styles.statCard, { backgroundColor: cor }]}>
      {icon}
      <Text style={styles.statValor}>{valor}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff0f6",
    paddingHorizontal: 16,
    paddingTop: 56,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#be185d",
  },
  pageSubtitle: {
    fontSize: 13,
    color: "#f9a8d4",
    fontWeight: "500",
    marginBottom: 16,
    marginTop: 2,
  },
  perfilCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#fce7f3",
    shadowColor: "#ec4899",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 20,
    gap: 8,
  },
  fotoWrapper: {
    position: "relative",
    marginBottom: 4,
  },
  foto: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: "#ec4899",
  },
  fotoPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#fce7f3",
    borderWidth: 3,
    borderColor: "#ec4899",
    alignItems: "center",
    justifyContent: "center",
  },
  iniciais: {
    fontSize: 32,
    fontWeight: "900",
    color: "#ec4899",
  },
  cameraBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#ec4899",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  nomeRow: {
    width: "100%",
    alignItems: "center",
  },
  nomeReadRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  nomeEditRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  nomeText: {
    fontSize: 22,
    fontWeight: "900",
    color: "#be185d",
  },
  nomeInput: {
    fontSize: 20,
    fontWeight: "700",
    color: "#be185d",
    borderBottomWidth: 2,
    borderBottomColor: "#ec4899",
    minWidth: 140,
    textAlign: "center",
    paddingBottom: 2,
  },
  iconBtn: {
    padding: 4,
  },
  emailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  emailText: {
    fontSize: 13,
    color: "#f9a8d4",
    fontWeight: "500",
  },
  secaoTitulo: {
    fontSize: 15,
    fontWeight: "800",
    color: "#be185d",
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    width: "47%",
    borderRadius: 16,
    padding: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: "#fce7f3",
  },
  statValor: {
    fontSize: 28,
    fontWeight: "900",
    color: "#be185d",
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#9ca3af",
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#be185d",
    padding: 16,
    borderRadius: 16,
    shadowColor: "#be185d",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },
});