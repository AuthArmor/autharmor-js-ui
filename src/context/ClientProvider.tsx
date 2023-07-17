import { AuthArmorClient } from "@autharmor/autharmor-js";
import { JSXElement, createMemo } from "solid-js";
import {
    ClientContext,
    InteractiveClientContext,
    InteractiveConfigurationContext
} from "./ClientContext";
import { IAuthArmorInteractiveClientConfiguration } from "../config";
import { AuthArmorInteractiveClient } from "../AuthArmorInteractiveClient";

export interface IClientProviderProps {
    client: AuthArmorClient;
    interactiveConfiguration: IAuthArmorInteractiveClientConfiguration;

    children: JSXElement;
}

export function ClientProvider(props: IClientProviderProps): JSXElement {
    const interactiveClient = createMemo(
        () => new AuthArmorInteractiveClient(props.client, props.interactiveConfiguration)
    );

    return (
        <ClientContext.Provider value={() => props.client}>
            <InteractiveClientContext.Provider value={interactiveClient}>
                <InteractiveConfigurationContext.Provider
                    value={() => props.interactiveConfiguration}
                >
                    {props.children}
                </InteractiveConfigurationContext.Provider>
            </InteractiveClientContext.Provider>
        </ClientContext.Provider>
    );
}
