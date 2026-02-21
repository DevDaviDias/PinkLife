import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Dumbbell, BookOpen, Wallet } from "lucide-react-native";
import { useUser } from "../../../src/Context/UserContext";

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
    financas: "Carregando...",
  });

  useEffect(() => {
    if (!user?.progress) return;
    const { progress } = user;

    const treinos = progress.treinos || [];
    const treinoMsg = treinos.length > 0 ? "Fichas de exercícios ativas! 💪" : "Crie sua primeira ficha";

    const materias = (progress.materias as Materia[]) || [];
    const tHoras = materias.reduce((acc, m) => acc + (Number(m.horasEstudadas) || 0), 0);
    const tMeta = materias.reduce((acc, m) => acc + (Number(m.metaHoras) || 0), 0);
    const estudoMsg = tMeta > 0 && tHoras >= tMeta ? "Meta de estudos atingida 🏆" : "Complete suas horas de estudo";

    const financas = (progress.financas as Transacao[]) || [];
    const saldo = financas.reduce((acc, t) => {
      const valor = Number(t.valor) || 0;
      const tipoNormalizado = t.tipo?.toLowerCase();
      return tipoNormalizado === "receita" ? acc + valor : acc - valor;
    }, 0);
    const financasMsg =
      financas.length > 0
        ? saldo >= 0
          ? "Orçamento sob controle 🌟"
          : "Atenção ao saldo negativo"
        : "Registre suas finanças";

    setStatusText({ treino: treinoMsg, estudo: estudoMsg, financas: financasMsg });
  }, [user]);

  const conquistas = [
    {
      cor: "#fde8f0",
      borderColor: "#f9a8d4",
      descricao: statusText.treino,
      corLetras: "#be185d",
      icon: <Dumbbell size={20} color="#ec4899" />,
    },
    {
      cor: "#ede9fe",
      borderColor: "#c4b5fd",
      descricao: statusText.estudo,
      corLetras: "#5b21b6",
      icon: <BookOpen size={20} color="#7c3aed" />,
    },
    {
      cor: "#fef9c3",
      borderColor: "#fde047",
      descricao: statusText.financas,
      corLetras: "#854d0e",
      icon: <Wallet size={20} color="#ca8a04" />,
    },
  ];

  return (
    <ScrollView style={styles.container} scrollEnabled={false}>
      <Text style={styles.title}>✨ Conquistas da Semana</Text>
      {conquistas.map((item, index) => (
        <View
          key={index}
          style={[
            styles.card,
            {
              backgroundColor: item.cor,
              borderColor: item.borderColor,
            },
          ]}
        >
          <View style={styles.iconWrapper}>{item.icon}</View>
          <Text style={[styles.cardText, { color: item.corLetras }]}>
            {item.descricao}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 4 },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#be185d",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1.5,
    shadowColor: "#ec4899",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  cardText: {
    fontWeight: "700",
    fontSize: 14,
    flexShrink: 1,
  },
});