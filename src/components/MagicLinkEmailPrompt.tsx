import { JSX, Show } from "solid-js";
import { useTranslationTable } from "../i18n";
import promptStyles from "./Prompt.module.css";

export type MagicLinkEmailError = "network" | "unknown";

export type MagicLinkEmailPromptProps = {
    isRegistering: boolean;

    isOutOfBandCompleted: boolean;

    error?: MagicLinkEmailError | null;

    onErrorRecoverRequest?: () => void;

    class?: string;
    style?: string | JSX.CSSProperties;
};

export function MagicLinkEmailPrompt(props: MagicLinkEmailPromptProps) {
    const tt = useTranslationTable();

    return (
        <div class={props.class} style={props.style}>
            <p class={promptStyles.prompt}>
                {tt().form.prompts.magicLinkEmail[props.isRegistering ? "register" : "logIn"].title}
            </p>
            <p class={promptStyles.promptDescription}>
                {
                    tt().form.prompts.magicLinkEmail[props.isRegistering ? "register" : "logIn"]
                        .description
                }
            </p>
            <Show when={props.isOutOfBandCompleted}>
                <p class={promptStyles.info}>
                    {
                        tt().form.prompts.magicLinkEmail[props.isRegistering ? "register" : "logIn"]
                            .outOfBandCompletionInfo
                    }
                </p>
            </Show>
            <Show when={props.error !== undefined && props.error !== null}>
                <p class={promptStyles.error}>{tt().form.errors.magicLinkEmail[props.error!]}</p>
                <Show when={props.onErrorRecoverRequest !== undefined}>
                    <button
                        class={promptStyles.errorButton}
                        onClick={() => props.onErrorRecoverRequest!()}
                    >
                        {tt().form.errors.recover}
                    </button>
                </Show>
            </Show>
        </div>
    );
}
