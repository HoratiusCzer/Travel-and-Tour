"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

const fieldClass =
  "w-full rounded-xl border border-lagoon-600/25 bg-white px-4 py-3 text-ink-900 placeholder:text-ink-800/45 focus:border-lagoon-500 focus:outline-none dark:border-white/15 dark:bg-ink-900 dark:text-white";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState("");
  const messageRef = useRef<HTMLTextAreaElement>(null);

  // The trip calculator sends a ready-made enquiry here.
  useEffect(() => {
    const onPrefill = (e: Event) => {
      setMessage((e as CustomEvent<string>).detail);
      setSent(false);
      messageRef.current?.focus({ preventScroll: true });
    };
    window.addEventListener("prefill-contact", onPrefill);
    return () => window.removeEventListener("prefill-contact", onPrefill);
  }, []);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Demo only: wire this up to an API route or email service to receive messages.
    setSent(true);
    e.currentTarget.reset();
    setMessage("");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium">Name</label>
          <input id="name" name="name" required autoComplete="name" className={fieldClass} placeholder="Your name" />
        </div>
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium">Email</label>
          <input id="email" name="email" type="email" required autoComplete="email" className={fieldClass} placeholder="you@example.com" />
        </div>
      </div>
      <div>
        <label htmlFor="message" className="mb-1 block text-sm font-medium">Tell us about your dream trip</label>
        <textarea id="message" name="message" ref={messageRef} value={message} onChange={(e) => setMessage(e.target.value)} required rows={5} className={fieldClass} placeholder="Where, when and with whom?" />
      </div>
      <button
        type="submit"
        className="rounded-full bg-saffron-500 px-7 py-3 text-sm font-semibold text-ink-950 transition hover:bg-saffron-400"
      >
        Send message
      </button>
      <p role="status" aria-live="polite" className="text-sm text-lagoon-700 dark:text-lagoon-200">
        {sent && "Thanks! Your message is on its way. We usually reply within one working day."}
      </p>
    </form>
  );
}
