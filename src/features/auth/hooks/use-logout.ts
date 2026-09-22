"use client";

import { useTransition } from "react";
import { logoutAction } from "../server/actions";

/**
 * Signs out through the Server Action. Running it in a transition reports `isPending` and, unlike a bare
 * `void logoutAction()`, surfaces a failure to the nearest error boundary instead of dropping it.
 */
export function useLogout() {
  const [isPending, startTransition] = useTransition();

  const logout = () => {
    startTransition(async () => {
      await logoutAction();
    });
  };

  return { logout, isPending };
}
