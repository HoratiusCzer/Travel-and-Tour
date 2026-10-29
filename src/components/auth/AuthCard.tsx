"use client";

import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useId, useState, type FormEvent, type ReactNode } from "react";

export type AuthMode = "login" | "signup";

const inputClass =
  "w-full rounded-xl border border-lagoon-600/25 bg-white px-4 py-2.5 text-ink-900 placeholder:text-ink-800/50 focus:border-saffron-400 focus:outline-none aria-[invalid=true]:border-red-500 dark:border-white/20 dark:bg-white/[0.06] dark:text-white dark:placeholder:text-white/50 dark:aria-[invalid=true]:border-red-400";
const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

// TODO: no account system is connected yet. Replace this with a real call (API route, NextAuth, Supabase...).
const NOT_CONNECTED = "Thanks! Accounts aren't connected yet, so this form is a UI preview only.";
const fakeSubmit = () => new Promise<void>((resolve) => setTimeout(resolve, 900));

function strength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}
const STRENGTH_LABELS = ["Too short", "Weak", "Okay", "Good", "Strong"];

function Field({ label, error, id, children }: { label: string; error?: string; id: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-ink-900 dark:text-white/90">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-600 dark:text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}

function PasswordInput({
  id,
  name,
  value,
  onChange,
  onBlur,
  autoComplete,
  invalid,
  placeholder,
}: {
  id: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  autoComplete: string;
  invalid: boolean;
  placeholder?: string;
}) {
  const [shown, setShown] = useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={shown ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-invalid={invalid}
        aria-describedby={invalid ? `${id}-error` : undefined}
        className={`${inputClass} pr-12`}
      />
      <button
        type="button"
        onClick={() => setShown((s) => !s)}
        aria-label={shown ? "Hide password" : "Show password"}
        aria-pressed={shown}
        className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-ink-800/70 hover:text-ink-900 dark:text-white/70 dark:hover:text-white"
      >
        {shown ? <EyeOff className="h-5 w-5" aria-hidden /> : <Eye className="h-5 w-5" aria-hidden />}
      </button>
    </div>
  );
}

function SubmitButton({ loading, children }: { loading: boolean; children: ReactNode }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-saffron-400 to-saffron-600 px-6 py-3 text-sm font-semibold text-ink-950 shadow-lg shadow-saffron-500/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
      {children}
    </button>
  );
}

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" aria-hidden>
    <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.46a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.58-5.17 3.58-8.81z" />
    <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.88-3a7.2 7.2 0 0 1-4.06 1.15c-3.12 0-5.77-2.11-6.71-4.95H1.3v3.09A12 12 0 0 0 12 24z" />
    <path fill="#FBBC05" d="M5.29 14.29a7.2 7.2 0 0 1 0-4.58V6.62H1.3a12 12 0 0 0 0 10.76l3.99-3.09z" />
    <path fill="#EA4335" d="M12 4.75c1.76 0 3.34.6 4.58 1.79l3.43-3.43A11.5 11.5 0 0 0 12 0 12 12 0 0 0 1.3 6.62l3.99 3.09C6.23 6.86 8.88 4.75 12 4.75z" />
  </svg>
);
const AppleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 fill-current" aria-hidden>
    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
  </svg>
);

function SocialButtons({ onClick }: { onClick: () => void }) {
  const cls =
    "flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-lagoon-600/30 bg-white px-4 py-2 text-sm font-medium text-ink-900 transition hover:bg-lagoon-50 dark:border-white/20 dark:bg-white/[0.05] dark:text-white dark:hover:bg-white/10";
  return (
    <>
      <div className="my-4 flex items-center gap-3 text-xs uppercase tracking-widest text-ink-800/60 dark:text-white/60" aria-hidden>
        <span className="h-px flex-1 bg-lagoon-600/20 dark:bg-white/15" />
        or
        <span className="h-px flex-1 bg-lagoon-600/20 dark:bg-white/15" />
      </div>
      {/* TODO: wire up OAuth once an auth provider is chosen. */}
      <div className="flex gap-3">
        <button type="button" onClick={onClick} aria-label="Continue with Google" className={cls}>
          <GoogleIcon />
          Google
        </button>
        <button type="button" onClick={onClick} aria-label="Continue with Apple" className={cls}>
          <AppleIcon />
          Apple
        </button>
      </div>
    </>
  );
}

