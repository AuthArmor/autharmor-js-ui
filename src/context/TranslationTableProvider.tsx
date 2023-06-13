import { Accessor, JSXElement } from "solid-js";
import { TranslationTableContext } from "./TranslationTableContext";
import { ITranslationTable } from "../i18n";

export interface TranslationTableProviderProps {
    translationTable: Accessor<ITranslationTable>;
    children: JSXElement;
}

export function TranslationTableProvider(props: TranslationTableProviderProps) {
    return (
        <TranslationTableContext.Provider value={props.translationTable}>
            {props.children}
        </TranslationTableContext.Provider>
    );
}
