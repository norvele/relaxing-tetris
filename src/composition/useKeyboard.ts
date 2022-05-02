import { onBeforeUnmount, onMounted } from "vue";
import { injectContainer } from "@/container";

export function useKeyboard() {
  const { keyboardEventInitiator } = injectContainer();

  const keydownListener = (event: KeyboardEvent) => {
    if (event.repeat) {
      return;
    }
    keyboardEventInitiator.keyDown(event.code);
  };
  const keyupListener = (event: KeyboardEvent) => {
    if (event.repeat) {
      return;
    }
    keyboardEventInitiator.keyUp(event.code);
  };

  onMounted(() => {
    document.addEventListener("keydown", keydownListener);
    document.addEventListener("keyup", keyupListener);
  });

  onBeforeUnmount(() => {
    document.removeEventListener("keydown", keydownListener);
    document.removeEventListener("keyup", keyupListener);
  });

  return { keyboardEventInitiator };
}
