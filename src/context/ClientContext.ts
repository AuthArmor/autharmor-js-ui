import { AuthArmorClient } from "autharmor-sdk";
import { createContext } from "solid-js";
import { IAuthArmorInteractiveClientConfiguration } from "../config";
import { AuthArmorInteractiveClient } from "../AuthArmorInteractiveClient";

export const ClientContext = createContext<AuthArmorClient>();
export const InteractiveClientContext = createContext<AuthArmorInteractiveClient>();
export const InteractiveConfigurationContext =
    createContext<IAuthArmorInteractiveClientConfiguration>({});
