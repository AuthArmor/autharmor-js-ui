import { JSX } from "solid-js";
import { useTranslationTable } from "../i18n";
import promptStyles from "./Prompt.module.css";

export type WaitPromptProps = {
    class?: string;
    style?: string | JSX.CSSProperties;
};

export function WaitPrompt(props: WaitPromptProps) {
    const tt = useTranslationTable();

    return (
        <div class={props.class} style={props.style}>
            <p class={promptStyles.prompt}>{tt().form.prompts.wait.title}</p>
            <p class={promptStyles.promptDescription}>{tt().form.prompts.wait.description}</p>
        </div>
    );
}
