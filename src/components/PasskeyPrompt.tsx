import { JSX, Show } from "solid-js";
import { useTranslationTable } from "../i18n";
import { ProgressLoader } from "../ui/ProgressLoader";
import promptStyles from "./Prompt.module.css";

export type PasskeyError = "declined" | "network" | "unknown";

export type PasskeyPromptProps = {
    isRegistering: boolean;
    error?: PasskeyError | null;

    onErrorRecoverRequest?: () => void;

    class?: string;
    style?: string | JSX.CSSProperties;
};

export function PasskeyPrompt(props: PasskeyPromptProps) {
    const tt = useTranslationTable();

    const isError = () => props.error !== undefined && props.error !== null;

    return (
        <div class={props.class} style={props.style}>
            <p class={promptStyles.prompt}>
                {
                    (props.isRegistering
                        ? tt().form.prompts.passkey.register
                        : tt().form.prompts.passkey.logIn
                    ).title
                }
            </p>
            <p class={promptStyles.promptDescription}>
                {
                    (props.isRegistering
                        ? tt().form.prompts.passkey.register
                        : tt().form.prompts.passkey.logIn
                    ).description
                }
            </p>
            <ProgressLoader isActive={!isError()} class={promptStyles.loader} />
            <Show when={isError()}>
                <p class={promptStyles.error}>{tt().form.errors.passkey[props.error!]}</p>
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
