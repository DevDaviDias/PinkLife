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
import {
  ChevronLeft, ChevronRight, X, Thermometer,
  Droplets, Brain, Wind, Smile, TrendingUp, Heart
} from "lucide-react-native";
import {
  format, addMonths, subMonths, startOfMonth, endOfMonth,
  startOfWeek, endOfWeek, isSameMonth, addDays, parseISO, differenceInDays
} from "date-fns";
import { ptBR } from "date-fns/locale";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "@/src/Context/UserContext";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

type IntensidadeFluxo = "leve" | "moderado" | "intenso" | null;
type IntensidadeDor = "leve" | "moderada" | "forte" | "insuportável" | null;
type TipoHumor = "feliz" | "ansiosa" | "irritada" | "triste" | "sensível" | "normal" | null;

interface Sintomas {
  dorDeCabeca: boolean;
  intensidadeDorDeCabeca: IntensidadeDor;
  colica: boolean;
  intensidadeColica: IntensidadeDor;
  inchaco: boolean;
  seiosSensiveis: boolean;
  humorInstavel: boolean;
  tipoHumor: TipoHumor;
}

interface RegistroDia {
  data: string;
  menstruando: boolean;
  intensidadeFluxo: IntensidadeFluxo;
  sintomas: Sintomas;
  notas: string;
}

const SINTOMAS_VAZIO: Sintomas = {
  dorDeCabeca: false,
  intensidadeDorDeCabeca: null,
  colica: false,
  intensidadeColica: null,
  inchaco: false,
  seiosSensiveis: false,
  humorInstavel: false,
  tipoHumor: null,
};

const HUMORES = [
  { key: "feliz", emoji: "😊", label: "Feliz" },
  { key: "ansiosa", emoji: "😰", label: "Ansiosa" },
  { key: "irritada", emoji: "😤", label: "Irritada" },
  { key: "triste", emoji: "😢", label: "Triste" },
  { key: "sensível", emoji: "🥺", label: "Sensível" },
  { key: "normal", emoji: "😐", label: "Normal" },
];

const INTENSIDADES_DOR: { key: IntensidadeDor; label: string; cor: string }[] = [
  { key: "leve", label: "Leve", cor: "#86efac" },
  { key: "moderada", label: "Moderada", cor: "#fbbf24" },
  { key: "forte", label: "Forte", cor: "#f97316" },
  { key: "insuportável", label: "Insuportável", cor: "#ef4444" },
];

const INTENSIDADES_FLUXO: { key: IntensidadeFluxo; label: string; emoji: string }[] = [
  { key: "leve", label: "Leve", emoji: "🩸" },
  { key: "moderado", label: "Moderado", emoji: "🩸🩸" },
  { key: "intenso", label: "Intenso", emoji: "🩸🩸🩸" },
];

