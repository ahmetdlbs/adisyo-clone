import { toast } from "sonner";

export const UNAVAILABLE_MESSAGE = "Bu özellik henüz kullanılabilir değil.";

/** Non-blocking replacement for `alert()` on controls whose feature is not built yet. */
export function notifyUnavailable() {
  toast.info(UNAVAILABLE_MESSAGE);
}
