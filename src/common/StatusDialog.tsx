import { Match, Switch, createEffect, createSignal, on, onCleanup } from "solid-js";
import { Show } from "solid-js/web";
import { QrCode } from "./QrCode";
import { Dialog } from "./Dialog";
import { PendingPulser } from "./PendingPulser";
import styles from "./StatusDialog.module.css";
import logo from "../assets/logo.png";
import { IDialogUiOptions } from "../options";
import { AppLinkButton } from "./AppLinkButton";
import { isMobile } from "./isMobile";
import { ITranslationTable } from "../i18n/ITranslationTable";
import { createAppLinkHandler } from "./createAppLinkHandler";

export interface IStatusDialogProps {
    title: string;

    statusMessage: string;
    statusType: DialogStatusType;

    authenticationUrl: string | null;
    alwaysShowQrCode?: boolean;

    verificationCode: string | null;

    translationTable: ITranslationTable;
    uiOptions: IDialogUiOptions;

    onClose?: () => void;
}

export type DialogStatusType = "waiting" | "success" | "error";

export function StatusDialog(props: IStatusDialogProps) {
    const tt = () => props.translationTable;

    const [userShowQrCode, setUserShowQrCode] = createSignal(false);
    const isQrCodePresent = () => props.authenticationUrl !== null;
    const allowTogglingQrCode = () => isQrCodePresent() && props.alwaysShowQrCode !== true;
    const showQrCode = () => isQrCodePresent() && (props.alwaysShowQrCode || userShowQrCode());

    const statusMessageTypeClasses: { [statusType in DialogStatusType]: string } = {
        waiting: styles.waitingStatusMessage,
        success: styles.successStatusMessage,
        error: styles.errorStatusMessage
    };
    const statusMessageClass = () =>
        `${styles.statusMessage} ${statusMessageTypeClasses[props.statusType]}`;

    const handleClose = () => {
        props.onClose?.();
    };

    const handleQrCodeToggled = () => {
        setUserShowQrCode((s) => !s);
    };

    const handleAppLinkClicked = createAppLinkHandler(() => props.authenticationUrl);

    return (
        <Dialog
            class={styles.dialog}
            translationTable={tt()}
            uiOptions={props.uiOptions}
            onDismiss={handleClose}
            showCloseButton
        >
            <Show when={!showQrCode()}>
                <p class={styles.title}>{props.title}</p>
                <img class={styles.logo} src={logo} alt={tt().statusDialog.common.logoAltText} />
            </Show>

            <Show when={showQrCode()}>
                <Switch
                    fallback={
                        <>
                            <QrCode class={styles.qrCode} data={props.authenticationUrl!} />
                            <p class={styles.qrCodePrompt}>
                                {tt().statusDialog.common.qrCodePrompt}
                            </p>
                        </>
                    }
                >
                    <Match when={isMobile}>
                        <AppLinkButton
                            class={styles.appLink}
                            link={props.authenticationUrl!}
                            onClick={handleAppLinkClicked}
                        >
                            {tt().statusDialog.common.appLink}
                        </AppLinkButton>
                        <p class={styles.appLinkPrompt}>{tt().statusDialog.common.appLinkPrompt}</p>
                    </Match>
                </Switch>
            </Show>

            <Show when={props.verificationCode !== null}>
                <div class={styles.verificationCodeContainer}>
                    <p class={styles.verificationCode}>{props.verificationCode}</p>
                    <p class={styles.verificationCodePrompt}>Use this code to verify the request</p>
                </div>
            </Show>

            <div class={statusMessageClass()}>
                {props.statusMessage}
                <Show when={props.statusType === "waiting"}>
                    <PendingPulser class={styles.pulser} />
                </Show>
            </div>

            <Show when={allowTogglingQrCode()}>
                <button class={styles.qrToggler} onClick={handleQrCodeToggled}>
                    <Show
                        when={isMobile}
                        fallback={
                            userShowQrCode()
                                ? tt().statusDialog.common.hideQrCodeButton
                                : tt().statusDialog.common.showQrCodeButton
                        }
                    >
                        {userShowQrCode()
                            ? tt().statusDialog.common.hideAppLinkButton
                            : tt().statusDialog.common.showAppLinkButton}
                    </Show>
                </button>
            </Show>
        </Dialog>
    );
}
