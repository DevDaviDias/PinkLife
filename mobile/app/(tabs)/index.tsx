import { UserProvider } from "@/src/Context/UserContext";
import AuthFlow from "@/src/feature/Auth/screens/AuthFlow";

export default function App() {
  return (
    <UserProvider>
      <AuthFlow />
    </UserProvider>
  );
}