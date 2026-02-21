import React, { ReactNode } from "react";
import { View, Text, Image, StyleSheet, ImageSourcePropType } from "react-native";

interface HeaderSectionProps {
  greeting: string;
  userName: string;
  subtitle?: string;
  imageSrc?: ImageSourcePropType;
  children?: ReactNode;
}

export default function Cabecalho({
  greeting,
  userName,
  subtitle,
  imageSrc,
  children,
}: HeaderSectionProps) {
  return (
    <View style={styles.container}>
      <View style={{ flex: 1, paddingRight: 8 }}>

        {/* Saudação em rosa claro */}
        <Text style={styles.greeting}>{greeting}</Text>

        {/* Nome em rosa escuro e maior */}
        <Text style={styles.userName}>{userName}</Text>

        {/* Mensagem fofa */}
        {subtitle && (
          <Text style={styles.subtitle}>{subtitle}</Text>
        )}

        {children && <View style={{ marginTop: 4 }}>{children}</View>}
      </View>

      <Image
        source={imageSrc ?? { uri: "https://placekitten.com/200/200" }}
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
    paddingTop: 48,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  greeting: {
    fontSize: 15,
    fontWeight: "500",
    color: "#f472b6",
    lineHeight: 22,
  },
  userName: {
    fontSize: 24,
    fontWeight: "800",
    color: "#be185d",
    lineHeight: 30,
  },
  subtitle: {
    fontSize: 13,
    color: "#f9a8d4",
    fontWeight: "500",
    marginTop: 4,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginLeft: 12,
    borderWidth: 3,
    borderColor: "#ec4899",
  },
});