import { AuthArmorClient } from "@autharmor/autharmor-js";
import { Accessor, createContext } from "solid-js";
import { IAuthArmorInteractiveClientConfiguration } from "../config";
import { AuthArmorInteractiveClient } from "../AuthArmorInteractiveClient";

export const ClientContext = createContext<Accessor<AuthArmorClient>>();
export const InteractiveClientContext = createContext<Accessor<AuthArmorInteractiveClient>>();
export const InteractiveConfigurationContext =
    createContext<Accessor<IAuthArmorInteractiveClientConfiguration>>();
