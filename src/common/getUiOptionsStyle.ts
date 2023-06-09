import { JSX } from "solid-js";

export function getUiOptionsStyle<T extends string>(
    defaultOptions: { [optionKey in T]?: string },
    providedOptions: { [optionKey in T]?: string } = {}
): JSX.CSSProperties {
    let style: JSX.CSSProperties = {};

    for (const optionKey in defaultOptions) {
        const cssVariableName = optionKey
            .replace(/([a-z])([A-Z])/g, "$1-$2")
            .replace(/([0-9]+)/g, "-$1-")
            .toLowerCase();

        style[`--aa-${cssVariableName}`] = providedOptions[optionKey] ?? defaultOptions[optionKey];
    }

    return style;
}
