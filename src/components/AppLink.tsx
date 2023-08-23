import { JSX, onCleanup } from "solid-js";
import cn from "clsx";
import styles from "./AppLink.module.css";
import authenticatorIcon from "../assets/icons/authenticator.svg";

export type AppLinkProps = {
    data: string;

    class?: string;
    style?: string | JSX.CSSProperties;
};

export function AppLink(props: AppLinkProps) {
    let existingWindow: Window | null = null;

    onCleanup(() => {
        existingWindow?.close();
    });

    const handleClick = (event: Event) => {
        existingWindow?.close();

        existingWindow = window.open(props.data, "_blank");

        if (existingWindow !== null) {
            event.preventDefault();
        }
    };

    return (
        <a
            href={props.data}
            onClick={handleClick}
            class={cn(styles.link, props.class)}
            style={props.style}
        >
            <img src={authenticatorIcon} alt="" class={styles.icon} />
            <p class={styles.label}>Open Auth Armor App</p>
        </a>
    );
}
