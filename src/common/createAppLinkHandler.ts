import { Accessor, on, onCleanup } from "solid-js";

export function createAppLinkHandler(
    appLinkAccessor: Accessor<string | null>
): (appLink: string) => boolean | void {
    let existingWindow: Window | null = null;

    const tryCloseWindow = () => {
        if (existingWindow !== null) {
            existingWindow.close();
            existingWindow = null;
        }
    };

    on(appLinkAccessor, tryCloseWindow);
    onCleanup(tryCloseWindow);

    const appLinkHandler = (appLink: string): boolean | void => {
        tryCloseWindow();

        existingWindow = window.open(appLink, "_blank");

        if (existingWindow === null) {
            return;
        }

        return false;
    };

    return appLinkHandler;
}
