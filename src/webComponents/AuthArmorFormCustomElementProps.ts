import { AuthArmorFormProps } from "../form/AuthArmorFormProps";

export type AuthArmorFormCustomElementProps = Omit<
    AuthArmorFormProps,
    | "client"
    | "onLogIn"
    | "onRegister"
    | "onOutOfBandLogIn"
    | "onOutOfBandRegister"
    | "onLogInFailure"
    | "onRegisterFailure"
    | "onError"
> & { client: AuthArmorFormProps["client"] | null };

declare global {
    interface HTMLElementTagNameMap {
        "autharmor-form": HTMLElement & AuthArmorFormCustomElementProps;
    }
}
