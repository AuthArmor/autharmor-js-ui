import { JSX, Show } from "solid-js";
import cn from "clsx";
import { QrCodeLoader } from "../ui/QrCodeLoader";
import { QrCode } from "../ui/QrCode";
import { useTranslationTable } from "../i18n";
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
                {tt().form.actions.logIn.usernameless.description}
            </p>
            <Show
                when={props.qrCodeData !== null}
                fallback={<QrCodeLoader class={styles.qrCode} isActive={!isError()} />}
            >
                <QrCode
                    data={props.qrCodeData!}
                    class={cn(styles.qrCode, { [styles.errorStateQrCode]: isError() })}
                />
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
