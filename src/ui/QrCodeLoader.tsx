import { JSX } from "solid-js";
import cn from "clsx";
import styles from "./QrCodeLoader.module.css";

export type QrCodeLoaderProps = {
    isActive: boolean;

    class?: string;
    style?: string | JSX.CSSProperties;
};

export function QrCodeLoader(props: QrCodeLoaderProps) {
    return (
        <div
            class={cn(
                styles.qrCodeLoader,
                { [styles.activeQrCodeLoader]: props.isActive },
                props.class
            )}
            style={props.style}
        />
    );
}
