"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, CalendarDays, Landmark, MapPin } from "lucide-react";
import type { SearchRow } from "@/lib/search";

const SECTION_ICONS = {
  Luoghi: MapPin,
  Attività: CalendarDays,
  Interessi: Landmark,
};

const SECTIONS = ["Luoghi", "Attività", "Interessi"] as const;

type SearchResultsProps = {
  rows: SearchRow[];
  query: string;
  citySlug: string;
  activeIndex: number;
  onNavigate: () => void;
};

export function SearchResults({ rows, query, citySlug, activeIndex, onNavigate }: SearchResultsProps) {
  return (
    <div className="search-results">
      {SECTIONS.map((section) => {
        const items = rows.filter((row) => row.section === section);
        if (items.length === 0) {
          return null;
        }
        const Icon = SECTION_ICONS[section];

        return (
          <section key={section} className="search-group">
            <h2>{section}</h2>
            {items.map((row) => {
              const index = rows.indexOf(row);
              const isActive = index === activeIndex;

              return (
                <Link
                  key={row.key}
                  id={`search-row-${index}`}
                  href={row.href}
                  className={`search-row${isActive ? " is-active" : ""}`}
                  onClick={onNavigate}
                >
                  <span className="search-row-icon">
                    <Icon size={17} />
                  </span>
                  <span className="search-row-text">
                    <strong>{row.title}</strong>
                    <span>{row.subtitle}</span>
                  </span>
                  <ArrowUpRight size={15} />
                </Link>
              );
            })}
          </section>
        );
      })}

      <Link
        href={`/cerca?q=${encodeURIComponent(query)}&citta=${citySlug}&tutti=1`}
        className="search-all-row"
        onClick={onNavigate}
      >
        Vedi tutti i risultati per “{query}” <ArrowRight size={15} />
      </Link>
    </div>
  );
}
