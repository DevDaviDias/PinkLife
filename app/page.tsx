// app/page.tsx
import AuthGate from "@/componentes/AuthGate";
import { UserProvider } from "@/componentes/context/UserContext";

export default function Home() {
  return (
    <UserProvider>
      <AuthGate />
    </UserProvider>
  );
}
