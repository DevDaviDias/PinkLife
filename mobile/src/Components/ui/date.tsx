import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function DateComponent() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.toLocaleString("pt-BR", { month: "long" });
  const day = date.getDate();
  const weekday = date.toLocaleString("pt-BR", { weekday: "long" });

  return (
    <View style={styles.container}>
      <Text style={styles.weekday}>🌸 {weekday}</Text>
      <Text style={styles.date}>
        {day} de {month.toLowerCase()} de {year}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 6,
  },
  weekday: {
    fontSize: 12,
    fontWeight: "700",
    color: "#ec4899",
    textTransform: "capitalize",
    letterSpacing: 0.5,
  },
  date: {
    fontSize: 11,
    color: "#f9a8d4",
    fontWeight: "500",
    marginTop: 1,
  },
});