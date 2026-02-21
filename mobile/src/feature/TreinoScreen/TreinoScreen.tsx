import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Plus, Trash2, CheckCircle, Clock, Dumbbell, Target, Flame } from "lucide-react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Treino {
  id: string;
  nome: string;
  categoria: string;
  duracao: string;
  exercicios: string[];
}

type Aba = "Hoje" | "MeusTreinos" | "CriarTreino";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function TreinoScreen() {
  const [aba, setAba] = useState<Aba>("Hoje");
  const [fichas, setFichas] = useState<Treino[]>([]);
  const [loading, setLoading] = useState(true);
  const [novoNomeTreino, setNovoNomeTreino] = useState("");
  const [novoExercicio, setNovoExercicio] = useState("");
  const [listaTempExercicio, setListaTempExercicio] = useState<string[]>([]);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    fetchTreinos();
  }, []);

  async function fetchTreinos() {
    const token = await AsyncStorage.getItem("token");
    if (!token) return;
    try {
      const res = await axios.get(`${API_URL}/treinos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFichas(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Erro ao carregar treinos:", err);
      setFichas([]);
    } finally {
      setLoading(false);
    }
  }

  function adicionarExercicio() {
    if (!novoExercicio.trim()) return;
    setListaTempExercicio(prev => [...prev, novoExercicio.trim()]);
    setNovoExercicio("");
  }

  async function salvarNovoTreino() {
    if (!novoNomeTreino.trim() || listaTempExercicio.length === 0) {
      Alert.alert("Atenção 🌸", "Dê um nome ao treino e adicione pelo menos um exercício!");
      return;
    }
    const token = await AsyncStorage.getItem("token");
    const novaFicha = {
      nome: novoNomeTreino,
      categoria: "Musculação",
      duracao: "45 min",
      exercicios: listaTempExercicio,
    };
    setSalvando(true);
    try {
      const res = await axios.post(`${API_URL}/treinos`, novaFicha, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFichas(prev => [res.data, ...prev]);
      setNovoNomeTreino("");
      setListaTempExercicio([]);
      setAba("MeusTreinos");
      Alert.alert("Yay! 💪", "Treino criado com sucesso!");
    } catch (err) {
      console.error("Erro ao salvar treino:", err);
      Alert.alert("Ops! 😢", "Erro ao salvar treino.");
    } finally {
      setSalvando(false);
    }
  }

  async function excluirTreino(id: string) {
    Alert.alert("Excluir treino? 🗑", "Deseja excluir este treino permanentemente?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          const token = await AsyncStorage.getItem("token");
          try {
            await axios.delete(`${API_URL}/treinos/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setFichas(prev => prev.filter(f => f.id !== id));
          } catch (err) {
            Alert.alert("Ops! 😢", "Erro ao excluir treino.");
          }
        },
      },
    ]);
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Título */}
      <Text style={styles.pageTitle}>💪 Treino</Text>
      <Text style={styles.pageSubtitle}>Acompanhe seu progresso e mantenha o foco!</Text>

      {/* Cards de resumo */}
      <View style={styles.cardsRow}>
        <View style={styles.summaryCard}>
          <Dumbbell size={16} color="#ec4899" />
          <Text style={styles.summaryValue}>{fichas.length}</Text>
          <Text style={styles.summaryLabel}>Fichas</Text>
        </View>
        <View style={styles.summaryCard}>
          <Target size={16} color="#ec4899" />
          <Text style={styles.summaryValue}>Pendente</Text>
          <Text style={styles.summaryLabel}>Hoje</Text>
        </View>
        <View style={styles.summaryCard}>
          <Flame size={16} color="#ec4899" />
          <Text style={styles.summaryValue}>12</Text>
          <Text style={styles.summaryLabel}>Dias</Text>
        </View>
        <View style={styles.summaryCard}>
          <Clock size={16} color="#ec4899" />
          <Text style={styles.summaryValue}>320</Text>
          <Text style={styles.summaryLabel}>Kcal</Text>
        </View>
      </View>

      {/* Abas */}
      <View style={styles.tabRow}>
        {(["Hoje", "MeusTreinos", "CriarTreino"] as Aba[]).map(a => (
          <TouchableOpacity
            key={a}
            style={[styles.tab, aba === a && styles.tabActive]}
            onPress={() => setAba(a)}
          >
            <Text style={[styles.tabText, aba === a && styles.tabTextActive]}>
              {a === "MeusTreinos" ? "Meus" : a === "CriarTreino" ? "Criar" : a}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ABA: Hoje */}
      {aba === "Hoje" && (
        <View>
          <Text style={styles.sectionTitle}>
            <Clock size={14} color="#ec4899" /> Treinos Disponíveis
          </Text>
          {loading ? (
            <ActivityIndicator color="#ec4899" style={{ marginTop: 20 }} />
          ) : fichas.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>Nenhuma ficha criada ainda 🌸</Text>
              <TouchableOpacity onPress={() => setAba("CriarTreino")} style={styles.emptyBtn}>
                <Text style={styles.emptyBtnText}>Criar meu primeiro treino 💪</Text>
              </TouchableOpacity>
            </View>
          ) : (
            fichas.map(treino => (
              <View key={treino.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.cardTitle}>{treino.nome}</Text>
                    <Text style={styles.cardMeta}>{treino.categoria} • {treino.duracao}</Text>
                  </View>
                  <TouchableOpacity style={styles.concluirBtn}>
                    <Text style={styles.concluirBtnText}>Concluir</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.exerciciosList}>
                  {treino.exercicios.map((ex, i) => (
                    <View key={i} style={styles.exercicioItem}>
                      <View style={styles.dot} />
                      <Text style={styles.exercicioText}>{ex}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))
          )}
        </View>
      )}

      {/* ABA: Meus Treinos */}
      {aba === "MeusTreinos" && (
        <View>
          {fichas.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>Nenhuma ficha ainda 🌸</Text>
            </View>
          ) : (
            fichas.map(treino => (
              <View key={treino.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardIconRow}>
                    <View style={styles.iconWrapper}>
                      <Dumbbell size={20} color="#ec4899" />
                    </View>
                    <View>
                      <Text style={styles.cardTitle}>{treino.nome}</Text>
                      <Text style={styles.cardMeta}>{treino.duracao}</Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => excluirTreino(treino.id)}>
                    <Trash2 size={18} color="#f9a8d4" />
                  </TouchableOpacity>
                </View>
                <View style={{ marginTop: 12, gap: 6 }}>
                  {treino.exercicios.map((ex, i) => (
                    <View key={i} style={styles.exercicioCardItem}>
                      <CheckCircle size={14} color="#f9a8d4" />
                      <Text style={styles.exercicioCardText}>{ex}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))
          )}
        </View>
      )}

      {/* ABA: Criar Treino */}
      {aba === "CriarTreino" && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>✨ Novo Treino</Text>

          <Text style={styles.label}>Nome da Ficha</Text>
          <TextInput
            placeholder="Ex: Treino de Superiores"
            placeholderTextColor="#f9a8d4"
            value={novoNomeTreino}
            onChangeText={setNovoNomeTreino}
            style={styles.input}
          />

          <Text style={styles.label}>Adicionar Exercícios</Text>
          <View style={styles.exercicioInputRow}>
            <TextInput
              placeholder="Nome do exercício..."
              placeholderTextColor="#f9a8d4"
              value={novoExercicio}
              onChangeText={setNovoExercicio}
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
              onSubmitEditing={adicionarExercicio}
            />
            <TouchableOpacity style={styles.addExercicioBtn} onPress={adicionarExercicio}>
              <Plus size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Lista temporária */}
          <View style={styles.tempList}>
            {listaTempExercicio.map((ex, i) => (
              <View key={i} style={styles.tempItem}>
                <Text style={styles.tempItemText}>{ex}</Text>
                <TouchableOpacity onPress={() => setListaTempExercicio(listaTempExercicio.filter((_, idx) => idx !== i))}>
                  <Trash2 size={14} color="#f9a8d4" />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.addButton, salvando && { opacity: 0.7 }]}
            onPress={salvarNovoTreino}
            disabled={salvando}
          >
            {salvando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.addButtonText}>Criar Treino 💪</Text>
            )}
          </TouchableOpacity>
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
  cardsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#fce7f3",
    padding: 10,
    alignItems: "center",
    gap: 4,
    shadowColor: "#ec4899",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: "800",
    color: "#be185d",
  },
  summaryLabel: {
    fontSize: 10,
    color: "#f9a8d4",
    fontWeight: "600",
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
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: "center",
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
    fontSize: 12,
    fontWeight: "600",
    color: "#f9a8d4",
  },
  tabTextActive: {
    color: "#fff",
    fontWeight: "800",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#be185d",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: "#fce7f3",
    marginBottom: 12,
    shadowColor: "#ec4899",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardIconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#fce7f3",
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#be185d",
  },
  cardMeta: {
    fontSize: 11,
    color: "#f9a8d4",
    fontWeight: "600",
    marginTop: 2,
  },
  concluirBtn: {
    backgroundColor: "#ec4899",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: "#ec4899",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  concluirBtnText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 12,
  },
  exerciciosList: {
    marginTop: 12,
    backgroundColor: "#fff0f6",
    borderRadius: 12,
    padding: 12,
    gap: 6,
  },
  exercicioItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#ec4899",
  },
  exercicioText: {
    fontSize: 13,
    color: "#be185d",
    fontWeight: "500",
  },
  exercicioCardItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fff0f6",
    padding: 10,
    borderRadius: 10,
  },
  exercicioCardText: {
    fontSize: 13,
    color: "#be185d",
    fontWeight: "500",
  },
  empty: {
    alignItems: "center",
    paddingVertical: 32,
    gap: 12,
  },
  emptyText: {
    color: "#f9a8d4",
    fontWeight: "600",
    fontSize: 14,
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
  label: {
    fontSize: 11,
    fontWeight: "700",
    color: "#f9a8d4",
    marginBottom: 6,
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: "#fff0f6",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#fce7f3",
    padding: 14,
    marginBottom: 12,
    color: "#be185d",
    fontSize: 14,
    fontWeight: "600",
  },
  exercicioInputRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
    alignItems: "center",
  },
  addExercicioBtn: {
    width: 48,
    height: 48,
    backgroundColor: "#ec4899",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#ec4899",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  tempList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  tempItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fce7f3",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#f9a8d4",
  },
  tempItemText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#ec4899",
  },
  addButton: {
    backgroundColor: "#ec4899",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#ec4899",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
  },
});