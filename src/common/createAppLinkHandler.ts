import { Accessor, on, onCleanup } from "solid-js";

export function createAppLinkHandler(appLinkAccessor: Accessor<string | null>): () => boolean | void {
    let existingWindow: Window | null = null;

    const tryCloseWindow = () => {
        if (existingWindow !== null) {
            existingWindow.close();
            existingWindow = null;
        }
    };

    on(appLinkAccessor, tryCloseWindow);
    onCleanup(tryCloseWindow);

    const appLinkHandler = (): boolean | void => {
        const appLink = appLinkAccessor();

        if (appLink === null) {
            return;
        }

        tryCloseWindow();

        existingWindow = window.open(appLink, "_blank");

        if (existingWindow === null) {
            return;
        }

        return false;
    }

    return appLinkHandler;
}