function LoginForm({ onNotice }: { onNotice: (m: string) => void }) {
  const uid = useId();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState({ email: false, password: false });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const errors = {
    email: !email ? "Enter your email." : !emailOk(email) ? "That email doesn't look right." : "",
    password: !password ? "Enter your password." : "",
  };
  const show = (f: "email" | "password") => (touched[f] || submitted) && errors[f];

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    if (errors.email || errors.password) {
      document.getElementById(errors.email ? `${uid}-email` : `${uid}-password`)?.focus();
      return;
    }
    setLoading(true);
    await fakeSubmit(); // TODO: sign the user in
    setLoading(false);
    onNotice(NOT_CONNECTED);
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-3">
      <Field id={`${uid}-email`} label="Email" error={show("email") || undefined}>
        <input
          id={`${uid}-email`}
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, email: true }))}
          placeholder="you@example.com"
          aria-invalid={!!show("email")}
          aria-describedby={show("email") ? `${uid}-email-error` : undefined}
          className={inputClass}
        />
      </Field>
      <Field id={`${uid}-password`} label="Password" error={show("password") || undefined}>
        <PasswordInput
          id={`${uid}-password`}
          name="password"
          value={password}
          onChange={setPassword}
          onBlur={() => setTouched((t) => ({ ...t, password: true }))}
          autoComplete="current-password"
          invalid={!!show("password")}
          placeholder="Your password"
        />
      </Field>
      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-ink-800/85 dark:text-white/85">
          <input type="checkbox" name="remember" className="h-4 w-4 accent-saffron-500" />
          Remember me
        </label>
        {/* TODO: password reset flow */}
        <button type="button" onClick={() => onNotice("Password reset isn't connected yet.")} className="text-saffron-600 underline-offset-4 hover:underline dark:text-saffron-300">
          Forgot password?
        </button>
      </div>
      <SubmitButton loading={loading}>{loading ? "Signing in…" : "Sign in"}</SubmitButton>
    </form>
  );
}

