import { useState } from "react";
import LoginScreen from "./LoginScreen";
import RegisterScreen from "./RegisterScreen";
import DashboardTemplate from "@/src/Components/ui/DashboardTemplate";
import { useUser } from "@/src/Context/UserContext";
import FinancasScreen from "../../FinancasScreen/FinancasScreen";

export default function AuthFlow() {
  const { user } = useUser();
  const [screen, setScreen] = useState<"login" | "register">("login");

if (user) {
  return <DashboardTemplate />; 
}

  if (screen === "register") {
    return <RegisterScreen onSwitchToLogin={() => setScreen("login")} />;
  }

  return <LoginScreen onSwitchToRegister={() => setScreen("register")} />;
}