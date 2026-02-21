import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { ChevronLeft, ChevronRight, X, Thermometer, Droplets, Brain, Wind, Smile } from "lucide-react-native";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, addDays, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "@/src/Context/UserContext";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

interface Sintomas {
  dorDeCabeca: boolean;
  colica: boolean;
  inchaco: boolean;
  seiosSensiveis: boolean;
  humorInstavel: boolean;
}

interface RegistroDia {
  data: string;
  menstruando: boolean;
  sintomas: Sintomas;
  notas: string;
}

const SINTOMAS_VAZIO: Sintomas = {
  dorDeCabeca: false,
  colica: false,
  inchaco: false,
  seiosSensiveis: false,
  humorInstavel: false,
};

export default function SaudeScreen() {
  const { user, refreshUser } = useUser();
  const [aba, setAba] = useState<"Calendario" | "Historico">("Calendario");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [registros, setRegistros] = useState<Record<string, RegistroDia>>({});
  const [diaSelecionado, setDiaSelecionado] = useState<string | null>(null);

  useEffect(() => {
    const rawSaude = user?.progress?.saude as Record<string, any> | undefined;
    if (rawSaude) {
      const formatados: Record<string, RegistroDia> = {};
      Object.keys(rawSaude).forEach(key => {
        const item = rawSaude[key];
        formatados[key] = {
          data: item.data || key,
          menstruando: !!item.menstruando,
          notas: item.notas || "",
          sintomas: {
            dorDeCabeca: !!item.sintomas?.dorDeCabeca,
            colica: !!item.sintomas?.colica,
            inchaco: !!item.sintomas?.inchaco,
            seiosSensiveis: !!item.sintomas?.seiosSensiveis,
            humorInstavel: !!item.sintomas?.humorInstavel,
          },
        };
      });
      setRegistros(formatados);
    }
  }, [user]);

  async function atualizarDia(data: string, updates: Partial<RegistroDia>) {
    const token = await AsyncStorage.getItem("token");
    if (!token) return;

    const diaAtual = registros[data] || {
      data,
      menstruando: false,
      notas: "",
      sintomas: { ...SINTOMAS_VAZIO },
    };

    const novoRegistro: RegistroDia = {
      ...diaAtual,
      ...updates,
      sintomas: { ...diaAtual.sintomas, ...(updates.sintomas || {}) },
    };

    try {
      await axios.post(`${API_URL}/saude`, novoRegistro, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRegistros(prev => ({ ...prev, [data]: novoRegistro }));
      await refreshUser();
    } catch (err) {
      Alert.alert("Ops! 😢", "Erro ao salvar dados de saúde.");
    }
  }

  function gerarSemanas() {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const semanas: string[][] = [];
    let semana: string[] = [];
    let day = startDate;

    while (day <= endDate) {
      semana.push(format(day, "yyyy-MM-dd"));
      if (semana.length === 7) {
        semanas.push(semana);
        semana = [];
      }
      day = addDays(day, 1);
    }
    return semanas;
  }

  const semanas = gerarSemanas();
  const diasSemana = ["D", "S", "T", "Q", "Q", "S", "S"];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.pageTitle}>🌸 Saúde</Text>
      <Text style={styles.pageSubtitle}>Acompanhe seu ciclo e bem-estar</Text>

      {/* Abas */}
      <View style={styles.tabRow}>
        {(["Calendario", "Historico"] as const).map(a => (
          <TouchableOpacity
            key={a}
            style={[styles.tab, aba === a && styles.tabActive]}
            onPress={() => setAba(a)}
          >
            <Text style={[styles.tabText, aba === a && styles.tabTextActive]}>
              {a === "Calendario" ? "Calendário" : "Histórico"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ABA: Calendário */}
      {aba === "Calendario" && (
        <View style={styles.card}>
          <View style={styles.mesNav}>
            <TouchableOpacity style={styles.navBtn} onPress={() => setCurrentMonth(subMonths(currentMonth, 1))}>
              <ChevronLeft size={20} color="#ec4899" />
            </TouchableOpacity>
            <Text style={styles.mesTitle}>
              {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
            </Text>
            <TouchableOpacity style={styles.navBtn} onPress={() => setCurrentMonth(addMonths(currentMonth, 1))}>
              <ChevronRight size={20} color="#ec4899" />
            </TouchableOpacity>
          </View>

          <View style={styles.diasSemanaRow}>
            {diasSemana.map((d, i) => (
              <Text key={i} style={styles.diaSemanaText}>{d}</Text>
            ))}
          </View>

          {semanas.map((semana, si) => (
            <View key={si} style={styles.semanaRow}>
              {semana.map(dStr => {
                const reg = registros[dStr];
                const isCurrentMonth = isSameMonth(parseISO(dStr), currentMonth);
                const isToday = dStr === format(new Date(), "yyyy-MM-dd");
                return (
                  <TouchableOpacity
                    key={dStr}
                    style={[
                      styles.diaCell,
                      reg?.menstruando && styles.diaMenstruando,
                      isToday && !reg?.menstruando && styles.diaHoje,
                      !isCurrentMonth && styles.diaOutroMes,
                    ]}
                    onPress={() => isCurrentMonth && setDiaSelecionado(dStr)}
                    disabled={!isCurrentMonth}
                  >
                    <Text style={[
                      styles.diaNum,
                      reg?.menstruando && styles.diaNumBranco,
                      isToday && !reg?.menstruando && styles.diaNumHoje,
                      !isCurrentMonth && styles.diaNumOutroMes,
                    ]}>
                      {format(parseISO(dStr), "d")}
                    </Text>
                    <View style={styles.dotsRow}>
                      {reg?.sintomas.colica && <View style={[styles.dot, { backgroundColor: "#fbbf24" }]} />}
                      {reg?.sintomas.dorDeCabeca && <View style={[styles.dot, { backgroundColor: "#a78bfa" }]} />}
                      {reg?.sintomas.inchaco && <View style={[styles.dot, { backgroundColor: "#60a5fa" }]} />}
                      {reg?.sintomas.humorInstavel && <View style={[styles.dot, { backgroundColor: "#34d399" }]} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}

          {/* Legenda */}
          <View style={styles.legenda}>
            {[
              { cor: "#ec4899", label: "Menstruação" },
              { cor: "#fbbf24", label: "Cólica" },
              { cor: "#a78bfa", label: "Cabeça" },
              { cor: "#34d399", label: "Humor" },
            ].map(l => (
              <View key={l.label} style={styles.legendaItem}>
                <View style={[styles.legendaDot, { backgroundColor: l.cor }]} />
                <Text style={styles.legendaText}>{l.label}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* ABA: Histórico */}
      {aba === "Historico" && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>📋 Histórico</Text>
          {Object.values(registros).length === 0 ? (
            <Text style={styles.emptyText}>Nenhum registro ainda 🌸</Text>
          ) : (
            Object.values(registros)
              .sort((a, b) => b.data.localeCompare(a.data))
              .map(reg => (
                <TouchableOpacity
                  key={reg.data}
                  style={styles.historicoCard}
                  onPress={() => setDiaSelecionado(reg.data)}
                >
                  <Text style={styles.historicoData}>
                    {format(parseISO(reg.data), "dd/MM/yy")}
                  </Text>
                  {reg.menstruando && <Droplets size={16} color="#ec4899" />}
                  <View style={styles.dotsRow}>
                    {reg.sintomas.colica && <View style={[styles.dot, { backgroundColor: "#fbbf24" }]} />}
                    {reg.sintomas.dorDeCabeca && <View style={[styles.dot, { backgroundColor: "#a78bfa" }]} />}
                    {reg.sintomas.inchaco && <View style={[styles.dot, { backgroundColor: "#60a5fa" }]} />}
                    {reg.sintomas.humorInstavel && <View style={[styles.dot, { backgroundColor: "#34d399" }]} />}
                  </View>
                </TouchableOpacity>
              ))
          )}
        </View>
      )}

      <View style={{ height: 32 }} />

      {/* Modal */}
      <ModalSintomas
        dia={diaSelecionado}
        registros={registros}
        onClose={() => setDiaSelecionado(null)}
        onUpdate={atualizarDia}
      />
    </ScrollView>
  );
}

function ModalSintomas({ dia, registros, onClose, onUpdate }: {
  dia: string | null;
  registros: Record<string, RegistroDia>;
  onClose: () => void;
  onUpdate: (d: string, u: Partial<RegistroDia>) => Promise<void>;
}) {
  const reg = dia
    ? registros[dia] || { menstruando: false, notas: "", sintomas: { ...SINTOMAS_VAZIO } }
    : null;

  return (
    <Modal visible={!!dia} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose} />
      {dia && reg && (
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {format(parseISO(dia), "dd 'de' MMMM", { locale: ptBR })}
            </Text>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <X size={18} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.fluxoBtn, reg.menstruando && styles.fluxoBtnActive]}
            onPress={() => onUpdate(dia, { menstruando: !reg.menstruando })}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <Droplets size={20} color="#ec4899" />
              <Text style={styles.fluxoBtnText}>Fluxo Menstrual</Text>
            </View>
            <View style={[styles.checkCircle, reg.menstruando && styles.checkCircleActive]} />
          </TouchableOpacity>

          <View style={styles.sintomasGrid}>
            {[
              { key: "colica", label: "Cólica", icon: <Thermometer size={16} color={reg.sintomas.colica ? "#d97706" : "#9ca3af"} />, cor: "#fef3c7", border: "#fbbf24" },
              { key: "dorDeCabeca", label: "Cabeça", icon: <Brain size={16} color={reg.sintomas.dorDeCabeca ? "#7c3aed" : "#9ca3af"} />, cor: "#ede9fe", border: "#a78bfa" },
              { key: "inchaco", label: "Inchaço", icon: <Wind size={16} color={reg.sintomas.inchaco ? "#2563eb" : "#9ca3af"} />, cor: "#dbeafe", border: "#60a5fa" },
              { key: "humorInstavel", label: "Humor", icon: <Smile size={16} color={reg.sintomas.humorInstavel ? "#059669" : "#9ca3af"} />, cor: "#d1fae5", border: "#34d399" },
            ].map(s => (
              <TouchableOpacity
                key={s.key}
                style={[
                  styles.sintomaBtn,
                  (reg.sintomas as any)[s.key]
                    ? { backgroundColor: s.cor, borderColor: s.border }
                    : { backgroundColor: "#f9fafb", borderColor: "#f3f4f6" },
                ]}
                onPress={() => onUpdate(dia, { sintomas: { ...reg.sintomas, [s.key]: !(reg.sintomas as any)[s.key] } })}
              >
                {s.icon}
                <Text style={[styles.sintomaBtnText, (reg.sintomas as any)[s.key] && { color: "#374151" }]}>
                  {s.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            placeholder="Notas sobre o dia... 📝"
            placeholderTextColor="#f9a8d4"
            value={reg.notas}
            onChangeText={text => onUpdate(dia, { notas: text })}
            multiline
            style={styles.notasInput}
          />
        </View>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff0f6", paddingHorizontal: 16, paddingTop: 56 },
  pageTitle: { fontSize: 28, fontWeight: "900", color: "#be185d" },
  pageSubtitle: { fontSize: 13, color: "#f9a8d4", fontWeight: "500", marginBottom: 16, marginTop: 2 },
  tabRow: { flexDirection: "row", backgroundColor: "#fce7f3", borderRadius: 16, padding: 4, marginBottom: 16, gap: 4 },
  tab: { flex: 1, paddingVertical: 8, borderRadius: 12, alignItems: "center" },
  tabActive: { backgroundColor: "#ec4899", shadowColor: "#ec4899", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 4 },
  tabText: { fontSize: 13, fontWeight: "600", color: "#f9a8d4" },
  tabTextActive: { color: "#fff", fontWeight: "800" },
  card: { backgroundColor: "#fff", borderRadius: 20, padding: 16, borderWidth: 1.5, borderColor: "#fce7f3", marginBottom: 12, shadowColor: "#ec4899", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  sectionTitle: { fontSize: 15, fontWeight: "800", color: "#be185d", marginBottom: 12 },
  mesNav: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  navBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#fce7f3", alignItems: "center", justifyContent: "center" },
  mesTitle: { fontSize: 14, fontWeight: "800", color: "#be185d", textTransform: "capitalize" },
  diasSemanaRow: { flexDirection: "row", marginBottom: 4 },
  diaSemanaText: { flex: 1, textAlign: "center", fontSize: 11, fontWeight: "700", color: "#f9a8d4" },
  semanaRow: { flexDirection: "row", marginBottom: 2 },
  diaCell: { flex: 1, aspectRatio: 1, alignItems: "center", justifyContent: "center", borderRadius: 10, margin: 1 },
  diaMenstruando: { backgroundColor: "#ec4899" },
  diaHoje: { backgroundColor: "#fce7f3", borderWidth: 1.5, borderColor: "#ec4899" },
  diaOutroMes: { opacity: 0.2 },
  diaNum: { fontSize: 12, fontWeight: "700", color: "#6b7280" },
  diaNumBranco: { color: "#fff" },
  diaNumHoje: { color: "#ec4899" },
  diaNumOutroMes: { color: "#d1d5db" },
  dotsRow: { flexDirection: "row", gap: 2, marginTop: 2 },
  dot: { width: 4, height: 4, borderRadius: 2 },
  legenda: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 12, marginTop: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: "#fce7f3" },
  legendaItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendaDot: { width: 10, height: 10, borderRadius: 5 },
  legendaText: { fontSize: 11, color: "#9ca3af", fontWeight: "500" },
  historicoCard: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#fce7f3" },
  historicoData: { fontSize: 13, fontWeight: "700", color: "#be185d", width: 60 },
  emptyText: { textAlign: "center", color: "#f9a8d4", fontWeight: "600", paddingVertical: 16 },
  modalOverlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.4)" },
  modalContent: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "#fff", borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, gap: 16 },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  modalTitle: { fontSize: 18, fontWeight: "900", color: "#be185d", textTransform: "capitalize" },
  closeBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: "#f3f4f6", alignItems: "center", justifyContent: "center" },
  fluxoBtn: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16, borderRadius: 16, borderWidth: 2, borderColor: "#f3f4f6", backgroundColor: "#f9fafb" },
  fluxoBtnActive: { borderColor: "#ec4899", backgroundColor: "#fce7f3" },
  fluxoBtnText: { fontWeight: "700", fontSize: 15, color: "#ec4899" },
  checkCircle: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: "#e5e7eb", backgroundColor: "#fff" },
  checkCircleActive: { backgroundColor: "#ec4899", borderColor: "#ec4899" },
  sintomasGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  sintomaBtn: { width: "47%", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, padding: 14, borderRadius: 14, borderWidth: 2 },
  sintomaBtnText: { fontSize: 12, fontWeight: "800", color: "#9ca3af", textTransform: "uppercase" },
  notasInput: { backgroundColor: "#fff0f6", borderRadius: 16, borderWidth: 1.5, borderColor: "#fce7f3", padding: 14, color: "#be185d", fontWeight: "600", fontSize: 14, minHeight: 100, textAlignVertical: "top" },
});