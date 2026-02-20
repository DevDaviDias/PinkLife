import { Pressable } from "react-native";
import * as Haptics from "expo-haptics";

export function HapticTab({ onPress, ...props }: any) {
  function handlePress() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  }

  return <Pressable onPress={handlePress} {...props} />;
}