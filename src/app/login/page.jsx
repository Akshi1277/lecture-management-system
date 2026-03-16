import LoginForm from "@/components/Auth/LoginForm";
import GridBackground from "@/components/Shared/GridBackground";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen">
      <GridBackground />
      <LoginForm />
    </div>
  );
}
