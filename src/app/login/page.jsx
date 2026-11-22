
import { Suspense } from "react";
import LoginForm from "../../components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main>
      <Suspense fallback={<p>Loading login...</p>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
