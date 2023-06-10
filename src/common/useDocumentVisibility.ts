import { Accessor, createSignal, onCleanup } from "solid-js";

export function useDocumentVisibility(): Accessor<boolean> {
    const [isVisible, setIsVisible] = createSignal(!document.hidden);

    const updateVisibility = () => setIsVisible(!document.hidden);

    document.addEventListener("visibilitychange", updateVisibility);

    onCleanup(() => {
        document.removeEventListener("visibilitychange", updateVisibility);
    });

    return isVisible;
}
