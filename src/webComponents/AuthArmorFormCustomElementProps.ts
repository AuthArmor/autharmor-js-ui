import { AuthArmorFormProps } from "../form/AuthArmorFormProps";

export type AuthArmorFormCustomElementProps = Omit<
    AuthArmorFormProps,
    "client" | AuthArmorFormCustomElementEventName
> & { client: AuthArmorFormProps["client"] | null };

export type AuthArmorFormCustomElementEventName =
    | "onLogIn"
    | "onRegister"
    | "onOutOfBandLogIn"
    | "onOutOfBandRegister"
    | "onLogInFailure"
    | "onRegisterFailure"
    | "onError";

export type AuthArmorFormCustomElementEvents = Pick<
    AuthArmorFormProps,
    AuthArmorFormCustomElementEventName
>;

declare global {
    interface HTMLElementTagNameMap {
        "autharmor-form": HTMLElement & AuthArmorFormCustomElementProps;
    }
}
