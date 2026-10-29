"use client";

import { useRouter } from "next/navigation";
import { useId, useState, type FormEvent } from "react";
import { destinations } from "@/data/destinations";

export function SearchBar() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const listId = useId();

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const term = value.trim();
    router.push(term ? `/?q=${encodeURIComponent(term)}#destinations` : "/#destinations");
  }

  return (
    <form
      onSubmit={onSubmit}
      role="search"
      className="mx-auto mt-8 flex w-full max-w-xl flex-col gap-2 rounded-3xl bg-white/95 p-2 shadow-xl sm:flex-row sm:rounded-full dark:bg-ink-900/95"
    >
      <label htmlFor="hero-search" className="sr-only">
        Search destinations
      </label>
      <input
        id="hero-search"
        list={listId}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Where to next? Try “Tokyo” or “beach”"
        className="min-w-0 flex-1 rounded-full bg-transparent px-5 py-3 text-ink-900 placeholder:text-ink-800/50 focus:outline-none dark:text-white dark:placeholder:text-lagoon-50/50"
      />
      <datalist id={listId}>
        {destinations.map((d) => (
          <option key={d.slug} value={d.name} />
        ))}
      </datalist>
      <button
        type="submit"
        className="rounded-full bg-saffron-500 px-7 py-3 text-sm font-semibold text-ink-950 transition hover:bg-saffron-400"
      >
        Search
      </button>
    </form>
  );
}
