import { JSX } from "solid-js";
import cn from "clsx";
import styles from "./AppLinkLoader.module.css";

export type AppLinkLoaderProps = {
    isActive: boolean;

    class?: string;
    style?: string | JSX.CSSProperties;
};

export function AppLinkLoader(props: AppLinkLoaderProps) {
    return (
        <div
            class={cn(
                styles.appLinkLoader,
                { [styles.activeAppLinkLoadaer]: props.isActive },
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
