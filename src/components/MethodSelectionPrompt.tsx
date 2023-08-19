import { AuthenticationMethod, AvailableAuthenticationMethods } from "@autharmor/autharmor-js";
import { JSX, Show } from "solid-js";
import cn from "clsx";
import { useTranslationTable } from "../i18n";
import { OptionCard } from "../ui/OptionCard";
import styles from "./MethodSelectionPrompt.module.css";
import promptStyles from "./Prompt.module.css";
import authenticatorIcon from "../assets/icons/authenticator.svg";
import magicLinkEmailIcon from "../assets/icons/magicLinkEmail.svg";
import webAuthnIcon from "../assets/icons/webAuthn.svg";

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
                <Show when={props.availableMethods.webAuthn}>
                    <OptionCard
                        iconSrc={webAuthnIcon}
                        label={tt().form.methods.webAuthn.label}
                        description={tt().form.methods.webAuthn.description}
                        onClick={() => props.onSelect("webAuthn")}
                    />
                </Show>
            </div>
        </div>
    );
}
