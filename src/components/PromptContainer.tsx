import { JSX, JSXElement, Show } from "solid-js";
import styles from "./PromptContainer.module.css";
import backIcon from "../assets/icons/back.svg";
import { useTranslationTable } from "../i18n";

export type PromptContainerProps = {
    username: string;
    isRegistering: boolean;
    children: JSXElement;

    onGoBack?: () => void;

    class?: string;
    style?: string | JSX.CSSProperties;
};

export function PromptContainer(props: PromptContainerProps) {
    const tt = useTranslationTable();

    return (
        <div class={props.class} style={props.style}>
            <div class={styles.controlsBar}>
                <Show when={props.onGoBack !== undefined}>
                    <button onClick={() => props.onGoBack!()} class={styles.backButton}>
                        <img src={backIcon} alt={tt().form.back} class={styles.backButtonIcon} />
                    </button>
                </Show>
                <p class={styles.promptPurpose}>
                    {(props.isRegistering
                        ? tt().form.actions.register.prompt
                        : tt().form.actions.logIn.prompt)(
                        <span class={styles.promptPurposeDetail}>{props.username}</span>
                    )}
                </p>
            </div>
            <div class={styles.prompt}>{props.children}</div>
        </div>
    );
}
