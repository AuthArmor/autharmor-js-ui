import { JSX, JSXElement } from "solid-js";
import { useTranslationTable } from "../i18n";
import promptStyles from "./Prompt.module.css";

export type CaptchaPromptProps = {
    captcha: JSXElement;

    class?: string;
    style?: string | JSX.CSSProperties;
};

export function CaptchaPrompt(props: CaptchaPromptProps) {
    const tt = useTranslationTable();

    return (
        <div class={props.class} style={props.style}>
            <p class={promptStyles.prompt}>{tt().form.prompts.captcha.title}</p>
            <p class={promptStyles.promptDescription}>{tt().form.prompts.captcha.description}</p>
            <div class={promptStyles.promptAction}>{props.captcha}</div>
        </div>
    );
}
