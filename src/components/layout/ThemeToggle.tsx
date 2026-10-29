"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      /* storage unavailable; theme still applies for this visit */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="grid h-10 w-10 place-items-center rounded-full border border-lagoon-600/30 text-lg text-lagoon-700 transition hover:bg-lagoon-50 dark:border-lagoon-400/30 dark:text-saffron-400 dark:hover:bg-lagoon-900"
    >
      <span aria-hidden>{dark ? "☀" : "☾"}</span>
    </button>
  );
}
