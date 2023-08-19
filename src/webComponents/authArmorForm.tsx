import {
    AuthArmorClient,
    IAuthenticationSuccessResult,
    IRegistrationSuccessResult
} from "@autharmor/autharmor-js";
import { Show } from "solid-js";
import { customElement, noShadowDOM } from "solid-element";
import { LogInEvent } from "./events/LogInEvent";
import { RegisterEvent } from "./events/RegisterEvent";
import { AuthArmorForm, AuthArmorFormProps } from "../form/AuthArmorForm";

export type AuthArmorFormCustomElementProps = Omit<
    AuthArmorFormProps,
    "client" | "onLogIn" | "onRegister"
> & { client: AuthArmorFormProps["client"] | null };

customElement(
    "autharmor-form",
    {
        client: null,
        interactiveConfig: {},
        action: null,
        username: null,
        method: null,
        defaultAction: null,
        enableUsernamelessLogIn: true
    } satisfies AuthArmorFormCustomElementProps as AuthArmorFormCustomElementProps,
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
                <AuthArmorForm
                    {...(props as AuthArmorFormCustomElementProps &
                        Pick<AuthArmorFormProps, "client">)}
                    onLogIn={handleLogIn}
                    onRegister={handleRegister}
                />
            </Show>
        );
    }
);

declare global {
    interface HTMLElementTagNameMap {
        "autharmor-form": HTMLElement & AuthArmorFormCustomElementProps;
    }
}
