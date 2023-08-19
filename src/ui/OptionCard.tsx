import { JSX, Show } from "solid-js";
import cn from "clsx";
import styles from "./OptionCard.module.css";

export type OptionCardProps = {
    iconSrc: string;
    label: string;
    description?: string;

    ref?: HTMLButtonElement;

    onClick?: () => void;

    class?: string;
    style?: string | JSX.CSSProperties;
};

export function OptionCard(props: OptionCardProps) {
    return (
        <button
            ref={props.ref}
            onClick={() => props.onClick?.()}
            class={cn(styles.card, props.class)}
            style={props.style}
        >
            <img src={props.iconSrc} alt={props.label} class={styles.icon} />
            <p class={styles.label}>{props.label}</p>
            <Show when={props.description !== undefined}>
                <p class={styles.description}>{props.description}</p>
            </Show>
        </button>
    );
}
