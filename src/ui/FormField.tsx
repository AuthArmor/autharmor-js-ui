import { JSX, JSXElement, Show } from "solid-js";
import cn from "clsx";
import styles from "./FormField.module.css";

export type FormFieldProps = {
    label: string;
    error?: string | null;

    children: JSXElement;

    class?: string;
    style?: string | JSX.CSSProperties;
};

export function FormField(props: FormFieldProps) {
    return (
        <div class={cn(styles.field, props.class)} style={props.style}>
            <p class={styles.label}>{props.label}</p>
            <div class={styles.control}>{props.children}</div>
            <Show when={props.error !== undefined && props.error !== null}>
                <p class={styles.error}>{props.error}</p>
            </Show>
        </div>
    );
}
