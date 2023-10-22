import {
    AuthArmorClient,
    AuthenticationMethod,
    IAuthenticationFailureResult,
    IAuthenticationSuccessResult,
    IRegistrationFailureResult,
    IRegistrationSuccessResult
} from "@autharmor/autharmor-js";
import { IAuthArmorInteractiveClientConfiguration } from "../config";

export type FormAction = "logIn" | "register";

export type AuthArmorFormProps = {
    client: AuthArmorClient;
    interactiveConfig: IAuthArmorInteractiveClientConfiguration;

    action: FormAction | null;
    username: string | null;
    method: AuthenticationMethod | null;

    defaultAction: FormAction | null;

    enableUsernamelessLogIn: boolean;

    onLogIn: (authenticationResult: IAuthenticationSuccessResult) => void;
    onRegister: (registrationResult: IRegistrationSuccessResult) => void;

    onOutOfBandLogIn: (authenticationResult: IAuthenticationSuccessResult) => void;
    onOutOfBandRegister: (registrationResult: IRegistrationSuccessResult) => void;

    onLogInFailure: (authenticationResult: IAuthenticationFailureResult) => void;
    onRegisterFailure: (registrationResult: IRegistrationFailureResult) => void;

    onError: (error: unknown) => void;
};
