import {
    AuthArmorClient,
    IAuthenticationFailureResult,
    IAuthenticationSuccessResult,
    IRegistrationFailureResult,
    IRegistrationSuccessResult
} from "@autharmor/autharmor-js";
import { Show } from "solid-js";
import { customElement, noShadowDOM } from "solid-element";
import { AuthArmorForm, AuthArmorFormProps } from "../form/AuthArmorForm";
import {
    LogInEvent,
    RegisterEvent,
    LogInFailureEvent,
    RegisterFailureEvent,
    ErrorThrownEvent
} from "./events";

export type AuthArmorFormCustomElementProps = Omit<
    AuthArmorFormProps,
    "client" | "onLogIn" | "onRegister" | "onLogInFailure" | "onRegisterFailure" | "onError"
> & { client: AuthArmorFormProps["client"] | null };

if (typeof window !== "undefined") {
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

            const handleLogInFailure = (authenticationResult: IAuthenticationFailureResult) => {
                element.renderRoot.dispatchEvent(new LogInFailureEvent(authenticationResult));
            };

            const handleRegisterFailure = (registrationResult: IRegistrationFailureResult) => {
                element.renderRoot.dispatchEvent(new RegisterFailureEvent(registrationResult));
            };

            const handleError = (error: unknown) => {
                element.renderRoot.dispatchEvent(new ErrorThrownEvent(error));
            };

            return (
                <Show when={props.client instanceof AuthArmorClient}>
                    <AuthArmorForm
                        {...(props as AuthArmorFormCustomElementProps &
                            Pick<AuthArmorFormProps, "client">)}
                        onLogIn={handleLogIn}
                        onRegister={handleRegister}
                        onLogInFailure={handleLogInFailure}
                        onRegisterFailure={handleRegisterFailure}
                        onError={handleError}
                    />
                </Show>
            );
        }
    );
}

declare global {
    interface HTMLElementTagNameMap {
        "autharmor-form": HTMLElement & AuthArmorFormCustomElementProps;
    }
}
