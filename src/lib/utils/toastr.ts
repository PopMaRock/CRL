import { browser } from "$app/environment";
import toast from "svelte-french-toast";
import type { ToastOptions, ToastPosition } from "svelte-french-toast";
/*
FRONTEND ONLY
*/
/**
 * Displays a toast notification with the specified message, type, and options.
 *
 * @param {Object} options - The options for the toast notification.
 * @param {string} [options.message="msg"] - The message to display in the toast.
 * @param {string} [options.type="info"] - The type of the toast. Can be "success", "error", "warning", or "info".
 * @param {number} [options.timeout=5000] - The duration the toast should be displayed, in milliseconds.
 * @param {ToastPosition} [options.position="bottom-center"] - The position of the toast on the screen.
 * @param {boolean} [options.hideDismiss=false] - Whether to hide the dismiss button on the toast.
 * @returns {Promise<void>} A promise that resolves when the toast is displayed.
 */
export async function toastr({
  message = "msg",
  type = "info",
  timeout = 5000,
  position = "bottom-center" as ToastPosition,
  hideDismiss = false,
}) {
  if (browser) {
    const tSettings: ToastOptions = {
      position: position,
      duration: timeout,
      //hideDismiss: hideDismiss,
      //callback: callback,
    };
    switch (type) {
      case "success":
        toast.success(message, {
          ...tSettings,
          className: "!variant-filled-success",
        });
        break;
      case "error":
        toast.error(message, {
          ...tSettings,
          className: "!variant-filled-error",
        });
        break;
      case "warning":
        toast(message, { ...tSettings, className: "!variant-filled-warning" });
        break;
      default:
        toast(message, { ...tSettings, className: "!variant-filled-info" });
        break;
    }
  }
}
/**
 * Displays a toast notification based on the state of a promise.
 *
 * @param {Object} params - The parameters for the toast notification.
 * @param {Object} params.messages - The messages to display for different states of the promise.
 * @param {string} [params.messages.loading="Saving..."] - The message to display while the promise is loading.
 * @param {string} [params.messages.success="saved!"] - The message to display when the promise resolves successfully.
 * @param {string} [params.messages.error="Could not save."] - The message to display when the promise is rejected.
 * @param {ToastPosition} [params.position="bottom-center"] - The position of the toast notification.
 * @param {Promise} [params.promiscuous=new Promise(() => {})] - The promise to monitor.
 * @returns {Promise<void>} A promise that resolves when the toast notification is displayed.
 */
export async function toastrPromise({
  messages = {
    loading: "Saving...",
    success: "saved!",
    error: "Could not save.",
  },
  position = "bottom-center" as ToastPosition,
  promiscuous = new Promise(() => {}),
}) {
  if (browser) {
    const tSettings: ToastOptions = {
      position: position,
    };
    await toast.promise(promiscuous,
      {...tSettings, ...messages},
    );
  }
}
