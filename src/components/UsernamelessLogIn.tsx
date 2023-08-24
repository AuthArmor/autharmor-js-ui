import { JSX, Show } from "solid-js";
import cn from "clsx";
import { AppLinkLoader } from "../ui/AppLinkLoader";
import { AppLink } from "./AppLink";
import { QrCodeLoader } from "../ui/QrCodeLoader";
import { QrCode } from "../ui/QrCode";
import { useTranslationTable } from "../i18n";
import { isMobile } from "../common/isMobile";
import styles from "./UsernamelessLogIn.module.css";
import formStyles from "./Form.module.css";

export type UsernamelessLogInError = "declined" | "network" | "unknown";

export type UsernamelessLogInProps = {
    qrCodeData: string | null;
    verificationCode: string | null;
    error?: UsernamelessLogInError | null;

    onRetry: () => void;

    class?: string;
    style?: string | JSX.CSSProperties;
};

export function UsernamelessLogIn(props: UsernamelessLogInProps) {
    const tt = useTranslationTable();

    const isError = () => props.error !== undefined && props.error !== null;

    return (
        <div class={props.class} style={props.style}>
            <p class={formStyles.methodTitle}>{tt().form.actions.logIn.usernameless.title}</p>
            <p class={formStyles.methodDescription}>
                {tt().form.actions.logIn.usernameless.description[isMobile ? "appLink" : "qrCode"]}
            </p>
            <Show
                when={isMobile}
                fallback={
                    <Show
                        when={props.qrCodeData !== null}
                        fallback={
                            <QrCodeLoader isActive={!isError()} class={styles.qrCodeLoader} />
                        }
                    >
                        <QrCode
                            data={props.qrCodeData!}
                            class={cn(styles.qrCode, { [styles.errorStateQrCode]: isError() })}
                        />
                    </Show>
                }
            >
                <Show
                    when={props.qrCodeData !== null}
                    fallback={<AppLinkLoader isActive={!isError()} class={styles.appLinkLoader} />}
                >
                    <AppLink data={props.qrCodeData!} class={styles.appLink} />
                </Show>
            </Show>
            <Show when={props.verificationCode !== null}>
                <p class={styles.verificationCode}>
                    {tt().form.actions.logIn.usernameless.verificationCode(
                        <span class={styles.verificationCodeValue}>{props.verificationCode}</span>
                    )}
                </p>
            </Show>
            <Show when={isError()}>
                <p class={styles.error}>{tt().form.errors.usernamelessLogIn[props.error!]}</p>
                <button class={styles.retryButton} onClick={() => props.onRetry()}>
                    {tt().form.actions.logIn.usernameless.retry}
                </button>
            </Show>
        </div>
    );
}
