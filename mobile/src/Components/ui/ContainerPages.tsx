import React, { ReactNode } from "react";
import { View, StyleSheet } from "react-native";

type Props = {
  children?: ReactNode;
};

export default function ContentWrappers({ children }: Props) {
  return (
    <View style={styles.container}>
      {/* Bolinhas decorativas de fundo */}
      <View style={styles.bubble1} />
      <View style={styles.bubble2} />
      <View style={styles.bubble3} />
      <View style={styles.bubble4} />

      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f1f2",
    overflow: "hidden",
  },
  content: {
    flex: 1,
    marginLeft: 16,
    marginRight: 24,
  },
  bubble1: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#fce7f3",
    top: -60,
    right: -60,
    opacity: 0.5,
  },
  bubble2: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#fbcfe8",
    bottom: 100,
    left: -40,
    opacity: 0.4,
  },
  bubble3: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f9a8d4",
    top: 200,
    right: -20,
    opacity: 0.3,
  },
  bubble4: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fde68a",
    bottom: 200,
    right: 40,
    opacity: 0.25,
  },
});