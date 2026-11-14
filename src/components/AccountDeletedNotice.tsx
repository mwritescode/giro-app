"use client";

import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";

export function AccountDeletedNotice() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.delete("eliminato");
    window.history.replaceState(null, "", url);
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <section className="account-deleted" role="status">
      <Check size={20} />
      <div>
        <strong>Account eliminato</strong>
        <p>Il tuo account e i preferiti sono stati eliminati.</p>
      </div>
      <button type="button" onClick={() => setVisible(false)} aria-label="Chiudi">
        <X size={16} />
      </button>
    </section>
  );
}
