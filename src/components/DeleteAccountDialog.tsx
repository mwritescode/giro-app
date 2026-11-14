"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { deleteAccount } from "@/app/actions";

type DeleteAccountDialogProps = {
  email: string;
  onClose: () => void;
};

export function DeleteAccountDialog({ email, onClose }: DeleteAccountDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [returnPath, setReturnPath] = useState("/firenze");

  useEffect(() => {
    const path = window.location.pathname;
    if (path === "/milano" || path === "/firenze") {
      setReturnPath(path);
    }
  }, []);

  useEffect(() => {
    cancelRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      className="deletion-overlay"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section className="deletion-dialog" role="dialog" aria-modal="true" aria-labelledby="deletion-title">
        <button type="button" className="deletion-close" onClick={onClose} aria-label="Chiudi">
          <X size={20} />
        </button>

        <h1 id="deletion-title">Eliminare il tuo account?</h1>
        <p className="deletion-account">{email}</p>
        <p className="deletion-explanation">
          Il tuo account e tutte le attività salvate nei preferiti verranno eliminati definitivamente.
        </p>
        <p className="deletion-warning">Questa azione non può essere annullata.</p>

        <form action={deleteAccount} className="deletion-actions">
          <input type="hidden" name="ritorno" value={returnPath} />
          <button type="button" className="deletion-cancel" onClick={onClose} ref={cancelRef}>
            Annulla
          </button>
          <button type="submit" className="deletion-submit">
            Elimina account
          </button>
        </form>
      </section>
    </div>
  );
}
