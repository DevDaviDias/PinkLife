import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  BookHeart,
  ChevronLeft,
  ChevronRight,
  Camera,
  Sparkles,
  Heart,
  Save,
  PenLine,
  BookOpen,
} from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

interface Entrada {
  id: string;
  texto: string;
  humor: string;
  destaque: string;
  fotoUrl?: string;
  data: string;
}

export default function DiarioScreen() {
  const [aba, setAba] = useState<"escrever" | "ler">("escrever");
  const [entradas, setEntradas] = useState<Entrada[]>([]);
  const [loading, setLoading] = useState(false);
  const [buscando, setBuscando] = useState(true);
  const [paginaAtual, setPaginaAtual] = useState(0);

  // Form
  const [texto, setTexto] = useState("");
  const [humor, setHumor] = useState("✨");
  const [destaque, setDestaque] = useState("");
  const [fotoUri, setFotoUri] = useState<string | null>(null);

  useEffect(() => {
    carregarDiario();
  }, []);

  async function carregarDiario() {
    const token = await AsyncStorage.getItem("token");
    if (!token) { setBuscando(false); return; }
    try {
      const res = await fetch(`${API_URL}/diario`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const dados = await res.json();
        if (Array.isArray(dados)) setEntradas([...dados].reverse());
      }
    } catch (e) {
      console.error("Erro ao carregar diário:", e);
    } finally {
      setBuscando(false);
    }
  }

  async function escolherFoto() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Permissão necessária 📷", "Precisamos de acesso à sua galeria!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled) {
      setFotoUri(result.assets[0].uri);
    }
  }

  async function salvarMemoria() {
    if (!texto.trim()) { Alert.alert("Ops! 🌸", "Escreva algo no seu diário!"); return; }
    if (!fotoUri) { Alert.alert("Ops! 📷", "Selecione uma foto para sua memória!"); return; }

    setLoading(true);
    const token = await AsyncStorage.getItem("token");

    const formData = new FormData();
    formData.append("foto", {
      uri: fotoUri,
      type: "image/jpeg",
      name: "foto.jpg",
    } as any);
    formData.append("texto", texto);
    formData.append("humor", humor);
    formData.append("destaque", destaque);

    try {
      const res = await fetch(`${API_URL}/diario/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (res.ok) {
        const nova = await res.json();
        setEntradas(prev => [...prev, nova]);
        setTexto(""); setDestaque(""); setFotoUri(null); setHumor("✨");
        setAba("ler");
        setPaginaAtual(entradas.length);
        Alert.alert("Salvo! 💕", "Sua memória foi guardada com carinho!");
      } else {
        const err = await res.json();
        Alert.alert("Ops! 😢", err.msg || "Erro ao salvar memória.");
      }
    } catch (e) {
      Alert.alert("Erro de conexão 😢", "Verifique se a API está online.");
    } finally {
      setLoading(false);
    }
  }

  const entrada = entradas[paginaAtual];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Título */}
      <View style={styles.headerRow}>
        <BookHeart size={24} color="#ec4899" />
        <Text style={styles.pageTitle}>Meu Diário Rosa</Text>
      </View>
      <Text style={styles.pageSubtitle}>Guarde suas memórias mais lindas 🌸</Text>

      {/* Abas */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, aba === "escrever" && styles.tabActive]}
          onPress={() => setAba("escrever")}
        >
          <PenLine size={16} color={aba === "escrever" ? "#fff" : "#f9a8d4"} />
          <Text style={[styles.tabText, aba === "escrever" && styles.tabTextActive]}>Escrever</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, aba === "ler" && styles.tabActive]}
          onPress={() => setAba("ler")}
        >
          <BookOpen size={16} color={aba === "ler" ? "#fff" : "#f9a8d4"} />
          <Text style={[styles.tabText, aba === "ler" && styles.tabTextActive]}>Ver Livro</Text>
        </TouchableOpacity>
      </View>

      {/* ABA: Escrever */}
      {aba === "escrever" && (
        <View style={styles.paginaCard}>
          {/* Furos do caderno */}
          <View style={styles.furos}>
            {[...Array(8)].map((_, i) => (
              <View key={i} style={styles.furo} />
            ))}
          </View>

          <View style={styles.paginaConteudo}>
            {/* Data e humor */}
            <View style={styles.dataHumorRow}>
              <Text style={styles.dataText}>
                {new Date().toLocaleDateString("pt-BR")}
              </Text>
              <TextInput
                value={humor}
                onChangeText={setHumor}
                style={styles.humorInput}
                maxLength={2}
              />
            </View>

            {/* Foto */}
            <TouchableOpacity style={styles.fotoArea} onPress={escolherFoto}>
              {fotoUri ? (
                <Image source={{ uri: fotoUri }} style={styles.fotoPreview} resizeMode="cover" />
              ) : (
                <View style={styles.fotoPlaceholder}>
                  <Camera size={28} color="#f9a8d4" />
                  <Text style={styles.fotoPlaceholderText}>Adicionar Foto</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Título */}
            <TextInput
              placeholder="Título do momento..."
              placeholderTextColor="#f9a8d4"
              value={destaque}
              onChangeText={setDestaque}
              style={styles.tituloInput}
            />

            {/* Texto */}
            <TextInput
              placeholder="Querido Diário..."
              placeholderTextColor="#f9a8d4"
              value={texto}
              onChangeText={setTexto}
              multiline
              style={styles.textoInput}
            />
          </View>
        </View>
      )}

      {/* Botão salvar */}
      {aba === "escrever" && (
        <TouchableOpacity
          style={[styles.salvarBtn, loading && { opacity: 0.7 }]}
          onPress={salvarMemoria}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Save size={20} color="#fff" />
              <Text style={styles.salvarBtnText}>Guardar Memória 💕</Text>
            </>
          )}
        </TouchableOpacity>
      )}

      {/* ABA: Ler */}
      {aba === "ler" && (
        <View>
          {buscando ? (
            <View style={styles.loadingWrapper}>
              <ActivityIndicator color="#ec4899" size="large" />
              <Text style={styles.loadingText}>Abrindo seu diário rosa...</Text>
            </View>
          ) : entradas.length === 0 ? (
            <View style={styles.vazioWrapper}>
              <Sparkles size={40} color="#f9a8d4" />
              <Text style={styles.vazioText}>Nenhuma memória ainda 🌸</Text>
              <TouchableOpacity style={styles.emptyBtn} onPress={() => setAba("escrever")}>
                <Text style={styles.emptyBtnText}>Escrever primeira memória 💕</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {/* Capa se for paginaAtual === -1, senão mostra entrada */}
              <View style={styles.livroCard}>
                {/* Furos */}
                <View style={styles.furos}>
                  {[...Array(8)].map((_, i) => <View key={i} style={styles.furo} />)}
                </View>

                <View style={styles.paginaConteudo}>
                  {/* Header */}
                  <View style={styles.dataHumorRow}>
                    <Text style={styles.dataText}>
                      {new Date(entrada.data).toLocaleDateString("pt-BR")}
                    </Text>
                    <Text style={styles.humorEmoji}>{entrada.humor}</Text>
                  </View>

                  {/* Foto */}
                  {entrada.fotoUrl && (
                    <Image
                      source={{ uri: entrada.fotoUrl }}
                      style={styles.fotoLeitura}
                      resizeMode="cover"
                    />
                  )}

                  {/* Destaque */}
                  {entrada.destaque ? (
                    <Text style={styles.destaqueText}>
                      ✨ {entrada.destaque}
                    </Text>
                  ) : null}

                  {/* Texto */}
                  <Text style={styles.textoLeitura}>{entrada.texto}</Text>

                  {/* Rodapé */}
                  <View style={styles.rodape}>
                    <Heart size={16} color="#f9a8d4" fill="#f9a8d4" />
                    <Text style={styles.paginaNum}>
                      Pág {paginaAtual + 1} de {entradas.length}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Navegação */}
              <View style={styles.navRow}>
                <TouchableOpacity
                  style={[styles.navBtn, paginaAtual === 0 && styles.navBtnDisabled]}
                  onPress={() => paginaAtual > 0 && setPaginaAtual(p => p - 1)}
                  disabled={paginaAtual === 0}
                >
                  <ChevronLeft size={24} color={paginaAtual === 0 ? "#f9a8d4" : "#ec4899"} />
                </TouchableOpacity>

                {/* Pontos */}
                <View style={styles.dotsNav}>
                  {entradas.slice(0, 7).map((_, i) => (
                    <TouchableOpacity key={i} onPress={() => setPaginaAtual(i)}>
                      <View style={[styles.dotNav, i === paginaAtual && styles.dotNavActive]} />
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity
                  style={[styles.navBtn, paginaAtual === entradas.length - 1 && styles.navBtnDisabled]}
                  onPress={() => paginaAtual < entradas.length - 1 && setPaginaAtual(p => p + 1)}
                  disabled={paginaAtual === entradas.length - 1}
                >
                  <ChevronRight size={24} color={paginaAtual === entradas.length - 1 ? "#f9a8d4" : "#ec4899"} />
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      )}

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff0f6",
    paddingHorizontal: 16,
    paddingTop: 56,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  pageTitle: {
    fontSize: 26,
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
  tabRow: {
    flexDirection: "row",
    backgroundColor: "#fce7f3",
    borderRadius: 16,
    padding: 4,
    marginBottom: 16,
    gap: 4,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
  },
  tabActive: {
    backgroundColor: "#ec4899",
    shadowColor: "#ec4899",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#f9a8d4",
  },
  tabTextActive: {
    color: "#fff",
    fontWeight: "800",
  },
  paginaCard: {
    backgroundColor: "#fffbf2",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#fce7f3",
    flexDirection: "row",
    overflow: "hidden",
    shadowColor: "#ec4899",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    minHeight: 520,
  },
  livroCard: {
    backgroundColor: "#fffbf2",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#fce7f3",
    flexDirection: "row",
    overflow: "hidden",
    shadowColor: "#ec4899",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    minHeight: 480,
  },
  furos: {
    width: 32,
    backgroundColor: "#fff",
    borderRightWidth: 1,
    borderRightColor: "#fce7f3",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 20,
  },
  furo: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  paginaConteudo: {
    flex: 1,
    padding: 16,
  },
  dataHumorRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#fce7f3",
    paddingBottom: 8,
    marginBottom: 12,
  },
  dataText: {
    fontSize: 14,
    color: "#f9a8d4",
    fontWeight: "600",
  },
  humorInput: {
    fontSize: 24,
    textAlign: "center",
    width: 40,
  },
  humorEmoji: {
    fontSize: 24,
  },
  fotoArea: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: "hidden",
  },
  fotoPreview: {
    width: "100%",
    height: 160,
    borderRadius: 12,
  },
  fotoPlaceholder: {
    width: "100%",
    height: 140,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#fce7f3",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  fotoPlaceholderText: {
    fontSize: 12,
    color: "#f9a8d4",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  tituloInput: {
    fontSize: 18,
    fontWeight: "700",
    color: "#be185d",
    borderBottomWidth: 1,
    borderBottomColor: "#fce7f3",
    paddingBottom: 8,
    marginBottom: 12,
  },
  textoInput: {
    fontSize: 16,
    color: "#6b7280",
    lineHeight: 28,
    minHeight: 160,
    textAlignVertical: "top",
  },
  salvarBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#ec4899",
    padding: 16,
    borderRadius: 16,
    marginTop: 12,
    shadowColor: "#ec4899",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  salvarBtnText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },
  loadingWrapper: {
    alignItems: "center",
    paddingVertical: 48,
    gap: 12,
  },
  loadingText: {
    color: "#f9a8d4",
    fontWeight: "600",
    fontSize: 14,
  },
  vazioWrapper: {
    alignItems: "center",
    paddingVertical: 48,
    gap: 12,
  },
  vazioText: {
    color: "#f9a8d4",
    fontWeight: "600",
    fontSize: 15,
  },
  emptyBtn: {
    backgroundColor: "#ec4899",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    shadowColor: "#ec4899",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  emptyBtnText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 14,
  },
  fotoLeitura: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginBottom: 12,
  },
  destaqueText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#ec4899",
    marginBottom: 8,
  },
  textoLeitura: {
    fontSize: 16,
    color: "#6b7280",
    lineHeight: 28,
    flex: 1,
  },
  rodape: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#fce7f3",
  },
  paginaNum: {
    fontSize: 11,
    color: "#d1d5db",
    fontStyle: "italic",
  },
  navRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    paddingHorizontal: 8,
  },
  navBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#ec4899",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  navBtnDisabled: {
    backgroundColor: "#fce7f3",
    shadowOpacity: 0,
    elevation: 0,
  },
  dotsNav: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  dotNav: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#fce7f3",
  },
  dotNavActive: {
    backgroundColor: "#ec4899",
    width: 20,
    borderRadius: 4,
  },
});