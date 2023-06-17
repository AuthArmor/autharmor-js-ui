// Adapted from https://github.com/n3r4zzurr0/svg-spinners (MIT license)

import styles from "./LoadingSpinner.module.css";

export interface ILoadingSpinnerProps {
    class?: string;
}

export function LoadingSpinner(props: ILoadingSpinnerProps) {
    return (
        <svg
            class={props.class}
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g class={styles.spinner}>
                <circle cx="12" cy="12" r="9.5" fill="none" stroke-width="3"></circle>
            </g>
        </svg>
    );
}
