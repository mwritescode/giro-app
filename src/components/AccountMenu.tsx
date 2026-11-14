"use client";

import { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { logout } from "@/app/actions";

export function AccountMenu({ email }: { email: string }) {
  const ref = useRef<HTMLDetailsElement>(null);

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
    <details className="account-menu" ref={ref}>
      <summary className="account-button">
        <span className="account-avatar">{email.slice(0, 1).toUpperCase()}</span>
        <ChevronDown size={15} />
      </summary>
      <div className="account-popover">
        <p className="account-popover-email">{email}</p>
        <form action={logout}>
          <button type="submit" className="account-logout">
            Esci
          </button>
        </form>
      </div>
    </details>
  );
}
