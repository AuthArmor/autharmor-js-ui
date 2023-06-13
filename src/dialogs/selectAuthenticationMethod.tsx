import { IAvailableAuthenticationMethods } from "@autharmor/sdk";
import { AuthenticationMethodSelectionDialog } from "../common/AuthenticationMethodSelectionDialog";
import { ITranslationTable } from "../i18n/ITranslationTable";
import { defaultTranslationTable } from "../i18n/translationTables";
import { IDialogUiOptions } from "../options";
import { renderDialog } from "./renderDialog";

export async function selectAuthenticationMethod(
    authenticationMethods: IAvailableAuthenticationMethods,
    translationTable: ITranslationTable = defaultTranslationTable,
    uiOptions: IDialogUiOptions = {},
    abortSignal?: AbortSignal
): Promise<keyof IAvailableAuthenticationMethods> {
    const authenticationMethod = await renderDialog<keyof IAvailableAuthenticationMethods>(
        (resolve, dismiss) => (
            <AuthenticationMethodSelectionDialog
                authenticationMethods={authenticationMethods}
                translationTable={translationTable}
                uiOptions={uiOptions}
                onAuthenticationMethodSelect={resolve}
                onDismiss={dismiss}
            />
        ),
        abortSignal
    );

    return authenticationMethod;
}
