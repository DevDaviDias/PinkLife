// app/page.tsx
import AuthGate from "@/src/features/AuthGate";
import { UserProvider } from "@/src/context/UserContext";

export default function Home() {
  return (
    <UserProvider>
      <AuthGate />
    </UserProvider>
  );
}
