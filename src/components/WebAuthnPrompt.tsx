import { JSX, Show } from "solid-js";
import { useTranslationTable } from "../i18n";
import promptStyles from "./Prompt.module.css";

export type WebAuthnError = "declined" | "network" | "unknown";

export type WebAuthnPromptProps = {
    isRegistering: boolean;
    error?: WebAuthnError | null;

    class?: string;
    style?: string | JSX.CSSProperties;
};

export function WebAuthnPrompt(props: WebAuthnPromptProps) {
    const tt = useTranslationTable();

    return (
        <div class={props.class} style={props.style}>
            <p class={promptStyles.prompt}>
                {
                    (props.isRegistering
                        ? tt().form.prompts.webAuthn.register
                        : tt().form.prompts.webAuthn.logIn
                    ).title
                }
            </p>
            <p class={promptStyles.promptDescription}>
                {
                    (props.isRegistering
                        ? tt().form.prompts.webAuthn.register
                        : tt().form.prompts.webAuthn.logIn
                    ).description
                }
            </p>
            <Show when={props.error !== undefined && props.error !== null}>
                <p class={promptStyles.error}>{tt().form.errors.webAuthn[props.error!]}</p>
            </Show>
        </div>
    );
}
