import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Star } from "lucide-react-native"; // Versão RN do lucide
import { useUser } from "../../../src/Context/UserContext";


// --- Interfaces ---
interface Materia {
  metaHoras: number;
  horasEstudadas: number;
}

interface Transacao {
  valor: number;
  tipo: "receita" | "despesa" | "Receita" | "Despesa";
}

interface StatusMessages {
  treino: string;
  estudo: string;
  financas: string;
}

export default function Conquistas() {
  const { user } = useUser();

  const [statusText, setStatusText] = useState<StatusMessages>({
    treino: "Carregando...",
    estudo: "Carregando...",
    financas: "Carregando..."
  });

  useEffect(() => {
    if (!user?.progress) return;

    const { progress } = user;

    const treinos = progress.treinos || [];
    const treinoMsg = treinos.length > 0 ? "Fichas de exercícios ativas!" : "Crie sua primeira ficha";

    const materias = (progress.materias as Materia[]) || [];
    const tHoras = materias.reduce((acc, m) => acc + (Number(m.horasEstudadas) || 0), 0);
    const tMeta = materias.reduce((acc, m) => acc + (Number(m.metaHoras) || 0), 0);
    const estudoMsg = (tMeta > 0 && tHoras >= tMeta) ? "Meta de estudos atingida 🏆" : "Complete suas horas de estudo";

    const financas = (progress.financas as Transacao[]) || [];
    const saldo = financas.reduce((acc, t) => {
      const valor = Number(t.valor) || 0;
      const tipoNormalizado = t.tipo?.toLowerCase();
      return tipoNormalizado === "receita" ? acc + valor : acc - valor;
    }, 0);
    const financasMsg = financas.length > 0 ? (saldo >= 0 ? "Orçamento sob controle" : "Atenção ao saldo negativo") : "Registre suas finanças";

    setStatusText({ treino: treinoMsg, estudo: estudoMsg, financas: financasMsg });
  }, [user]);

  const conquistas = [
    { cor: "#95F695", descricao: statusText.treino, corLetras: "#1a471a" },
    { cor: "#FFA0BD", descricao: statusText.estudo, corLetras: "white" },
    { cor: "#F9E5A4", descricao: statusText.financas, corLetras: "#4d3d00" },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Conquistas da Semana</Text>
      {conquistas.map((item, index) => (
        <View key={index} style={[styles.card, { backgroundColor: item.cor }]}>
          <Star size={20} color={item.corLetras} />
          <Text style={[styles.cardText, { color: item.corLetras }]}>{item.descricao}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  cardText: { fontWeight: "bold", fontSize: 16, marginLeft: 8, flexShrink: 1 },
});