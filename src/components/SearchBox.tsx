"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { buildRows, EMPTY_PAYLOAD, hasResults, type SearchPayload } from "@/lib/search";
import { SearchResults } from "./SearchResults";

type SearchBoxProps = {
  citySlug: string;
  initialQuery?: string;
  initialPayload?: SearchPayload;
  variant?: "overlay" | "page";
  autoOpen?: boolean;
  children?: React.ReactNode;
};

const DEBOUNCE_MS = 200;
const MIN_LENGTH = 2;

export function SearchBox({
  citySlug,
  initialQuery = "",
  initialPayload = EMPTY_PAYLOAD,
  variant = "overlay",
  autoOpen = true,
  children,
}: SearchBoxProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const [query, setQuery] = useState(initialQuery);
  const [payload, setPayload] = useState<SearchPayload>(initialPayload);
  const [open, setOpen] = useState(
    variant === "page" && autoOpen && initialQuery.trim().length >= MIN_LENGTH,
  );
  const [pending, setPending] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const term = query.trim();
  const rows = useMemo(() => buildRows(payload, citySlug), [payload, citySlug]);

  useEffect(() => {
    if (term.length < MIN_LENGTH) {
      abortRef.current?.abort();
      setPayload(EMPTY_PAYLOAD);
      setPending(false);
      if (variant === "overlay") {
        setOpen(false);
      }
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      abortRef.current?.abort();
      abortRef.current = controller;
      setPending(true);

      try {
        const response = await fetch(
          `/api/cerca?q=${encodeURIComponent(term)}&citta=${citySlug}`,
          { signal: controller.signal },
        );
        if (!response.ok) {
          throw new Error("search failed");
        }
        const data = (await response.json()) as SearchPayload;
        setPayload(data);
        setActiveIndex(-1);
        setOpen(true);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setPayload(EMPTY_PAYLOAD);
        }
      } finally {
        if (!controller.signal.aborted) {
          setPending(false);
        }
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [term, citySlug, variant]);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!open && term.length >= MIN_LENGTH) {
        setOpen(true);
        return;
      }
      setActiveIndex((index) => Math.min(index + 1, rows.length - 1));
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, -1));
      return;
    }

    if (event.key === "Enter" && open && activeIndex >= 0 && rows[activeIndex]) {
      event.preventDefault();
      setOpen(false);
      router.push(rows[activeIndex].href);
    }
  }

  const showPanel = open && term.length >= MIN_LENGTH;

  return (
    <div className={`search-box search-box--${variant}`} ref={containerRef}>
      <form method="get" action="/cerca" className="search-box-form">
        <input type="hidden" name="citta" value={citySlug} />
        <div className="search-box-field">
          <Search size={18} />
          <input
            type="search"
            name="q"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onKeyDown}
            onFocus={() => {
              if (term.length >= MIN_LENGTH) {
                setOpen(true);
              }
            }}
            placeholder="Cerca"
            aria-label="Cerca attività, luoghi e interessi"
            autoFocus={variant === "page"}
            role="combobox"
            aria-expanded={showPanel}
            aria-controls="search-results"
            aria-autocomplete="list"
            aria-activedescendant={activeIndex >= 0 ? `search-row-${activeIndex}` : undefined}
          />
        </div>
      </form>

      {children}

      {showPanel ? (
        <div className="search-box-panel" id="search-results">
          {!hasResults(payload) ? (
            <p className="search-box-status">{pending ? "Cerco…" : `Nessun risultato per “${term}”.`}</p>
          ) : (
            <SearchResults
              rows={rows}
              query={term}
              citySlug={citySlug}
              activeIndex={activeIndex}
              onNavigate={() => setOpen(false)}
            />
          )}
        </div>
      ) : null}
    </div>
  );
}
