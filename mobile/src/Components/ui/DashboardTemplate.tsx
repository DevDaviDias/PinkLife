import { useState } from "react";
import { View, StyleSheet } from "react-native";
import MenuMobile from "@/src/Components/ui/MenuMobile";
import DashboardScreen from "@/src/feature/DashboardScreen/DashboardScreen";

// Quando criar as outras telas, importe e adicione aqui:
// import AgendaScreen from "@/src/feature/Agenda/AgendaScreen";
// import EstudosScreen from "@/src/feature/Estudos/EstudosScreen";
// import TreinoScreen from "@/src/feature/Treino/TreinoScreen";
// import FinancasScreen from "@/src/feature/Financas/FinancasScreen";
// import SaudeScreen from "@/src/feature/Saude/SaudeScreen";
// import BelezaScreen from "@/src/feature/Beleza/BelezaScreen";
// import DiarioScreen from "@/src/feature/Diario/DiarioScreen";
// import PerfilScreen from "@/src/feature/Perfil/PerfilScreen";
// import ConfiguracaoScreen from "@/src/feature/Configuracao/ConfiguracaoScreen";

type Sessao =
  | "dashboard"
  | "agenda"
  | "estudos"
  | "treinos"
  | "financas"
  | "saude"
  | "beleza"
  | "diario"
  | "perfil"
  | "configuracao";

export default function DashboardTemplate() {
  const [sessaoAtiva, setSessaoAtiva] = useState<Sessao>("dashboard");

  function renderTela() {
    switch (sessaoAtiva) {
      case "dashboard":
        return <DashboardScreen />;

      // Descomente conforme for criando as telas:
      // case "agenda":
      //   return <AgendaScreen />;
      // case "estudos":
      //   return <EstudosScreen />;
      // case "treinos":
      //   return <TreinoScreen />;
      // case "financas":
      //   return <FinancasScreen />;
      // case "saude":
      //   return <SaudeScreen />;
      // case "beleza":
      //   return <BelezaScreen />;
      // case "diario":
      //   return <DiarioScreen />;
      // case "perfil":
      //   return <PerfilScreen />;
      // case "configuracao":
      //   return <ConfiguracaoScreen />;

      default:
        return <DashboardScreen />;
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {renderTela()}
      </View>
      <MenuMobile onChangeSessao={(sessao) => setSessaoAtiva(sessao as Sessao)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingBottom: 72,
  },
});