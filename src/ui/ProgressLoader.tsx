import { JSX } from "solid-js";
import cn from "clsx";
import styles from "./ProgressLoader.module.css";

export type ProgressLoaderProps = {
    isActive: boolean;

    class?: string;
    style?: string | JSX.CSSProperties;
};

export function ProgressLoader(props: ProgressLoaderProps) {
    return (
        <div
            class={cn(
                styles.progressLoader,
                { [styles.activeProgressLoader]: props.isActive },
                props.class
            )}
            style={props.style}
        >
            {[...new Array(3)].map(() => (
                <div />
            ))}
        </div>
    );
}
