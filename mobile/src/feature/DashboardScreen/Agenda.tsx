import { useState, useEffect } from "react";
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Modal, ActivityIndicator } from "react-native";
import { Calendar, Plus, Trash2, X, BellRing } from "lucide-react-native";
import { useUser } from "../../Context/UserContext";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ItemAgenda {
  id: string;
  descricao: string;
  horario: string;
  data: string;
  concluida: boolean;
}

export default function Agenda() {
  const { user, refreshUser, loading: contextLoading } = useUser();
  const [lembretes, setLembretes] = useState<ItemAgenda[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [novaDesc, setNovaDesc] = useState("");
  const [novaData, setNovaData] = useState("");
  const [novoHorario, setNovoHorario] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const API_URL = "http://localhost:3001"; // ou seu endpoint

  useEffect(() => {
    if (user?.progress?.tarefas) {
      setLembretes(user.progress.tarefas as unknown as ItemAgenda[]);
    }
  }, [user]);

  const adicionarLembrete = async () => {
    if (!novaDesc || !novaData || !novoHorario) return;
    const token = await AsyncStorage.getItem("token");
    if (!token) return;

    setIsSaving(true);
    try {
      await axios.post(
        `${API_URL}/agenda/tarefas`,
        { descricao: novaDesc, data: novaData, horario: novoHorario, concluida: false },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await refreshUser();
      setNovaDesc(""); setNovaData(""); setNovoHorario(""); setIsModalOpen(false);
    } catch (err) {
      console.error("Erro ao salvar:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const excluirLembrete = async (id: string) => {
    const token = await AsyncStorage.getItem("token");
    if (!token) return;
    const novaLista = lembretes.filter(item => item.id !== id);

    try {
      await axios.put(`${API_URL}/progress/tarefas`, novaLista, { headers: { Authorization: `Bearer ${token}` } });
      await refreshUser();
    } catch (err) {
      console.error("Erro ao excluir:", err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sua agenda</Text>
        <TouchableOpacity onPress={() => setIsModalOpen(true)}>
          <Plus size={24} color="#ec4899" />
        </TouchableOpacity>
      </View>

      {contextLoading ? (
        <ActivityIndicator size="large" color="#ec4899" style={{ marginTop: 20 }} />
      ) : lembretes.length === 0 ? (
        <View style={styles.empty}>
          <BellRing size={24} color="#fbb6ce" />
          <Text style={styles.emptyText}>Nada agendado</Text>
        </View>
      ) : (
        <ScrollView style={{ marginTop: 10 }}>
          {lembretes.map(item => (
            <View key={item.id} style={[styles.card, { borderLeftColor: item.concluida ? '#d1d5db' : '#ec4899' }]}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.cardText, item.concluida && styles.concluida]}>{item.descricao}</Text>
                <Text style={styles.cardSubText}>{item.data} • {item.horario}</Text>
              </View>
              <TouchableOpacity onPress={() => excluirLembrete(item.id)}>
                <Trash2 size={20} color="#9ca3af" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Modal */}
      <Modal visible={isModalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Novo Lembrete 🎀</Text>
              <TouchableOpacity onPress={() => setIsModalOpen(false)}>
                <X size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>
            <TextInput
              placeholder="O que vais fazer?"
              value={novaDesc}
              onChangeText={setNovaDesc}
              style={styles.input}
            />
            <TextInput
              placeholder="Data (YYYY-MM-DD)"
              value={novaData}
              onChangeText={setNovaData}
              style={styles.input}
            />
            <TextInput
              placeholder="Horário (HH:MM)"
              value={novoHorario}
              onChangeText={setNovoHorario}
              style={styles.input}
            />
            <TouchableOpacity
              onPress={adicionarLembrete}
              disabled={isSaving}
              style={[styles.button, isSaving && { opacity: 0.5 }]}
            >
              <Text style={styles.buttonText}>{isSaving ? "Guardando..." : "Guardar na Agenda"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 20, fontWeight: "bold", color: "#ec4899" },
  empty: { alignItems: "center", marginTop: 40 },
  emptyText: { fontSize: 12, fontWeight: "bold", color: "#fbb6ce", marginTop: 4 },
  card: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 12, borderLeftWidth: 4, borderRadius: 12, marginBottom: 10, backgroundColor: '#fce7f3' },
  cardText: { fontWeight: "bold", fontSize: 16, color: "#ec4899" },
  cardSubText: { fontSize: 12, color: "#9ca3af" },
  concluida: { textDecorationLine: "line-through", color: "#9ca3af" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", padding: 16 },
  modalContent: { backgroundColor: "white", borderRadius: 20, padding: 20 },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: "bold", color: "#ec4899" },
  input: { borderWidth: 1, borderColor: "#f9a8d4", borderRadius: 12, padding: 12, marginBottom: 12 },
  button: { backgroundColor: "#ec4899", padding: 14, borderRadius: 12, alignItems: "center" },
  buttonText: { color: "white", fontWeight: "bold" },
});