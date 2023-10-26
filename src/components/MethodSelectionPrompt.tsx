import { AuthenticationMethod, AvailableAuthenticationMethods } from "@autharmor/autharmor-js";
import { JSX, Show } from "solid-js";
import cn from "clsx";
import { useTranslationTable } from "../i18n";
import { OptionCard } from "../ui/OptionCard";
import styles from "./MethodSelectionPrompt.module.css";
import promptStyles from "./Prompt.module.css";
import authenticatorIcon from "../assets/icons/authenticator.svg";
import magicLinkEmailIcon from "../assets/icons/magicLinkEmail.svg";
import passkeyIcon from "../assets/icons/passkey.svg";

export type MethodSelectionPromptProps = {
    availableMethods: AvailableAuthenticationMethods;

    onSelect: (method: AuthenticationMethod) => void;

    class?: string;
    style?: string | JSX.CSSProperties;
};

export function MethodSelectionPrompt(props: MethodSelectionPromptProps) {
    const tt = useTranslationTable();

    return (
        <div class={props.class} style={props.style}>
            <p class={promptStyles.prompt}>{tt().form.methods.prompt}</p>
            <div class={cn(promptStyles.promptAction, styles.options)}>
                <Show when={props.availableMethods.authenticator}>
                    <OptionCard
                        iconSrc={authenticatorIcon}
                        label={tt().form.methods.authenticator.label}
                        description={tt().form.methods.authenticator.description}
                        onClick={() => props.onSelect("authenticator")}
                    />
                </Show>
                <Show when={props.availableMethods.magicLinkEmail}>
                    <OptionCard
                        iconSrc={magicLinkEmailIcon}
                        label={tt().form.methods.magicLinkEmail.label}
                        description={tt().form.methods.magicLinkEmail.description}
                        onClick={() => props.onSelect("magicLinkEmail")}
                    />
                </Show>
                <Show when={props.availableMethods.passkey}>
                    <OptionCard
                        iconSrc={passkeyIcon}
                        label={tt().form.methods.passkey.label}
                        description={tt().form.methods.passkey.description}
                        onClick={() => props.onSelect("passkey")}
                    />
                </Show>
            </div>
        </div>
    );
}
