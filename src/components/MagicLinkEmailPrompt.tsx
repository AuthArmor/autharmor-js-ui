import { JSX, Show } from "solid-js";
import { useTranslationTable } from "../i18n";
import promptStyles from "./Prompt.module.css";

export type MagicLinkEmailError = "network" | "unknown";

export type MagicLinkEmailPromptProps = {
    isRegistering: boolean;
    error?: MagicLinkEmailError | null;

    class?: string;
    style?: string | JSX.CSSProperties;
};

export function MagicLinkEmailPrompt(props: MagicLinkEmailPromptProps) {
    const tt = useTranslationTable();

    return (
        <div class={props.class} style={props.style}>
            <p class={promptStyles.prompt}>
                {
                    (props.isRegistering
                        ? tt().form.prompts.magicLinkEmail.register
                        : tt().form.prompts.magicLinkEmail.logIn
                    ).title
                }
            </p>
            <p class={promptStyles.promptDescription}>
                {
                    (props.isRegistering
                        ? tt().form.prompts.magicLinkEmail.register
                        : tt().form.prompts.magicLinkEmail.logIn
                    ).description
                }
            </p>
            <Show when={props.error !== undefined && props.error !== null}>
                <p class={promptStyles.error}>{tt().form.errors.magicLinkEmail[props.error!]}</p>
            </Show>
        </div>
    );
}
