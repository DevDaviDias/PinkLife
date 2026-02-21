/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { BookOpen, Heart, Repeat, Target } from "lucide-react-native";
import DateComponent from "../../Components/ui/date";
import Cardprogresso from "../../Components/ui/Cardprogresso";
import Conquistas from "./ConquistasScreen";
import Agenda from "./Agenda";
import Cabecalho from "../../Components/ui/Cabecalho";
import ContainerPages from "../../Components/ui/ContainerPages";
import { useUser } from "../../../src/Context/UserContext";

const DashboardImg = require("../../../assets/images/hello-kitty-dashboard.jpg");

interface Materia {
  id: string;
  nome: string;
  metaHoras: number;
  horasEstudadas: number;
}

interface Tarefa {
  id: string | number;
  concluida: boolean;
  descricao?: string;
  horario?: string;
  data?: string;
}

interface Treino {
  id: string;
  nome: string;
}

export default function Dashboard() {
  const { user, refreshUser } = useUser();
  const userName = user?.name || "Visitante";

  const [periodo, setPeriodo] = useState("");
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    const hora = new Date().getHours();
    let saudacao = "";
    if (hora >= 5 && hora < 12) saudacao = "Bom dia,";
    else if (hora >= 12 && hora < 18) saudacao = "Boa tarde,";
    else saudacao = "Boa noite,";

    const mimos = [
      "Pronta para brilhar?",
      "Que seu dia seja doce!",
      "Vamos conquistar o mundo?",
      "Foco e muita luz!",
      "Você é incrível!",
      "Dia de realizar sonhos!",
    ];
    const mimosHomem = [
      "Bora pra cima!",
      "Foco na missão!",
      "Dia de produtividade!",
      "Pronto para o progresso?",
      "Mantenha a disciplina!",
    ];
    const isFeminino = true;
    const mimoselect = isFeminino
      ? mimos[Math.floor(Math.random() * mimos.length)]
      : mimosHomem[Math.floor(Math.random() * mimosHomem.length)];

    setPeriodo(saudacao);
    setMensagem(mimoselect);
  }, [userName]);

  const [estudosStats, setEstudosStats] = useState({ horasLabel: "0.0h / 0h", porcentagem: 0 });
  const [treinoStats, setTreinoStats] = useState({ label: "Nenhum treino", porcentagem: 0, totalFichas: 0 });
  const [habitosStats, setHabitosStats] = useState({ label: "Sem registros", porcentagem: 0 });
  const [tarefasStats, setTarefasStats] = useState({ label: "0 pendentes", porcentagem: 0 });

  useEffect(() => { refreshUser(); }, []);

  useEffect(() => {
    if (!user?.progress) return;
    const { progress } = user;

    const materias = (progress.materias as Materia[]) || [];
    const tHoras = materias.reduce((acc, m) => acc + (Number(m.horasEstudadas) || 0), 0);
    const tMeta = materias.reduce((acc, m) => acc + (Number(m.metaHoras) || 0), 0);
    setEstudosStats({
      horasLabel: `${tHoras.toFixed(1)}h / ${tMeta.toFixed(0)}h`,
      porcentagem: tMeta > 0 ? Math.min((tHoras / tMeta) * 100, 100) : 0,
    });

    const treinos = (progress.treinos as Treino[]) || [];
    setTreinoStats({
      label: treinos.length > 0 ? `${treinos.length} treinos` : "Nenhum treino",
      porcentagem: treinos.length > 0 ? 100 : 0,
      totalFichas: treinos.length,
    });

    const totalSaude = progress.saude ? Object.keys(progress.saude).length : 0;
    setHabitosStats({
      label: totalSaude > 0 ? `${totalSaude} registros` : "Sem registros",
      porcentagem: totalSaude > 0 ? 100 : 0,
    });

    const tarefas = (progress.tarefas as Tarefa[]) || [];
    const concluidasT = tarefas.filter((t) => t.concluida).length;
    const totalT = tarefas.length;
    setTarefasStats({
      label:
        totalT - concluidasT > 0
          ? `${totalT - concluidasT} pendentes`
          : totalT > 0
            ? "Tudo feito! ✨"
            : "Sem tarefas",
      porcentagem: totalT > 0 ? (concluidasT / totalT) * 100 : 0,
    });
  }, [user]);

  return (
    <ContainerPages>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Cabeçalho com nome destacado */}
        <Cabecalho
          greeting={periodo}
          userName={`${userName}!`}
          subtitle={mensagem}
          imageSrc={DashboardImg}
        >
          <DateComponent />
        </Cabecalho>

        {/* Grid de cards */}
        <View style={styles.cardGrid}>
          <Cardprogresso
            title="Saúde"
            progressoDodia={habitosStats.label}
            progresso={habitosStats.porcentagem}
            barraDeProgresso
            icon={<Target size={20} color="#ec4899" />}
          />
          <Cardprogresso
            title="Tarefas"
            progressoDodia={tarefasStats.label}
            progresso={tarefasStats.porcentagem}
            barraDeProgresso
            icon={<Repeat size={20} color="#ec4899" />}
          />
          <Cardprogresso
            title="Estudos"
            progressoDodia={estudosStats.horasLabel}
            progresso={estudosStats.porcentagem}
            barraDeProgresso
            icon={<BookOpen size={20} color="#ec4899" />}
          />
          <Cardprogresso
            title="Treinos"
            progressoDodia={treinoStats.label}
            progresso={treinoStats.porcentagem}
            barraDeProgresso
            icon={<Heart size={20} color={treinoStats.totalFichas > 0 ? "#ec4899" : "#f9a8d4"} />}
          />
        </View>

        {/* Agenda e Conquistas */}
        <View style={styles.bottomSection}>
          <View style={styles.agendaWrapper}>
            <Agenda />
          </View>
          <View style={styles.conquistasWrapper}>
            <Conquistas />
          </View>
        </View>

      </ScrollView>
    </ContainerPages>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 100,
  },
  cardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginVertical: 1,
    paddingHorizontal: 16,
  },
  bottomSection: {
    flexDirection: "column",
    paddingHorizontal: 16,
  },
  agendaWrapper: { flex: 1 },
  conquistasWrapper: { marginTop: 12 },
});