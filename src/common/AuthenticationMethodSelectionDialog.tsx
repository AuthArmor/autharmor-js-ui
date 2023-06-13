import { IAvailableAuthenticationMethods } from "@autharmor/sdk";
import { Show } from "solid-js";
import { Dialog } from "./Dialog";
import styles from "./AuthenticationMethodSelectionDialog.module.css";
import authenticatorIcon from "../assets/authenticatorIcon.svg";
import emailIcon from "../assets/emailIcon.svg";
import webAuthnIcon from "../assets/webAuthnIcon.svg";
import { IDialogUiOptions } from "../options";
import { ITranslationTable } from "../i18n/ITranslationTable";

export interface IAuthenticationMethodSelectionDialogProps {
    authenticationMethods: IAvailableAuthenticationMethods;
    registering?: boolean;

    translationTable: ITranslationTable;
    uiOptions: IDialogUiOptions;

    onAuthenticationMethodSelect: (
        authenticationMethod: keyof IAvailableAuthenticationMethods
    ) => void;
    onDismiss?: () => void;
}

export function AuthenticationMethodSelectionDialog(
    props: IAuthenticationMethodSelectionDialogProps
) {
    const tt = () => props.translationTable;

    const handleAuthenticatorPicked = () => {
        props.onAuthenticationMethodSelect("authenticator");
    };

    const handleWebAuthnPicked = () => {
        props.onAuthenticationMethodSelect("webAuthn");
    };

    const handleEmailMagicLinkPicked = () => {
        props.onAuthenticationMethodSelect("emailMagicLink");
    };

    const handleDismissed = () => {
        props.onDismiss?.();
    };

    return (
        <Dialog
            class={styles.dialog}
            translationTable={tt()}
            uiOptions={props.uiOptions}
            onDismiss={handleDismissed}
        >
            <p class={styles.prompt}>
                {props.registering
                    ? tt().methodSelectorDialog.prompt.register
                    : tt().methodSelectorDialog.prompt.logIn}
            </p>
            <div class={styles.methods}>
                <Show when={props.authenticationMethods.authenticator}>
                    <button onClick={handleAuthenticatorPicked}>
                        <img
                            src={authenticatorIcon}
                            alt={tt().methodSelectorDialog.methods.authenticator.button}
                        />
                        <p>{tt().methodSelectorDialog.methods.authenticator.text}</p>
                        <p>
                            {props.registering
                                ? tt().methodSelectorDialog.methods.authenticator.prompt.register
                                : tt().methodSelectorDialog.methods.authenticator.prompt.logIn}
                        </p>
                    </button>
                </Show>
                <Show when={props.authenticationMethods.emailMagicLink}>
                    <button onClick={handleEmailMagicLinkPicked}>
                        <img src={emailIcon} alt={tt().methodSelectorDialog.methods.email.button} />
                        <p>{tt().methodSelectorDialog.methods.email.text}</p>
                        <p>
                            {props.registering
                                ? tt().methodSelectorDialog.methods.email.prompt.register
                                : tt().methodSelectorDialog.methods.email.prompt.logIn}
                        </p>
                    </button>
                </Show>
                <Show when={props.authenticationMethods.webAuthn}>
                    <button onClick={handleWebAuthnPicked}>
                        <img
                            src={webAuthnIcon}
                            alt={tt().methodSelectorDialog.methods.webAuthn.button}
                        />
                        <p>{tt().methodSelectorDialog.methods.webAuthn.text}</p>
                        <p>
                            {props.registering
                                ? tt().methodSelectorDialog.methods.webAuthn.prompt.register
                                : tt().methodSelectorDialog.methods.webAuthn.prompt.logIn}
                        </p>
                    </button>
                </Show>
            </div>
        </Dialog>
    );
}
