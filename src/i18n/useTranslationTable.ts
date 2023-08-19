import { Accessor, useContext } from "solid-js";
import { ITranslationTable } from "./ITranslationTable";
import { TranslationTableContext } from "./TranslationTableContext";

export function useTranslationTable(): Accessor<ITranslationTable> {
    return useContext(TranslationTableContext)!;
}
