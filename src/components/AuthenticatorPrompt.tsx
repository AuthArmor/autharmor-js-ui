import { JSX, Show } from "solid-js";
import cn from "clsx";
import { AppLink } from "./AppLink";
import { QrCodeLoader } from "../ui/QrCodeLoader";
import { QrCode } from "../ui/QrCode";
import { isMobile } from "../common/isMobile";
import { useTranslationTable } from "../i18n";
import styles from "./AuthenticatorPrompt.module.css";
import promptStyles from "./Prompt.module.css";

export type AuthenticatorError = "timedOut" | "declined" | "network" | "unknown";

export type AuthenticatorPromptProps = {
    isRegistering: boolean;
    qrCodeData: string | null;
    error?: AuthenticatorError | null;

    onErrorRecoverRequest?: () => void;

    class?: string;
    style?: string | JSX.CSSProperties;
};

export function AuthenticatorPrompt(props: AuthenticatorPromptProps) {
    const tt = useTranslationTable();

    const isError = () => props.error !== undefined && props.error !== null;

    return (
        <div class={props.class} style={props.style}>
            <p class={promptStyles.prompt}>
                {
                    (props.isRegistering
                        ? tt().form.prompts.authenticator.register
                        : tt().form.prompts.authenticator.logIn
                    ).title
                }
            </p>
            <p class={promptStyles.promptDescription}>
                {
                    tt().form.prompts.authenticator[props.isRegistering ? "register" : "logIn"]
                        .description[isMobile ? "appLink" : "qrCode"]
                }
            </p>
            <div class={cn(promptStyles.promptAction, styles.qrCode)}>
                <Show
                    when={props.qrCodeData !== null}
                    fallback={<QrCodeLoader isActive={!isError()} class={styles.qrCode} />}
                >
                    <Show
                        when={isMobile}
                        fallback={
                            <QrCode
                                data={props.qrCodeData!}
                                class={cn(styles.qrCode, { [styles.errorStateQrCode]: isError() })}
                            />
                        }
                    >
                        <AppLink data={props.qrCodeData!} class={styles.appLink} />
                    </Show>
                </Show>
            </div>
            <Show when={props.error !== undefined && props.error !== null}>
                <p class={promptStyles.error}>{tt().form.errors.authenticator[props.error!]}</p>
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
