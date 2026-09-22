import { useState } from "react";

type DialogState<T> = { mode: "closed" } | { mode: "create" } | { mode: "edit"; entity: T };

/**
 * The open/create/edit state machine every CRUD dialog repeats. `editing` is the entity being
 * edited, or null when creating, so a form can pick its defaults from it.
 *
 * `session` changes on every opening. Use it as the `key` of the dialog's form component so each opening
 * starts from fresh defaults without an effect; it stays put on close so the exit animation can finish.
 */
export function useEntityDialog<T>() {
  const [state, setState] = useState<DialogState<T>>({ mode: "closed" });
  const [session, setSession] = useState(0);

  const open = (next: DialogState<T>) => {
    setSession((current) => current + 1);
    setState(next);
  };
  const close = () => setState({ mode: "closed" });

  return {
    isOpen: state.mode !== "closed",
    editing: state.mode === "edit" ? state.entity : null,
    session,
    openCreate: () => open({ mode: "create" }),
    openEdit: (entity: T) => open({ mode: "edit", entity }),
    close,
    /** For a Dialog's `onOpenChange`: the dialog may only ask to close, opening goes through openCreate/openEdit. */
    onOpenChange: (isOpen: boolean) => {
      if (!isOpen) close();
    },
  };
}
