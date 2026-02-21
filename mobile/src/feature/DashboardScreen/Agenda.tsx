import { useState, useEffect } from "react";
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Modal, ActivityIndicator } from "react-native";
import { Plus, Trash2, X, BellRing, CalendarHeart } from "lucide-react-native";
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

  const API_URL = process.env.EXPO_PUBLIC_API_URL;

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
      setNovaDesc("");
      setNovaData("");
      setNovoHorario("");
      setIsModalOpen(false);
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
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleWrapper}>
          <CalendarHeart size={20} color="#ec4899" />
          <Text style={styles.title}>Sua agenda</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => setIsModalOpen(true)}>
          <Plus size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Conteúdo */}
      {contextLoading ? (
        <ActivityIndicator size="large" color="#ec4899" style={{ marginTop: 20 }} />
      ) : lembretes.length === 0 ? (
        <View style={styles.empty}>
          <BellRing size={28} color="#f9a8d4" />
          <Text style={styles.emptyText}>Nada agendado ainda 🌸</Text>
          <Text style={styles.emptySubText}>Toca no + para adicionar!</Text>
        </View>
      ) : (
        <ScrollView style={{ marginTop: 10 }} showsVerticalScrollIndicator={false}>
          {lembretes.map(item => (
            <View key={item.id} style={[styles.card, item.concluida && styles.cardConcluida]}>
              {/* Barra lateral colorida */}
              <View style={[styles.sidebar, item.concluida && styles.sidebarConcluida]} />

              <View style={{ flex: 1, paddingLeft: 12 }}>
                <Text style={[styles.cardText, item.concluida && styles.textConcluida]}>
                  {item.descricao}
                </Text>
                <Text style={styles.cardSubText}>
                  📅 {item.data} • ⏰ {item.horario}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => excluirLembrete(item.id)}
              >
                <Trash2 size={16} color="#ec4899" />
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
              <Text style={styles.modalTitle}>🎀 Novo Lembrete</Text>
              <TouchableOpacity onPress={() => setIsModalOpen(false)}>
                <X size={20} color="#f9a8d4" />
              </TouchableOpacity>
            </View>

            <TextInput
              placeholder="O que vais fazer? 💭"
              value={novaDesc}
              onChangeText={setNovaDesc}
              style={styles.input}
              placeholderTextColor="#f9a8d4"
            />
            <TextInput
              placeholder="Data (YYYY-MM-DD) 📅"
              value={novaData}
              onChangeText={setNovaData}
              style={styles.input}
              placeholderTextColor="#f9a8d4"
            />
            <TextInput
              placeholder="Horário (HH:MM) ⏰"
              value={novoHorario}
              onChangeText={setNovoHorario}
              style={styles.input}
              placeholderTextColor="#f9a8d4"
            />

            <TouchableOpacity
              onPress={adicionarLembrete}
              disabled={isSaving}
              style={[styles.button, isSaving && { opacity: 0.5 }]}
            >
              <Text style={styles.buttonText}>
                {isSaving ? "Guardando... 💾" : "Guardar na Agenda 🌸"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  titleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#be185d",
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#ec4899",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#ec4899",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  empty: {
    alignItems: "center",
    marginTop: 24,
    gap: 6,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#f472b6",
    marginTop: 4,
  },
  emptySubText: {
    fontSize: 12,
    color: "#f9a8d4",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#fce7f3",
    overflow: "hidden",
    shadowColor: "#ec4899",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    paddingVertical: 14,
    paddingRight: 14,
  },
  cardConcluida: {
    backgroundColor: "#f9fafb",
    borderColor: "#e5e7eb",
  },
  sidebar: {
    width: 5,
    alignSelf: "stretch",
    backgroundColor: "#ec4899",
    borderRadius: 4,
    marginLeft: 4,
  },
  sidebarConcluida: {
    backgroundColor: "#d1d5db",
  },
  cardText: {
    fontWeight: "700",
    fontSize: 15,
    color: "#be185d",
  },
  textConcluida: {
    textDecorationLine: "line-through",
    color: "#9ca3af",
  },
  cardSubText: {
    fontSize: 11,
    color: "#f9a8d4",
    marginTop: 4,
    fontWeight: "500",
  },
  deleteBtn: {
    padding: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(236, 72, 153, 0.15)",
    justifyContent: "center",
    padding: 16,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1.5,
    borderColor: "#fce7f3",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#be185d",
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#fce7f3",
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    color: "#be185d",
    fontWeight: "600",
    backgroundColor: "#fff0f6",
  },
  button: {
    backgroundColor: "#ec4899",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 4,
    shadowColor: "#ec4899",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
  },
});