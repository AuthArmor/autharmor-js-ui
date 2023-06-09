// Adapted from https://github.com/n3r4zzurr0/svg-spinners (MIT license)
import styles from "./PendingPulser.module.css";

export interface IPendingPulserProps {
    class?: string;
}

export function PendingPulser(props: IPendingPulserProps) {
    return (
        <svg
            class={props.class}
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle class={styles.pulser} cx="12" cy="12" r="0" />
        </svg>
    );
}
