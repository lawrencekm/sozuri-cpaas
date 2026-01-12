import UnifiedAuthForm from './UnifiedAuthForm';

type Mode = "login" | "register";

interface AuthFormProps {
  mode: Mode;
}

export default function AuthForm({ mode }: AuthFormProps) {
  // Redirect to the new unified auth form
  return <UnifiedAuthForm defaultMode={mode === "login" ? "signin" : "signup"} />;
}