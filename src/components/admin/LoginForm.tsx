"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/admin/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, {} as LoginState);
  return (
    <form action={action} className="w-full border-y border-dashed border-line py-8">
      <p className="text-xs uppercase tracking-wide text-muted">[Admin]</p>
      <h1 className="mt-2 font-sans text-2xl font-bold">Sign in</h1>

      <label htmlFor="pw" className="mt-6 block text-sm font-bold">Password</label>
      <input
        id="pw"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        maxLength={200}
        aria-invalid={!!state.error}
        aria-describedby={state.error ? "pw-e" : undefined}
        className="mt-2 h-12 w-full border border-dashed border-line bg-transparent px-3 text-base text-white outline-none focus-visible:border-white/70"
      />
      {state.error && (
        <p id="pw-e" role="alert" className="mt-2 text-sm font-medium text-orange">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-6 inline-flex min-h-12 w-full items-center justify-center bg-white text-sm font-bold text-black transition-opacity disabled:opacity-60"
      >
        {pending ? "Checking…" : "Continue"}
      </button>
    </form>
  );
}