import { useEffect, useState } from "react";
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
import { BookOpen, Hourglass, Target, Trash2 } from "lucide-react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CronometroEstudos from "./CronometroEstudos";

export interface Materia {
  id: string;
  nome: string;
  metaHoras: number;
  horasEstudadas: number;
}

export interface StudySession {
  id?: string;
  materia: string;
  comentario: string;
  duracaoSegundos: number;
  data: string;
}

type Aba = "Materias" | "Cronometro" | "Historico";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function EstudosScreen() {
  const [aba, setAba] = useState<Aba>("Materias");
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [historico, setHistorico] = useState<StudySession[]>([]);
  const [nome, setNome] = useState("");
  const [metaHoras, setMetaHoras] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const token = await AsyncStorage.getItem("token");
    if (!token) return;
    try {
      setLoading(true);
      const [resMaterias, resHistorico] = await Promise.all([
        axios.get(`${API_URL}/estudos/materias`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/estudos/historico`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setMaterias(resMaterias.data || []);
      setHistorico(resHistorico.data || []);
    } catch (err) {
      console.error("Erro ao carregar estudos:", err);
    } finally {
      setLoading(false);
    }
  }

  async function adicionarMateria() {
    if (!nome || !metaHoras) return;
    const token = await AsyncStorage.getItem("token");
    try {
      const res = await axios.post(
        `${API_URL}/estudos/materias`,
        { nome, metaHoras: Number(metaHoras) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMaterias(prev => [...prev, res.data]);
      setNome("");
      setMetaHoras("");
      Alert.alert("Yay! 🌸", "Matéria adicionada com sucesso!");
    } catch (err) {
      Alert.alert("Ops! 😢", "Erro ao adicionar matéria.");
    }
  }

  async function excluirMateria(id: string) {
    Alert.alert("Excluir matéria? 🗑", "Tem certeza que deseja excluir?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          const token = await AsyncStorage.getItem("token");
          const novaLista = materias.filter(m => m.id !== id);
          try {
            await axios.post(
              `${API_URL}/estudos/materias/update-list`,
              { materias: novaLista },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            setMaterias(novaLista);
          } catch (err) {
            Alert.alert("Ops! 😢", "Erro ao excluir matéria.");
          }
        },
      },
    ]);
  }

  async function finalizarSessao(sessao: StudySession) {
    const token = await AsyncStorage.getItem("token");
    try {
      const res = await axios.post(
        `${API_URL}/estudos/historico`,
        sessao,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHistorico(prev => [res.data, ...prev]);
      setMaterias(prev =>
        prev.map(m =>
          m.nome === sessao.materia
            ? { ...m, horasEstudadas: (m.horasEstudadas || 0) + sessao.duracaoSegundos / 3600 }
            : m
        )
      );
      setAba("Historico");
      Alert.alert("Sessão finalizada! 🏆", `${(sessao.duracaoSegundos / 60).toFixed(0)} minutos focados!`);
    } catch (err) {
      Alert.alert("Ops! 😢", "Erro ao finalizar sessão.");
    }
  }

  const totalHoras = materias.reduce((acc, m) => acc + (m.horasEstudadas || 0), 0);
  const totalSessoes = historico.length;
  const totalMaterias = materias.length;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Título */}
      <Text style={styles.pageTitle}>📚 Estudos</Text>
      <Text style={styles.pageSubtitle}>Organize seus estudos e acompanhe o progresso</Text>

      {/* Cards resumo */}
      <View style={styles.cardsRow}>
        <View style={styles.summaryCard}>
          <BookOpen size={16} color="#ec4899" />
          <Text style={styles.summaryValue}>{totalMaterias}</Text>
          <Text style={styles.summaryLabel}>Matérias</Text>
        </View>
        <View style={styles.summaryCard}>
          <Hourglass size={16} color="#ec4899" />
          <Text style={styles.summaryValue}>{totalHoras.toFixed(1)}h</Text>
          <Text style={styles.summaryLabel}>Estudadas</Text>
        </View>
        <View style={styles.summaryCard}>
          <Target size={16} color="#ec4899" />
          <Text style={styles.summaryValue}>{totalSessoes}</Text>
          <Text style={styles.summaryLabel}>Sessões</Text>
        </View>
      </View>

      {/* Abas */}
      <View style={styles.tabRow}>
        {(["Materias", "Cronometro", "Historico"] as Aba[]).map(a => (
          <TouchableOpacity
            key={a}
            style={[styles.tab, aba === a && styles.tabActive]}
            onPress={() => setAba(a)}
          >
            <Text style={[styles.tabText, aba === a && styles.tabTextActive]}>
              {a === "Materias" ? "Matérias" : a === "Cronometro" ? "Cronômetro" : "Histórico"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator color="#ec4899" style={{ marginTop: 32 }} />
      ) : (
        <>
          {/* ABA: Matérias */}
          {aba === "Materias" && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>📖 Gerenciar Matérias</Text>

              <TextInput
                placeholder="Nome da matéria (ex: JavaScript)"
                placeholderTextColor="#f9a8d4"
                value={nome}
                onChangeText={setNome}
                style={styles.input}
              />
              <TextInput
                placeholder="Meta de horas totais"
                placeholderTextColor="#f9a8d4"
                value={metaHoras}
                onChangeText={setMetaHoras}
                keyboardType="numeric"
                style={styles.input}
              />
              <TouchableOpacity style={styles.addButton} onPress={adicionarMateria}>
                <Text style={styles.addButtonText}>+ Adicionar Matéria</Text>
              </TouchableOpacity>

              <View style={{ marginTop: 20, gap: 10 }}>
                {materias.length === 0 ? (
                  <Text style={styles.emptyText}>Nenhuma matéria cadastrada ainda 🌸</Text>
                ) : (
                  materias.map(m => {
                    const porcentagem = m.metaHoras > 0
                      ? Math.min(((m.horasEstudadas || 0) / m.metaHoras) * 100, 100)
                      : 0;
                    return (
                      <View key={m.id} style={styles.materiaCard}>
                        <View style={styles.materiaHeader}>
                          <View style={styles.materiaIconWrapper}>
                            <BookOpen size={16} color="#ec4899" />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.materiaTitle}>{m.nome}</Text>
                            <Text style={styles.materiaMeta}>
                              {(m.horasEstudadas || 0).toFixed(1)}h / {m.metaHoras}h
                            </Text>
                          </View>
                          <TouchableOpacity onPress={() => excluirMateria(m.id)}>
                            <Trash2 size={16} color="#f9a8d4" />
                          </TouchableOpacity>
                        </View>
                        <View style={styles.progressBg}>
                          <View style={[styles.progressFill, { width: `${porcentagem}%` }]} />
                        </View>
                      </View>
                    );
                  })
                )}
              </View>
            </View>
          )}

          {/* ABA: Cronômetro */}
          {aba === "Cronometro" && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>⏱ Cronômetro de Estudos</Text>
              <CronometroEstudos
                materias={materias.map(m => m.nome)}
                onFinalizar={finalizarSessao}
              />
            </View>
          )}

          {/* ABA: Histórico */}
          {aba === "Historico" && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>📋 Sessões Recentes</Text>
              {historico.length === 0 ? (
                <Text style={styles.emptyText}>Nenhuma sessão realizada ainda 🌸</Text>
              ) : (
                historico.map((h, i) => (
                  <View key={h.id || i} style={styles.historicoCard}>
                    <View style={styles.historicoSidebar} />
                    <View style={{ flex: 1, paddingLeft: 12 }}>
                      <View style={styles.historicoHeader}>
                        <Text style={styles.historicoMateria}>{h.materia}</Text>
                        <Text style={styles.historicoData}>
                          {h.data ? new Date(h.data).toLocaleDateString("pt-BR") : "Data n/a"}
                        </Text>
                      </View>
                      {h.comentario ? (
                        <Text style={styles.historicoComentario}>{h.comentario}</Text>
                      ) : null}
                      <Text style={styles.historicoDuracao}>
                        ⏱ {(h.duracaoSegundos / 60).toFixed(0)} minutos focados
                      </Text>
                    </View>
                  </View>
                ))
              )}
            </View>
          )}
        </>
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
    fontSize: 14,
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
    fontSize: 11,
    fontWeight: "600",
    color: "#f9a8d4",
  },
  tabTextActive: {
    color: "#fff",
    fontWeight: "800",
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
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#be185d",
    marginBottom: 16,
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
  addButton: {
    backgroundColor: "#ec4899",
    padding: 14,
    borderRadius: 14,
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
  emptyText: {
    textAlign: "center",
    color: "#f9a8d4",
    fontWeight: "600",
    paddingVertical: 16,
  },
  materiaCard: {
    backgroundColor: "#fff0f6",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#fce7f3",
  },
  materiaHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  materiaIconWrapper: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#fce7f3",
    alignItems: "center",
    justifyContent: "center",
  },
  materiaTitle: {
    fontWeight: "800",
    fontSize: 14,
    color: "#be185d",
  },
  materiaMeta: {
    fontSize: 11,
    color: "#f9a8d4",
    fontWeight: "500",
  },
  progressBg: {
    height: 6,
    backgroundColor: "#fce7f3",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: 6,
    backgroundColor: "#ec4899",
    borderRadius: 3,
  },
  historicoCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#fce7f3",
  },
  historicoSidebar: {
    width: 4,
    alignSelf: "stretch",
    backgroundColor: "#ec4899",
    borderRadius: 4,
  },
  historicoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  historicoMateria: {
    fontWeight: "800",
    fontSize: 14,
    color: "#be185d",
  },
  historicoData: {
    fontSize: 11,
    color: "#f9a8d4",
    backgroundColor: "#fce7f3",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  historicoComentario: {
    fontSize: 12,
    color: "#9ca3af",
    fontStyle: "italic",
    marginTop: 2,
  },
  historicoDuracao: {
    fontSize: 12,
    fontWeight: "700",
    color: "#ec4899",
    marginTop: 4,
  },
});