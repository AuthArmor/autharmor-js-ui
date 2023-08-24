import { For, JSX } from "solid-js";
import cn from "clsx";
import styles from "./TabControl.module.css";

export type TabControlProps<TTabIdentifier> = {
    tabs: {
        id: TTabIdentifier;
        displayName: string;
    }[];
    activeTabId: TTabIdentifier;

    onTabSelect: (tabId: TTabIdentifier) => void;

    class?: string;
    style?: string | JSX.CSSProperties;
};

export function TabControl<TTabIdentifier>(props: TabControlProps<TTabIdentifier>) {
    return (
        <nav class={cn(styles.tabs, props.class)} style={props.style}>
            <For each={props.tabs}>
                {(tab) => (
                    <button
                        class={styles.tab}
                        classList={{ [styles.activeTab]: props.activeTabId === tab.id }}
                        onClick={() => props.onTabSelect(tab.id)}
                    >
                        {tab.displayName}
                    </button>
                )}
            </For>
        </nav>
    );
}
