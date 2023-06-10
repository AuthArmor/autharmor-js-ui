import { JSXElement, Show, createMemo } from "solid-js";
import styles from "./Dialog.module.css";
import cancelIcon from "../assets/cancelIcon.svg";
import { IDialogUiOptions } from "../options";
import { getUiOptionsStyle } from "./getUiOptionsStyle";
import { ITranslationTable } from "../i18n/ITranslationTable";
import { TranslationTableProvider } from "../context/TranslationTableProvider";

export interface IDialogProps {
    children: JSXElement;
    translationTable: ITranslationTable;
    uiOptions: IDialogUiOptions;
    class?: string;
    showCloseButton?: boolean;

    onDismiss?: () => void;
}

const defaultDialogUiOptions: IDialogUiOptions = {
    borderRadius: ".625rem",
    controlBorderRadius: ".375rem",
    fontFamily: "'Segoe UI', 'Helvetica Neue', 'Open Sans', sans-serif",
    backdropColor: "#00000070",
    backgroundColor: "#2a2d35",
    methodSelectorTitleForegroundColor: "#ffffff",
    statusTitleForegroundColor: "#e0e0e0",
    statusMessageWaitingBackgroundColor: "#0bdbdb",
    statusMessageWaitingForegroundColor: "#ffffff",
    statusMessageSuccessBackgroundColor: "#40e070",
    statusMessageSuccessForegroundColor: "#ffffff",
    statusMessageErrorBackgroundColor: "#f05030",
    statusMessageErrorForegroundColor: "#ffffff",
    statusMessagePulserForegroundColor: "#ffffff",
    closeButtonBackgroundColor: "#545d6d",
    closeButtonForegroundColor: "#ffffff",
    closeButtonHoverBackgroundColor: "#d23b3b",
    closeButtonHoverForegroundColor: "#ffffff",
    buttonBackgroundColor: "#434857",
    buttonForegroundColor: "#ffffff",
    buttonForegroundAccentColor: "#0bdbdb",
    buttonForegroundAuxiliaryColor: "#c0c0c0",
    buttonHoverBackgroundColor: "#535867",
    buttonHoverForegroundColor: "#ffffff",
    qrCodeBackgroundColor: "#202020",
    qrCodeForegroundColor: "#2cb2b5",
    qrCodePromptForegroundColor: "#eeeeee",
    qrCodeTogglerBackgroundColor: "#707075",
    qrCodeTogglerForegroundColor: "#c0c0c0",
    qrCodeTogglerHoverBackgroundColor: "#707075",
    qrCodeTogglerHoverForegroundColor: "#e0e0e0",
    appButtonBackgroundColor: "#121319",
    appButtonForegroundColor: "#b0b0b0",
    appButtonIconBackgroundColor: "#242426"
};

export function Dialog(props: IDialogProps) {
    const dialogClass = () =>
        `${styles.dialog}${props.class !== undefined ? " " + props.class : ""}`;

    const uiOptionsStyle = createMemo(() =>
        getUiOptionsStyle(defaultDialogUiOptions, props.uiOptions)
    );

    const handleBackdropClicked = (event: { currentTarget: HTMLDivElement; target: Element }) => {
        // Ensure that the click is on the backdrop and not bubbling up from the dialog itself.
        if (event.target !== event.currentTarget) {
            return;
        }

        props.onDismiss?.();
    };

    const handleDismissButtonClicked = () => {
        props.onDismiss?.();
    };

    return (
        <TranslationTableProvider translationTable={props.translationTable}>
            <div
                class={styles.dialogBackdrop}
                style={uiOptionsStyle()}
                onClick={handleBackdropClicked}
            >
                <div class={styles.dialogContainer}>
                    <Show when={props.showCloseButton && props.onDismiss !== undefined}>
                        <button class={styles.closeButton} onClick={handleDismissButtonClicked}>
                            <img src={cancelIcon} alt="Close" />
                        </button>
                    </Show>
                    <div class={dialogClass()}>{props.children}</div>
                </div>
            </div>
        </TranslationTableProvider>
    );
}
