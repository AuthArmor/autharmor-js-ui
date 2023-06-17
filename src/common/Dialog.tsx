import { JSXElement, Show, createMemo } from "solid-js";
import styles from "./Dialog.module.css";
import cancelIcon from "../assets/cancelIcon.svg";
import { IDialogUiOptions, defaultUiOptions } from "../options";
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

export function Dialog(props: IDialogProps) {
    const dialogClass = () =>
        `${styles.dialog}${props.class !== undefined ? " " + props.class : ""}`;

    const uiOptionsStyle = createMemo(() =>
        getUiOptionsStyle(defaultUiOptions.dialog!, props.uiOptions)
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
        <TranslationTableProvider translationTable={() => props.translationTable}>
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
