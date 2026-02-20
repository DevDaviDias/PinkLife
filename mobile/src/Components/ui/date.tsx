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
      <Text style={styles.dateText}>
        {weekday}, {day} de {month} de {year}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 8 },
  dateText: { fontSize: 16, fontWeight: "bold", color: "#ec4899" },
});