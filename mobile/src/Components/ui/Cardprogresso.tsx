import React from "react";
import { View, Text, StyleSheet } from "react-native";

type PropsProgresso = {
  icon?: React.ReactNode;
  title: string;
  porcentagem?: number | string;
  progressoDodia?: string;
  progresso?: number; // número de 0 a 100
  barraDeProgresso?: boolean;
  valor?: string | number;
  cor?: string;
};

export default function CardProgresso({
  title,
  progressoDodia,
  progresso = 0,
  barraDeProgresso = false,
  icon,
  porcentagem,
  valor,
  cor = "#ec4899",
}: PropsProgresso) {
  // Garantindo que progresso seja número entre 0 e 100
  const progressoNumber = Math.min(Math.max(Number(progresso), 0), 100);

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        {icon && <View style={{ marginRight: 8 }}>{icon}</View>}
        <Text style={[styles.title, { color: cor }]}>{title}</Text>
      </View>

      {/* Porcentagem e valor */}
      <View style={{ marginTop: 8 }}>
        {porcentagem !== undefined && (
          <Text style={{ fontWeight: "bold", color: cor }}>{porcentagem}</Text>
        )}
        {valor !== undefined && (
          <Text style={{ fontWeight: "bold", color: cor }}>{valor}</Text>
        )}
      </View>

      {/* Progresso do dia */}
      {progressoDodia && (
        <Text style={styles.progressoText}>{progressoDodia}</Text>
      )}

      {/* Barra de progresso */}
      {barraDeProgresso && (
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              {
                flex: progressoNumber / 100, // usa flex para preencher proporcional
                backgroundColor: cor,
              },
            ]}
          />
          <View
            style={[
              styles.progressBarEmpty,
              { flex: 1 - progressoNumber / 100 },
            ]}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginVertical: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  progressoText: {
    fontSize: 14,
    marginTop: 4,
  },
  progressBarBackground: {
    flexDirection: "row", // necessário para flex
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
    marginTop: 8,
    backgroundColor: "#e5e7eb",
  },
  progressBarFill: {
    height: 6,
    borderRadius: 3,
  },
  progressBarEmpty: {
    height: 6,
    backgroundColor: "#e5e7eb",
  },
});