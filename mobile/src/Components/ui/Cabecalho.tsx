import React, { ReactNode } from "react";
import { View, Text, Image, StyleSheet } from "react-native";

interface HeaderSectionProps {
  title: string;
  imageSrc?: string;
  imageAlt?: string; // RN não usa alt, mas mantemos para tipo
  children?: ReactNode;
}

export default function Cabecalho({
  title,
  imageSrc = "https://placekitten.com/200/200", // substituindo URL local
  children,
}: HeaderSectionProps) {
  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title}</Text>

        {children && <View style={{ marginTop: 4 }}>{children}</View>}
      </View>

      <Image
        source={{ uri: imageSrc }}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ec4899",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50, // arredonda como 'rounded-full'
  },
});