export default function SaudeScreen() {
  const { user, refreshUser } = useUser();
  const [aba, setAba] = useState<"Calendario" | "Resumo" | "Historico">("Calendario");
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
          intensidadeFluxo: item.intensidadeFluxo || null,
          notas: item.notas || "",
          sintomas: {
            dorDeCabeca: !!item.sintomas?.dorDeCabeca,
            intensidadeDorDeCabeca: item.sintomas?.intensidadeDorDeCabeca || null,
            colica: !!item.sintomas?.colica,
            intensidadeColica: item.sintomas?.intensidadeColica || null,
            inchaco: !!item.sintomas?.inchaco,
            seiosSensiveis: !!item.sintomas?.seiosSensiveis,
            humorInstavel: !!item.sintomas?.humorInstavel,
            tipoHumor: item.sintomas?.tipoHumor || null,
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
      intensidadeFluxo: null,
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
    } catch {
      Alert.alert("Ops! 😢", "Erro ao salvar.");
    }
  }

  // --- Análise do ciclo ---
  const diasMenstruando = Object.values(registros).filter(r => r.menstruando).map(r => r.data).sort();
  const duracaoCicloAtual = diasMenstruando.length;

  function calcularProximoCiclo(): string {
    if (diasMenstruando.length < 2) return "Registre mais dias para prever 🌸";
    const ultimo = parseISO(diasMenstruando[diasMenstruando.length - 1]);
    const previsao = addDays(ultimo, 28);
    return format(previsao, "dd 'de' MMMM", { locale: ptBR });
  }

  function sintomaMaisFrequente(): string {
    const contagem = { colica: 0, dorDeCabeca: 0, inchaco: 0, humorInstavel: 0 };
    Object.values(registros).forEach(r => {
      if (r.sintomas.colica) contagem.colica++;
      if (r.sintomas.dorDeCabeca) contagem.dorDeCabeca++;
      if (r.sintomas.inchaco) contagem.inchaco++;
      if (r.sintomas.humorInstavel) contagem.humorInstavel++;
    });
    const max = Math.max(...Object.values(contagem));
    if (max === 0) return "Nenhum ainda";
    const nomes: Record<string, string> = { colica: "Cólica 🔥", dorDeCabeca: "Dor de cabeça 🧠", inchaco: "Inchaço 💨", humorInstavel: "Humor instável 😤" };
    return nomes[Object.keys(contagem).find(k => (contagem as any)[k] === max) || ""] || "—";
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
      if (semana.length === 7) { semanas.push(semana); semana = []; }
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
        {(["Calendario", "Resumo", "Historico"] as const).map(a => (
          <TouchableOpacity
            key={a}
            style={[styles.tab, aba === a && styles.tabActive]}
            onPress={() => setAba(a)}
          >
            <Text style={[styles.tabText, aba === a && styles.tabTextActive]}>
              {a === "Calendario" ? "Calendário" : a === "Resumo" ? "Análise" : "Histórico"}
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
            {diasSemana.map((d, i) => <Text key={i} style={styles.diaSemanaText}>{d}</Text>)}
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
                      {reg?.sintomas.humorInstavel && <View style={[styles.dot, { backgroundColor: "#34d399" }]} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}

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

      {/* ABA: Análise */}
      {aba === "Resumo" && (
        <View style={{ gap: 12 }}>
          {/* Cards de resumo */}
          <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: "#fce7f3" }]}>
              <Droplets size={20} color="#ec4899" />
              <Text style={styles.statValor}>{duracaoCicloAtual}</Text>
              <Text style={styles.statLabel}>Dias registrados</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: "#ede9fe" }]}>
              <Heart size={20} color="#7c3aed" />
              <Text style={styles.statValor}>28</Text>
              <Text style={styles.statLabel}>Ciclo médio</Text>
            </View>
          </View>

          {/* Previsão */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>🔮 Próxima Menstruação</Text>
            <View style={styles.previsaoCard}>
              <Text style={styles.previsaoData}>{calcularProximoCiclo()}</Text>
              <Text style={styles.previsaoSub}>Previsão baseada nos seus registros</Text>
            </View>
          </View>

          {/* Sintoma mais frequente */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>📊 Sintoma Mais Frequente</Text>
            <View style={styles.sintomaFreqCard}>
              <Text style={styles.sintomaFreqText}>{sintomaMaisFrequente()}</Text>
            </View>
          </View>

          {/* Análise de humor */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>😊 Registros de Humor</Text>
            {Object.values(registros).filter(r => r.sintomas.tipoHumor).length === 0 ? (
              <Text style={styles.emptyText}>Registre seu humor nos dias do calendário 🌸</Text>
            ) : (
              <View style={styles.humorResumo}>
                {HUMORES.map(h => {
                  const count = Object.values(registros).filter(r => r.sintomas.tipoHumor === h.key).length;
                  if (count === 0) return null;
                  return (
                    <View key={h.key} style={styles.humorResumoItem}>
                      <Text style={styles.humorEmoji}>{h.emoji}</Text>
                      <Text style={styles.humorLabel}>{h.label}</Text>
                      <View style={styles.humorBarBg}>
                        <View style={[styles.humorBarFill, { width: `${(count / Object.values(registros).length) * 100}%` }]} />
                      </View>
                      <Text style={styles.humorCount}>{count}x</Text>
                    </View>
                  );
                })}
              </View>
            )}
          </View>

          {/* Análise de fluxo */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>🩸 Intensidade do Fluxo</Text>
            {INTENSIDADES_FLUXO.map(f => {
              const count = Object.values(registros).filter(r => r.intensidadeFluxo === f.key).length;
              if (count === 0) return null;
              return (
                <View key={f.key} style={styles.fluxoResumoItem}>
                  <Text style={styles.fluxoEmoji}>{f.emoji}</Text>
                  <Text style={styles.fluxoLabel}>{f.label}</Text>
                  <Text style={styles.fluxoCount}>{count} dias</Text>
                </View>
              );
            })}
            {Object.values(registros).filter(r => r.intensidadeFluxo).length === 0 && (
              <Text style={styles.emptyText}>Registre a intensidade nos dias do calendário 🌸</Text>
            )}
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
              .map(reg => {
                const humor = HUMORES.find(h => h.key === reg.sintomas.tipoHumor);
                return (
                  <TouchableOpacity
                    key={reg.data}
                    style={styles.historicoCard}
                    onPress={() => setDiaSelecionado(reg.data)}
                  >
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                        <Text style={styles.historicoData}>
                          {format(parseISO(reg.data), "dd/MM/yy")}
                        </Text>
                        {reg.menstruando && (
                          <View style={styles.fluxoBadge}>
                            <Text style={styles.fluxoBadgeText}>
                              🩸 {reg.intensidadeFluxo || "fluxo"}
                            </Text>
                          </View>
                        )}
                        {humor && <Text style={{ fontSize: 16 }}>{humor.emoji}</Text>}
                      </View>
                      <View style={styles.dotsRow}>
                        {reg.sintomas.colica && <View style={[styles.dot, { backgroundColor: "#fbbf24", width: 8, height: 8 }]} />}
                        {reg.sintomas.dorDeCabeca && <View style={[styles.dot, { backgroundColor: "#a78bfa", width: 8, height: 8 }]} />}
                        {reg.sintomas.inchaco && <View style={[styles.dot, { backgroundColor: "#60a5fa", width: 8, height: 8 }]} />}
                        {reg.sintomas.humorInstavel && <View style={[styles.dot, { backgroundColor: "#34d399", width: 8, height: 8 }]} />}
                      </View>
                    </View>
                    <ChevronRight size={16} color="#f9a8d4" />
                  </TouchableOpacity>
                );
              })
          )}
        </View>
      )}

      <View style={{ height: 32 }} />

      <ModalSintomas
        dia={diaSelecionado}
        registros={registros}
        onClose={() => setDiaSelecionado(null)}
        onUpdate={atualizarDia}
      />
    </ScrollView>
  );
}

