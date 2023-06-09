import { Setter, createSignal } from "solid-js";
import { render } from "solid-js/web";
import { DialogStatusType, StatusDialog } from "../common/StatusDialog";
import { RequestDismissedError } from "../errors/RequestDismissedError";
import { IDialogUiOptions } from "../options";
import { ITranslationTable } from "../i18n/ITranslationTable";
import { defaultTranslationTable } from "../i18n/translationTables";

export function createAuthStatusDialog(
    translationTable: ITranslationTable = defaultTranslationTable,
    uiOptions: IDialogUiOptions = {},
    abortSignal?: AbortSignal,
    abortController?: AbortController
): [
    {},
    {
        setTitle: Setter<string>;
        setStatusMessage: Setter<string>;
        setStatusType: Setter<DialogStatusType>;
        setAuthenticationUrl: Setter<string | null>;
        setAlwaysShowQrCode: Setter<boolean>;
    }
] {
    abortSignal?.throwIfAborted();

    const renderRoot = document.createElement("div");
    document.body.appendChild(renderRoot);

    const cleanup = () => {
        dispose();
        document.body.removeChild(renderRoot);
        abortSignal?.removeEventListener("abort", cleanup);
    };

    const handleDismissed = () => {
        if (abortController !== undefined) {
            abortController.abort(new RequestDismissedError());
        } else {
            cleanup();
        }
    };

    abortSignal?.addEventListener("abort", cleanup);

    const [title, setTitle] = createSignal<string>("");
    const [statusMessage, setStatusMessage] = createSignal<string>("");
    const [statusType, setStatusType] = createSignal<DialogStatusType>("waiting");
    const [authenticationUrl, setAuthenticationUrl] = createSignal<string | null>(null);
    const [alwaysShowQrCode, setAlwaysShowQrCode] = createSignal<boolean>(false);

    const dispose = render(
        () => (
            <StatusDialog
                title={title()}
                statusMessage={statusMessage()}
                statusType={statusType()}
                authenticationUrl={authenticationUrl()}
                alwaysShowQrCode={alwaysShowQrCode()}
                translationTable={translationTable}
                uiOptions={uiOptions}
                onClose={handleDismissed}
            />
        ),
        renderRoot
    );

    return [
        {},
        { setTitle, setStatusMessage, setStatusType, setAuthenticationUrl, setAlwaysShowQrCode }
    ];
}
