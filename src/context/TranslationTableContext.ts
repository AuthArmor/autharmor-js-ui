import { Accessor, createContext } from "solid-js";
import { ITranslationTable } from "../i18n";

export const TranslationTableContext = createContext<Accessor<ITranslationTable>>();