// --- Modal melhorado ---
function ModalSintomas({ dia, registros, onClose, onUpdate }: {
  dia: string | null;
  registros: Record<string, RegistroDia>;
  onClose: () => void;
  onUpdate: (d: string, u: Partial<RegistroDia>) => Promise<void>;
}) {
  const reg = dia
    ? registros[dia] || { menstruando: false, intensidadeFluxo: null, notas: "", sintomas: { ...SINTOMAS_VAZIO } }
    : null;

  return (
    <Modal visible={!!dia} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose} />
      {dia && reg && (
        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {format(parseISO(dia), "dd 'de' MMMM", { locale: ptBR })}
            </Text>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <X size={18} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          {/* Fluxo */}
          <TouchableOpacity
            style={[styles.fluxoBtn, reg.menstruando && styles.fluxoBtnActive]}
            onPress={() => onUpdate(dia, { menstruando: !reg.menstruando, intensidadeFluxo: !reg.menstruando ? reg.intensidadeFluxo : null })}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <Droplets size={20} color="#ec4899" />
              <Text style={styles.fluxoBtnText}>Fluxo Menstrual</Text>
            </View>
            <View style={[styles.checkCircle, reg.menstruando && styles.checkCircleActive]} />
          </TouchableOpacity>

          {/* Intensidade do fluxo */}
          {reg.menstruando && (
            <View style={{ gap: 8 }}>
              <Text style={styles.subLabel}>Intensidade do fluxo</Text>
              <View style={styles.intensidadeRow}>
                {INTENSIDADES_FLUXO.map(f => (
                  <TouchableOpacity
                    key={f.key}
                    style={[
                      styles.intensidadeBtn,
                      reg.intensidadeFluxo === f.key && styles.intensidadeBtnActive,
                    ]}
                    onPress={() => onUpdate(dia, { intensidadeFluxo: f.key })}
                  >
                    <Text style={styles.intensidadeEmoji}>{f.emoji}</Text>
                    <Text style={[styles.intensidadeBtnText, reg.intensidadeFluxo === f.key && { color: "#fff" }]}>
                      {f.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Cólica */}
          <View style={{ gap: 8 }}>
            <TouchableOpacity
              style={[styles.sintomaToggle, reg.sintomas.colica && { backgroundColor: "#fef3c7", borderColor: "#fbbf24" }]}
              onPress={() => onUpdate(dia, { sintomas: { ...reg.sintomas, colica: !reg.sintomas.colica, intensidadeColica: !reg.sintomas.colica ? reg.sintomas.intensidadeColica : null } })}
            >
              <Thermometer size={16} color={reg.sintomas.colica ? "#d97706" : "#9ca3af"} />
              <Text style={[styles.sintomaToggleText, reg.sintomas.colica && { color: "#d97706" }]}>Cólica</Text>
              <View style={[styles.checkCircleSmall, reg.sintomas.colica && { backgroundColor: "#fbbf24", borderColor: "#fbbf24" }]} />
            </TouchableOpacity>

            {reg.sintomas.colica && (
              <View>
                <Text style={styles.subLabel}>Intensidade da cólica</Text>
                <View style={styles.dorRow}>
                  {INTENSIDADES_DOR.map(d => (
                    <TouchableOpacity
                      key={d.key}
                      style={[styles.dorBtn, reg.sintomas.intensidadeColica === d.key && { backgroundColor: d.cor, borderColor: d.cor }]}
                      onPress={() => onUpdate(dia, { sintomas: { ...reg.sintomas, intensidadeColica: d.key } })}
                    >
                      <Text style={[styles.dorBtnText, reg.sintomas.intensidadeColica === d.key && { color: "#fff" }]}>
                        {d.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* Dor de cabeça */}
          <View style={{ gap: 8 }}>
            <TouchableOpacity
              style={[styles.sintomaToggle, reg.sintomas.dorDeCabeca && { backgroundColor: "#ede9fe", borderColor: "#a78bfa" }]}
              onPress={() => onUpdate(dia, { sintomas: { ...reg.sintomas, dorDeCabeca: !reg.sintomas.dorDeCabeca, intensidadeDorDeCabeca: null } })}
            >
              <Brain size={16} color={reg.sintomas.dorDeCabeca ? "#7c3aed" : "#9ca3af"} />
              <Text style={[styles.sintomaToggleText, reg.sintomas.dorDeCabeca && { color: "#7c3aed" }]}>Dor de Cabeça</Text>
              <View style={[styles.checkCircleSmall, reg.sintomas.dorDeCabeca && { backgroundColor: "#a78bfa", borderColor: "#a78bfa" }]} />
            </TouchableOpacity>

            {reg.sintomas.dorDeCabeca && (
              <View>
                <Text style={styles.subLabel}>Intensidade da dor de cabeça</Text>
                <View style={styles.dorRow}>
                  {INTENSIDADES_DOR.map(d => (
                    <TouchableOpacity
                      key={d.key}
                      style={[styles.dorBtn, reg.sintomas.intensidadeDorDeCabeca === d.key && { backgroundColor: d.cor, borderColor: d.cor }]}
                      onPress={() => onUpdate(dia, { sintomas: { ...reg.sintomas, intensidadeDorDeCabeca: d.key } })}
                    >
                      <Text style={[styles.dorBtnText, reg.sintomas.intensidadeDorDeCabeca === d.key && { color: "#fff" }]}>
                        {d.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* Outros sintomas */}
          <View style={styles.outrosSintomas}>
            {[
              { key: "inchaco", label: "Inchaço", icon: <Wind size={16} color={reg.sintomas.inchaco ? "#2563eb" : "#9ca3af"} />, cor: "#dbeafe", border: "#60a5fa", textCor: "#2563eb" },
              { key: "seiosSensiveis", label: "Seios Sensíveis", icon: <Heart size={16} color={reg.sintomas.seiosSensiveis ? "#ec4899" : "#9ca3af"} />, cor: "#fce7f3", border: "#ec4899", textCor: "#ec4899" },
            ].map(s => (
              <TouchableOpacity
                key={s.key}
                style={[styles.sintomaToggle, (reg.sintomas as any)[s.key] && { backgroundColor: s.cor, borderColor: s.border }]}
                onPress={() => onUpdate(dia, { sintomas: { ...reg.sintomas, [s.key]: !(reg.sintomas as any)[s.key] } })}
              >
                {s.icon}
                <Text style={[styles.sintomaToggleText, (reg.sintomas as any)[s.key] && { color: s.textCor }]}>{s.label}</Text>
                <View style={[styles.checkCircleSmall, (reg.sintomas as any)[s.key] && { backgroundColor: s.border, borderColor: s.border }]} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Humor */}
          <View style={{ gap: 8 }}>
            <Text style={styles.subLabel}>Como você está se sentindo?</Text>
            <View style={styles.humorGrid}>
              {HUMORES.map(h => (
                <TouchableOpacity
                  key={h.key}
                  style={[styles.humorBtn, reg.sintomas.tipoHumor === h.key && styles.humorBtnActive]}
                  onPress={() => onUpdate(dia, { sintomas: { ...reg.sintomas, humorInstavel: true, tipoHumor: h.key as TipoHumor } })}
                >
                  <Text style={styles.humorBtnEmoji}>{h.emoji}</Text>
                  <Text style={[styles.humorBtnLabel, reg.sintomas.tipoHumor === h.key && { color: "#ec4899" }]}>{h.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Notas */}
          <TextInput
            placeholder="Notas sobre o dia... 📝"
            placeholderTextColor="#f9a8d4"
            value={reg.notas}
            onChangeText={text => onUpdate(dia, { notas: text })}
            multiline
            style={styles.notasInput}
          />

          <View style={{ height: 40 }} />
        </ScrollView>
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
  tabText: { fontSize: 12, fontWeight: "600", color: "#f9a8d4" },
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
  statsRow: { flexDirection: "row", gap: 10 },
  statCard: { flex: 1, borderRadius: 16, padding: 16, alignItems: "center", gap: 6, borderWidth: 1, borderColor: "#fce7f3" },
  statValor: { fontSize: 28, fontWeight: "900", color: "#be185d" },
  statLabel: { fontSize: 11, color: "#9ca3af", fontWeight: "600", textAlign: "center" },
  previsaoCard: { backgroundColor: "#fff0f6", borderRadius: 14, padding: 16, alignItems: "center", gap: 4 },
  previsaoData: { fontSize: 20, fontWeight: "900", color: "#ec4899", textTransform: "capitalize" },
  previsaoSub: { fontSize: 12, color: "#f9a8d4", fontWeight: "500" },
  sintomaFreqCard: { backgroundColor: "#fff0f6", borderRadius: 14, padding: 16, alignItems: "center" },
  sintomaFreqText: { fontSize: 16, fontWeight: "700", color: "#be185d" },
  humorResumo: { gap: 10 },
  humorResumoItem: { flexDirection: "row", alignItems: "center", gap: 8 },
  humorEmoji: { fontSize: 20, width: 28 },
  humorLabel: { fontSize: 12, fontWeight: "600", color: "#be185d", width: 70 },
  humorBarBg: { flex: 1, height: 8, backgroundColor: "#fce7f3", borderRadius: 4, overflow: "hidden" },
  humorBarFill: { height: 8, backgroundColor: "#ec4899", borderRadius: 4 },
  humorCount: { fontSize: 12, fontWeight: "700", color: "#f9a8d4", width: 24 },
  fluxoResumoItem: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#fce7f3" },
  fluxoEmoji: { fontSize: 16 },
  fluxoLabel: { flex: 1, fontSize: 13, fontWeight: "600", color: "#be185d" },
  fluxoCount: { fontSize: 12, color: "#f9a8d4", fontWeight: "600" },
  historicoCard: { flexDirection: "row", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#fce7f3" },
  historicoData: { fontSize: 13, fontWeight: "700", color: "#be185d" },
  fluxoBadge: { backgroundColor: "#fce7f3", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 },
  fluxoBadgeText: { fontSize: 11, fontWeight: "700", color: "#ec4899" },
  emptyText: { textAlign: "center", color: "#f9a8d4", fontWeight: "600", paddingVertical: 16 },
  // Modal
  modalOverlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.4)" },
  modalContent: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "#fff", borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, maxHeight: "90%", gap: 16 },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  modalTitle: { fontSize: 18, fontWeight: "900", color: "#be185d", textTransform: "capitalize" },
  closeBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: "#f3f4f6", alignItems: "center", justifyContent: "center" },
  fluxoBtn: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16, borderRadius: 16, borderWidth: 2, borderColor: "#f3f4f6", backgroundColor: "#f9fafb" },
  fluxoBtnActive: { borderColor: "#ec4899", backgroundColor: "#fce7f3" },
  fluxoBtnText: { fontWeight: "700", fontSize: 15, color: "#ec4899" },
  checkCircle: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: "#e5e7eb", backgroundColor: "#fff" },
  checkCircleActive: { backgroundColor: "#ec4899", borderColor: "#ec4899" },
  checkCircleSmall: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: "#e5e7eb", backgroundColor: "#fff", marginLeft: "auto" },
  subLabel: { fontSize: 11, fontWeight: "700", color: "#f9a8d4", textTransform: "uppercase" },
  intensidadeRow: { flexDirection: "row", gap: 8 },
  intensidadeBtn: { flex: 1, alignItems: "center", padding: 10, borderRadius: 12, backgroundColor: "#fce7f3", borderWidth: 1.5, borderColor: "#fce7f3", gap: 4 },
  intensidadeBtnActive: { backgroundColor: "#ec4899", borderColor: "#ec4899" },
  intensidadeEmoji: { fontSize: 14 },
  intensidadeBtnText: { fontSize: 11, fontWeight: "700", color: "#f9a8d4" },
  dorRow: { flexDirection: "row", gap: 6, flexWrap: "wrap" },
  dorBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, backgroundColor: "#f9fafb", borderWidth: 1.5, borderColor: "#f3f4f6" },
  dorBtnText: { fontSize: 12, fontWeight: "700", color: "#9ca3af" },
  sintomaToggle: { flexDirection: "row", alignItems: "center", gap: 10, padding: 14, borderRadius: 14, borderWidth: 2, borderColor: "#f3f4f6", backgroundColor: "#f9fafb" },
  sintomaToggleText: { fontSize: 14, fontWeight: "700", color: "#9ca3af", flex: 1 },
  outrosSintomas: { gap: 8 },
  humorGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  humorBtn: { width: "30%", alignItems: "center", padding: 12, borderRadius: 14, backgroundColor: "#fce7f3", borderWidth: 1.5, borderColor: "#fce7f3", gap: 4 },
  humorBtnActive: { backgroundColor: "#fff0f6", borderColor: "#ec4899" },
  humorBtnEmoji: { fontSize: 24 },
  humorBtnLabel: { fontSize: 11, fontWeight: "700", color: "#f9a8d4" },
  notasInput: { backgroundColor: "#fff0f6", borderRadius: 16, borderWidth: 1.5, borderColor: "#fce7f3", padding: 14, color: "#be185d", fontWeight: "600", fontSize: 14, minHeight: 100, textAlignVertical: "top" },
});