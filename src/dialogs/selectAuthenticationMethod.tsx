import { AuthenticationMethod, AvailableAuthenticationMethods } from "@autharmor/sdk";
import { AuthenticationMethodSelectionDialog } from "../common/AuthenticationMethodSelectionDialog";
import { ITranslationTable } from "../i18n/ITranslationTable";
import { defaultTranslationTable } from "../i18n/translationTables";
import { IDialogUiOptions } from "../options";
import { renderDialog } from "./renderDialog";

export async function selectAuthenticationMethod(
    availableAuthenticationMethods: AvailableAuthenticationMethods,
    translationTable: ITranslationTable = defaultTranslationTable,
    uiOptions: IDialogUiOptions = {},
    abortSignal?: AbortSignal
): Promise<AuthenticationMethod> {
    const authenticationMethod = await renderDialog<AuthenticationMethod>(
        (resolve, dismiss) => (
            <AuthenticationMethodSelectionDialog
                availableAuthenticationMethods={availableAuthenticationMethods}
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
