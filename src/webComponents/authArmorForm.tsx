import {
    AuthArmorClient,
    IAuthenticationSuccessResult,
    IRegistrationSuccessResult
} from "autharmor-sdk";
import { ComponentType, customElement, noShadowDOM } from "solid-element";
import { LogInEvent } from "./events/LogInEvent";
import { RegisterEvent } from "./events/RegisterEvent";
import { AuthenticationForm, AuthenticationMode } from "../AuthenticationForm";
import { Show } from "solid-js";
import { IAuthArmorInteractiveClientConfiguration } from "../config";

export interface IAuthArmorFormCustomElementProps {
    client: AuthArmorClient | null;
    interactiveConfig: IAuthArmorInteractiveClientConfiguration;
    enableLogIn: boolean;
    enableRegistration: boolean;
    initialMode: AuthenticationMode;
    enableUsernameless: boolean;
}

customElement(
    "autharmor-form",
    {
        client: null,
        interactiveConfig: {},
        enableLogIn: true,
        enableRegistration: true,
        initialMode: "logIn",
        enableUsernameless: true
    } as IAuthArmorFormCustomElementProps,
    (props, { element }) => {
        noShadowDOM();

        const handleLogIn = (authenticationResult: IAuthenticationSuccessResult) => {
            element.renderRoot.dispatchEvent(new LogInEvent(authenticationResult));
        };

        const handleRegister = (registrationResult: IRegistrationSuccessResult) => {
            element.renderRoot.dispatchEvent(new RegisterEvent(registrationResult));
        };

        return (
            <Show when={props.client instanceof AuthArmorClient}>
                <AuthenticationForm
                    client={props.client!}
                    interactiveConfig={props.interactiveConfig}
                    enableLogIn={props.enableLogIn}
                    enableRegistration={props.enableRegistration}
                    initialMode={props.initialMode}
                    enableUsernameless={props.enableUsernameless}
                    onLogIn={handleLogIn}
                    onRegister={handleRegister}
                />
            </Show>
        );
    }
);

declare global {
    interface HTMLElementTagNameMap {
        "autharmor-form": ComponentType<IAuthArmorFormCustomElementProps>;
    }
}
