import { useState } from "react";
import { View, TouchableOpacity, StyleSheet, Text, ScrollView } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  FadeInDown,
} from "react-native-reanimated";
import {
  BookOpen,
  DollarSign,
  Dumbbell,
  Heart,
  House,
  Sparkles,
  Settings,
  BookMarked,
  CalendarDays,
  User,
} from "lucide-react-native";

type MenuMobileProps = {
  onChangeSessao: (sessao: string) => void;
};

const menuItems = [
  
  { id: "estudos", icon: BookOpen, label: "Estudos" },
  { id: "treinos", icon: Dumbbell, label: "Treino" },
  { id: "dashboard", icon: House, label: "Início" },
  { id: "financas", icon: DollarSign, label: "Finanças" },
  { id: "saude", icon: Heart, label: "Saúde" },
 // { id: "beleza", icon: Sparkles, label: "Beleza" },
  //{ id: "diario", icon: BookMarked, label: "Diário" },
  { id: "perfil", icon: User, label: "Perfil" },
  //{ id: "configuracao", icon: Settings, label: "Config" },
];

function MenuItem({
  id,
  icon: Icon,
  label,
  isActive,
  onPress,
}: {
  id: string;
  icon: any;
  label: string;
  isActive: boolean;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  function handlePress() {
    // Animação de pulso ao clicar
    scale.value = withSpring(0.85, { damping: 6 }, () => {
      scale.value = withSpring(1, { damping: 6 });
    });
    onPress();
  }

  return (
    <TouchableOpacity
      style={styles.item}
      onPress={handlePress}
      activeOpacity={1}
    >
      <Animated.View style={[styles.iconWrapper, isActive && styles.iconWrapperActive, animatedStyle]}>
        <Icon size={22} color={isActive ? "#fff" : "#c084fc"} />
      </Animated.View>
      <Animated.Text style={[styles.label, isActive && styles.labelActive]}>
        {label}
      </Animated.Text>
    </TouchableOpacity>
  );
}

export default function MenuMobile({ onChangeSessao }: MenuMobileProps) {
  const [activeSessao, setActiveSessao] = useState("dashboard");

  function handlePress(id: string) {
    setActiveSessao(id);
    onChangeSessao(id);
  }

  return (
    // Menu aparece com slide de baixo para cima
    <Animated.View entering={FadeInDown.duration(400).springify()} style={styles.wrapper}>
      <View style={styles.container}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {menuItems.map(({ id, icon, label }) => (
            <MenuItem
              key={id}
              id={id}
              icon={icon}
              label={label}
              isActive={activeSessao === id}
              onPress={() => handlePress(id)}
            />
          ))}
        </ScrollView>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
  },
  container: {
    backgroundColor: "#fff",
    borderRadius: 32,
    paddingVertical: 10,
    shadowColor: "#ec4899",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 16,
    borderWidth: 1,
    borderColor: "#fce7f3",
  },
  scrollContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    gap: 4,
  },
  item: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 3,
  },
  iconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fdf4ff",
  },
  iconWrapperActive: {
    backgroundColor: "#ec4899",
    shadowColor: "#ec4899",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  label: {
    fontSize: 10,
    color: "#c084fc",
    fontWeight: "500",
  },
  labelActive: {
    color: "#ec4899",
    fontWeight: "700",
  },
});