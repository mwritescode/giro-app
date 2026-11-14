"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { logout } from "@/app/actions";
import { DeleteAccountDialog } from "./DeleteAccountDialog";

export function AccountMenu({ email }: { email: string }) {
  const ref = useRef<HTMLDetailsElement>(null);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      const element = ref.current;
      if (element?.open && !element.contains(event.target as Node)) {
        element.open = false;
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && ref.current?.open) {
        ref.current.open = false;
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <>
      <details className="account-menu" ref={ref}>
        <summary className="account-button">
          <span className="account-avatar">{email.slice(0, 1).toUpperCase()}</span>
          <ChevronDown size={15} />
        </summary>
        <div className="account-popover">
          <p className="account-popover-email">{email}</p>
          <form action={logout}>
            <button type="submit" className="account-menu-exit">
              Esci
            </button>
          </form>
          <div className="account-menu-danger">
            <button
              type="button"
              onClick={() => {
                if (ref.current) {
                  ref.current.open = false;
                }
                setConfirming(true);
              }}
            >
              Elimina account
            </button>
          </div>
        </div>
      </details>

      {confirming ? (
        <DeleteAccountDialog email={email} onClose={() => setConfirming(false)} />
      ) : null}
    </>
  );
}