function SignupForm({ onNotice }: { onNotice: (m: string) => void }) {
  const uid = useId();
  const [v, setV] = useState({ name: "", email: "", password: "", confirm: "", terms: false });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const set = <K extends keyof typeof v>(k: K, val: (typeof v)[K]) => setV((p) => ({ ...p, [k]: val }));
  const blur = (k: string) => () => setTouched((t) => ({ ...t, [k]: true }));

  const score = strength(v.password);
  const errors: Record<string, string> = {
    name: v.name.trim() ? "" : "Tell us your name.",
    email: !v.email ? "Enter your email." : !emailOk(v.email) ? "That email doesn't look right." : "",
    password: v.password.length < 8 ? "Use at least 8 characters." : "",
    confirm: !v.confirm ? "Confirm your password." : v.confirm !== v.password ? "Passwords don't match." : "",
    terms: v.terms ? "" : "Please accept the Terms to continue.",
  };
  const show = (k: string) => ((touched[k] || submitted) && errors[k]) || undefined;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    const firstBad = Object.keys(errors).find((k) => errors[k]);
    if (firstBad) {
      document.getElementById(`${uid}-${firstBad}`)?.focus();
      return;
    }
    setLoading(true);
    await fakeSubmit(); // TODO: create the account
    setLoading(false);
    onNotice(NOT_CONNECTED);
  }

  const inputProps = (k: "name" | "email") => ({
    id: `${uid}-${k}`,
    name: k,
    value: v[k],
    onChange: (e: { target: { value: string } }) => set(k, e.target.value),
    onBlur: blur(k),
    "aria-invalid": !!show(k),
    "aria-describedby": show(k) ? `${uid}-${k}-error` : undefined,
    className: inputClass,
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-3">
      <Field id={`${uid}-name`} label="Full name" error={show("name")}>
        <input {...inputProps("name")} type="text" autoComplete="name" placeholder="Your name" />
      </Field>
      <Field id={`${uid}-email`} label="Email" error={show("email")}>
        <input {...inputProps("email")} type="email" autoComplete="email" placeholder="you@example.com" />
      </Field>
      <Field id={`${uid}-password`} label="Password" error={show("password")}>
        <PasswordInput
          id={`${uid}-password`}
          name="password"
          value={v.password}
          onChange={(x) => set("password", x)}
          onBlur={blur("password")}
          autoComplete="new-password"
          invalid={!!show("password")}
          placeholder="At least 8 characters"
        />
        {v.password && (
          <div className="mt-2 flex items-center gap-3" aria-live="polite">
            <div className="flex flex-1 gap-1" aria-hidden>
              {[1, 2, 3, 4].map((n) => (
                <span key={n} className={`h-1 flex-1 rounded-full ${n <= score ? "bg-saffron-500" : "bg-ink-800/15 dark:bg-white/20"}`} />
              ))}
            </div>
            <span className="text-xs text-ink-800/75 dark:text-white/75">{STRENGTH_LABELS[score]}</span>
          </div>
        )}
      </Field>
      <Field id={`${uid}-confirm`} label="Confirm password" error={show("confirm")}>
        <PasswordInput
          id={`${uid}-confirm`}
          name="confirmPassword"
          value={v.confirm}
          onChange={(x) => set("confirm", x)}
          onBlur={blur("confirm")}
          autoComplete="new-password"
          invalid={!!show("confirm")}
          placeholder="Repeat your password"
        />
      </Field>
      <div>
        <label className="flex items-start gap-2 text-sm text-ink-800/85 dark:text-white/85">
          <input
            id={`${uid}-terms`}
            type="checkbox"
            name="terms"
            checked={v.terms}
            onChange={(e) => set("terms", e.target.checked)}
            aria-invalid={!!show("terms")}
            aria-describedby={show("terms") ? `${uid}-terms-error` : undefined}
            className="mt-0.5 h-4 w-4 accent-saffron-500"
          />
          <span>
            I agree to the <span className="text-saffron-600 underline underline-offset-4 dark:text-saffron-300">Terms</span>
          </span>
        </label>
        {show("terms") && (
          <p id={`${uid}-terms-error`} className="mt-1 text-sm text-red-600 dark:text-red-300">
            {errors.terms}
          </p>
        )}
      </div>
      <SubmitButton loading={loading}>{loading ? "Creating account…" : "Create account"}</SubmitButton>
    </form>
  );
}

/** Glass card with the heading, form, social buttons and the switch-page link. */
export function AuthCard({ mode }: { mode: AuthMode }) {
  const [notice, setNotice] = useState("");
  const login = mode === "login";

  return (
    <div className="w-full max-w-md rounded-2xl border border-lagoon-600/15 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-ink-900">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-saffron-600 dark:text-saffron-400">Traveller access</p>
      <h1 className="mt-2 text-3xl font-semibold leading-tight text-ink-900 sm:text-4xl dark:text-white">
        {login ? "Welcome back." : "Start your journey."}
        <span className="mt-0.5 block text-xl font-normal italic text-saffron-600 sm:text-2xl dark:text-saffron-400">
          {login ? "Your next trip is waiting." : "Plans, saved trips, and more."}
        </span>
      </h1>
      <div className="mt-4">
        {login ? <LoginForm onNotice={setNotice} /> : <SignupForm onNotice={setNotice} />}
        <SocialButtons onClick={() => setNotice("Social sign-in isn't connected yet.")} />
        <p role="status" aria-live="polite" className="mt-3 min-h-5 text-center text-sm text-lagoon-700 dark:text-saffron-200">
          {notice}
        </p>
      </div>
      <p className="mt-1 text-center text-sm text-ink-800/80 dark:text-white/80">
        {login ? "No account? " : "Already have an account? "}
        <Link href={login ? "/signup" : "/login"} className="font-semibold text-saffron-600 underline-offset-4 hover:underline dark:text-saffron-300">
          {login ? "Sign up" : "Sign in"}
        </Link>
      </p>
    </div>
  );
}
