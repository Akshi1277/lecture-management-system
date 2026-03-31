import LoginForm from "@/components/Auth/LoginForm";
import GridBackground from "@/components/Shared/GridBackground";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen">
      <GridBackground />
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-500 font-black uppercase tracking-widest text-[10px]">Initializing Auth Protocol...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
