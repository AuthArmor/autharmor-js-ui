import { Accessor, useContext } from "solid-js";
import { TranslationTableContext } from "./TranslationTableContext";
import { ITranslationTable } from "../i18n";

export function useTranslationTable(): Accessor<ITranslationTable> {
    const translationTable = useContext(TranslationTableContext);

    if (translationTable === undefined)
        throw new Error("Translation table context is not defined.");

    return translationTable;
}
