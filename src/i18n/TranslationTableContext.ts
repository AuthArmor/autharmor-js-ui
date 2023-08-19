import { Accessor, createContext } from "solid-js";
import { ITranslationTable } from "./ITranslationTable";

export const TranslationTableContext = createContext<Accessor<ITranslationTable>>();
