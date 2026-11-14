"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Share2 } from "lucide-react";

type ShareButtonProps = {
  title: string;
  text?: string;
  withLabel?: boolean;
};

export function ShareButton({ title, text, withLabel = false }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  async function share() {
    const url = window.location.href;

    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch (error) {
        if ((error as Error).name === "AbortError") {
          return;
        }
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      timerRef.current = window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      className={withLabel ? "detail-share" : "share-button"}
      onClick={share}
      aria-label={copied ? "Link copiato" : `Condividi ${title}`}
    >
      {copied ? <Check size={withLabel ? 17 : 16} /> : <Share2 size={withLabel ? 17 : 16} />}
      {withLabel ? <span>{copied ? "Link copiato" : "Condividi"}</span> : null}
      {!withLabel ? <span className="visually-hidden">{copied ? "Link copiato" : "Condividi"}</span> : null}
    </button>
  );
}
