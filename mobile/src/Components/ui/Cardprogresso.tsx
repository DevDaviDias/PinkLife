import React from "react";
import { View, Text, StyleSheet } from "react-native";

type PropsProgresso = {
  icon?: React.ReactNode;
  title: string;
  porcentagem?: number | string;
  progressoDodia?: string;
  progresso?: number;
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
  const progressoNumber = Math.min(Math.max(Number(progresso), 0), 100);

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.iconWrapper, { backgroundColor: cor + "20" }]}>
          {icon}
        </View>
        <Text style={[styles.title, { color: cor }]}>{title}</Text>
      </View>

      {/* Porcentagem e valor */}
      {(porcentagem !== undefined || valor !== undefined) && (
        <View style={{ marginTop: 8 }}>
          {porcentagem !== undefined && (
            <Text style={{ fontWeight: "bold", color: cor }}>{porcentagem}</Text>
          )}
          {valor !== undefined && (
            <Text style={{ fontWeight: "bold", color: cor }}>{valor}</Text>
          )}
        </View>
      )}

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
                width: `${progressoNumber}%`,
                backgroundColor: cor,
              },
            ]}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 20,
    marginVertical: 6,
    width: "48%",
    borderWidth: 1.5,
    borderColor: "#fce7f3",
    shadowColor: "#ec4899",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 15,
    fontWeight: "800",
  },
  progressoText: {
    fontSize: 13,
    marginTop: 6,
    color: "#9ca3af",
    fontWeight: "500",
  },
  progressBarBackground: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
    marginTop: 10,
    backgroundColor: "#fce7f3",
  },
  progressBarFill: {
    height: 6,
    borderRadius: 3,
  },
});