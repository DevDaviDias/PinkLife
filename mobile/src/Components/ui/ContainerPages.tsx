import React, { ReactNode } from "react";
import { View, StyleSheet } from "react-native";

type Props = {
  children?: ReactNode;
};

export default function ContentWrappers({ children }: Props) {
  return <View style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 16, // ~2em
    marginRight: 24, // ~3em
  },
});