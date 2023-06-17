import { AuthArmorClient } from "@autharmor/sdk";
import { Accessor, useContext } from "solid-js";
import {
    ClientContext,
    InteractiveClientContext,
    InteractiveConfigurationContext
} from "./ClientContext";
import { AuthArmorInteractiveClient } from "../AuthArmorInteractiveClient";
import { IAuthArmorInteractiveClientConfiguration } from "../config";

export function useClient(): [
    {
        client: Accessor<AuthArmorClient>;
        interactiveClient: Accessor<AuthArmorInteractiveClient>;
        interactiveConfiguration: Accessor<IAuthArmorInteractiveClientConfiguration>;
    }
] {
    const client = useContext(ClientContext);
    const interactiveClient = useContext(InteractiveClientContext);
    const interactiveConfiguration = useContext(InteractiveConfigurationContext);

    if (
        client === undefined ||
        interactiveClient === undefined ||
        interactiveConfiguration === undefined
    ) {
        throw new Error("Client context is not defined.");
    }

    return [{ client, interactiveClient, interactiveConfiguration }];
}
