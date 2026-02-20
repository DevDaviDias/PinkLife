import { useState } from "react";
import LoginScreen from "./LoginScreen";
import RegisterScreen from "./RegisterScreen";
import DashboardScreen from "../../DashboardScreen/DashboardScreen";
import { useUser } from "@/src/Context/UserContext";

export default function AuthFlow() {
  const { user } = useUser();
  const [screen, setScreen] = useState<"login" | "register">("login");

  if (user) {
    return <DashboardScreen />;
  }

  if (screen === "register") {
    return <RegisterScreen onSwitchToLogin={() => setScreen("login")} />;
  }

  return <LoginScreen onSwitchToRegister={() => setScreen("register")} />;
}