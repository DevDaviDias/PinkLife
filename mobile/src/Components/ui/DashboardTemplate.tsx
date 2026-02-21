import { useState } from "react";
import { View, StyleSheet } from "react-native";
import MenuMobile from "@/src/Components/ui/MenuMobile";
import DashboardScreen from "@/src/feature/DashboardScreen/DashboardScreen";
import FinancasScreen from "@/src/feature/FinancasScreen/FinancasScreen";
import TreinoScreen from "@/src/feature/TreinoScreen/TreinoScreen";
// Quando criar as outras telas, importe e adicione aqui:
// import AgendaScreen from "@/src/feature/Agenda/AgendaScreen";
import EstudosScreen from "@/src/feature/EstudosScreen/EstudosScreen";
import SaudeScreen from "@/src/feature/SaudeScreen/SaudeScreen";
// import BelezaScreen from "@/src/feature/Beleza/BelezaScreen";
import DiarioScreen from "@/src/feature/DiarioScreen/DiarioScreen";
 import PerfilScreen from "@/src/feature/Perfilscreen/Perfilscreen";
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

      case "financas":
        return <FinancasScreen />;

      // Descomente conforme for criando as telas:
      // case "agenda":
      //   return <AgendaScreen />;
      case "estudos":
         return <EstudosScreen />;
      case "treinos":
        return <TreinoScreen />;
      case "saude":
       return <SaudeScreen />;
      // case "beleza":
      //   return <BelezaScreen />;
      case "diario":
      return <DiarioScreen />;
       case "perfil":
       return <PerfilScreen />;
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