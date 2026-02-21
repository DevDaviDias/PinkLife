import { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Vibration } from "react-native";
import { Play, Pause, StopCircle, RotateCcw } from "lucide-react-native";
import { Audio } from "expo-av";
import Svg, { Circle } from "react-native-svg";

interface StudySession {
  materia: string;
  comentario: string;
  duracaoSegundos: number;
  data: string;
}

interface Props {
  materias?: string[];
  onFinalizar: (sessao: StudySession) => void;
}

const FOCO_SEGUNDOS = 25 * 60;
const DESCANSO_SEGUNDOS = 5 * 60;
const RAIO = 100;
const CIRCUNFERENCIA = 2 * Math.PI * RAIO;

export default function CronometroEstudos({ materias = [], onFinalizar }: Props) {
  const [materia, setMateria] = useState("");
  const [comentario, setComentario] = useState("");
  const [rodando, setRodando] = useState(false);
  const [fase, setFase] = useState<"foco" | "descanso">("foco");
  const [tempo, setTempo] = useState(FOCO_SEGUNDOS);
  const [ciclos, setCiclos] = useState(0);
  const [tempoTotalFoco, setTempoTotalFoco] = useState(0);
  const soundRef = useRef<Audio.Sound | null>(null);

  const totalFase = fase === "foco" ? FOCO_SEGUNDOS : DESCANSO_SEGUNDOS;
  const progresso = (totalFase - tempo) / totalFase;
  const strokeDashoffset = CIRCUNFERENCIA * (1 - progresso);

  // Carrega som
  useEffect(() => {
    async function loadSound() {
      try {
        const { sound } = await Audio.Sound.createAsync(
          { uri: "https://actions.google.com/sounds/v1/alarms/beep_short.ogg" },
          { shouldPlay: false }
        );
        soundRef.current = sound;
      } catch (e) {
        console.log("Som não carregado:", e);
      }
    }
    loadSound();
    return () => { soundRef.current?.unloadAsync(); };
  }, []);

  async function tocarSom() {
    try {
      await soundRef.current?.replayAsync();
    } catch (e) {}
    Vibration.vibrate([500, 200, 500]);
  }

  // Cronômetro
  useEffect(() => {
    if (!rodando) return;
    const intervalo = setInterval(() => {
      setTempo(t => {
        if (t <= 1) {
          tocarSom();
          if (fase === "foco") {
            setTempoTotalFoco(prev => prev + FOCO_SEGUNDOS);
            setCiclos(c => c + 1);
            setFase("descanso");
            return DESCANSO_SEGUNDOS;
          } else {
            setFase("foco");
            return FOCO_SEGUNDOS;
          }
        }
        if (fase === "foco") setTempoTotalFoco(prev => prev + 1);
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(intervalo);
  }, [rodando, fase]);

  function formatar(seg: number) {
    const m = Math.floor(seg / 60);
    const s = seg % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }

  function resetar() {
    setRodando(false);
    setFase("foco");
    setTempo(FOCO_SEGUNDOS);
  }

  function finalizar() {
    if (!materia || tempoTotalFoco === 0) return;
    setRodando(false);
    onFinalizar({
      materia,
      comentario,
      duracaoSegundos: tempoTotalFoco,
      data: new Date().toISOString(),
    });
    setTempo(FOCO_SEGUNDOS);
    setFase("foco");
    setCiclos(0);
    setTempoTotalFoco(0);
    setComentario("");
    setMateria("");
  }

  const corFoco = "#ec4899";
  const corDescanso = "#34d399";
  const corAtual = fase === "foco" ? corFoco : corDescanso;
  const bloqueado = materia === "";

  return (
    <View style={styles.container}>

      {/* Fase atual */}
      <View style={[styles.faseBadge, { backgroundColor: corAtual + "20", borderColor: corAtual }]}>
        <Text style={[styles.faseText, { color: corAtual }]}>
          {fase === "foco" ? "🎯 Foco" : "☕ Descanso"}
        </Text>
        <Text style={[styles.ciclosText, { color: corAtual }]}>{ciclos} ciclos</Text>
      </View>

      {/* Anel SVG */}
      <View style={styles.relogioWrapper}>
        <Svg width={240} height={240} viewBox="0 0 240 240">
          {/* Anel de fundo */}
          <Circle
            cx={120}
            cy={120}
            r={RAIO}
            stroke="#fce7f3"
            strokeWidth={12}
            fill="none"
          />
          {/* Anel de progresso */}
          <Circle
            cx={120}
            cy={120}
            r={RAIO}
            stroke={corAtual}
            strokeWidth={12}
            fill="none"
            strokeDasharray={`${CIRCUNFERENCIA}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            rotation="-90"
            origin="120,120"
          />
        </Svg>

        {/* Tempo no centro */}
        <View style={styles.tempoWrapper}>
          <Text style={[styles.tempo, { color: bloqueado ? "#e5e7eb" : corAtual }]}>
            {formatar(tempo)}
          </Text>
          <Text style={styles.tempoLabel}>
            {fase === "foco" ? "para descanso" : "para foco"}
          </Text>
        </View>
      </View>

      {/* Seletor de matéria */}
      {!rodando && (
        <View style={styles.materiaSelector}>
          {materias.length === 0 ? (
            <Text style={styles.semMaterias}>Cadastre matérias primeiro 🌸</Text>
          ) : (
            <View style={styles.materiasRow}>
              {materias.map(m => (
                <TouchableOpacity
                  key={m}
                  style={[styles.materiaBtn, materia === m && { backgroundColor: corFoco, borderColor: corFoco }]}
                  onPress={() => setMateria(m)}
                >
                  <Text style={[styles.materiaBtnText, materia === m && styles.materiaBtnTextActive]}>
                    {m}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      )}

      {/* Botões de controle */}
      <View style={styles.botoesRow}>
        <TouchableOpacity style={styles.btnReset} onPress={resetar}>
          <RotateCcw size={22} color="#f9a8d4" />
        </TouchableOpacity>

        {!rodando ? (
          <TouchableOpacity
            style={[styles.btnPlay, bloqueado && styles.btnBloqueado, { backgroundColor: corAtual }]}
            onPress={() => !bloqueado && setRodando(true)}
            disabled={bloqueado}
          >
            <Play size={32} color="#fff" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.btnPlay, { backgroundColor: corAtual }]}
            onPress={() => setRodando(false)}
          >
            <Pause size={32} color="#fff" />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.btnStop, (bloqueado || tempoTotalFoco === 0) && styles.btnBloqueado]}
          onPress={finalizar}
          disabled={bloqueado || tempoTotalFoco === 0}
        >
          <StopCircle size={22} color={bloqueado || tempoTotalFoco === 0 ? "#d1d5db" : "#ef4444"} />
        </TouchableOpacity>
      </View>

      {/* Tempo total de foco */}
      {tempoTotalFoco > 0 && (
        <Text style={styles.totalFoco}>
          ⏱ {(tempoTotalFoco / 60).toFixed(0)} min focados no total
        </Text>
      )}

      {/* Aviso matéria */}
      {bloqueado && (
        <Text style={styles.avisoText}>👆 Selecione uma matéria para começar</Text>
      )}

      {/* Comentário */}
      <TextInput
        placeholder="O que estudamos hoje? 📝"
        placeholderTextColor="#f9a8d4"
        value={comentario}
        onChangeText={setComentario}
        editable={!bloqueado}
        style={[styles.input, bloqueado && styles.inputBloqueado]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 16,
    width: "100%",
    paddingVertical: 8,
  },
  faseBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  faseText: {
    fontWeight: "800",
    fontSize: 15,
  },
  ciclosText: {
    fontWeight: "600",
    fontSize: 12,
    opacity: 0.7,
  },
  relogioWrapper: {
    width: 240,
    height: 240,
    alignItems: "center",
    justifyContent: "center",
  },
  tempoWrapper: {
    position: "absolute",
    alignItems: "center",
  },
  tempo: {
    fontSize: 48,
    fontWeight: "900",
    letterSpacing: 2,
  },
  tempoLabel: {
    fontSize: 11,
    color: "#f9a8d4",
    fontWeight: "500",
    marginTop: 2,
  },
  materiaSelector: {
    width: "100%",
  },
  materiasRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
  },
  semMaterias: {
    textAlign: "center",
    color: "#f9a8d4",
    fontSize: 13,
  },
  materiaBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#fce7f3",
    borderWidth: 1.5,
    borderColor: "#fce7f3",
  },
  materiaBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#f9a8d4",
  },
  materiaBtnTextActive: {
    color: "#fff",
  },
  botoesRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  btnPlay: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  btnReset: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#fce7f3",
    alignItems: "center",
    justifyContent: "center",
  },
  btnStop: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#fee2e2",
    alignItems: "center",
    justifyContent: "center",
  },
  btnBloqueado: {
    backgroundColor: "#f9fafb",
    shadowOpacity: 0,
    elevation: 0,
  },
  totalFoco: {
    fontSize: 13,
    fontWeight: "700",
    color: "#ec4899",
  },
  avisoText: {
    fontSize: 12,
    color: "#f9a8d4",
    fontWeight: "500",
  },
  input: {
    width: "100%",
    backgroundColor: "#fff0f6",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#fce7f3",
    padding: 14,
    color: "#be185d",
    fontWeight: "600",
    fontSize: 14,
  },
  inputBloqueado: {
    backgroundColor: "#f9fafb",
    borderColor: "#e5e7eb",
  },
});