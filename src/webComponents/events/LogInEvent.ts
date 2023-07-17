import { IAuthenticationSuccessResult } from "@autharmor/autharmor-js";

export class LogInEvent extends Event {
    constructor(public readonly authenticationResult: IAuthenticationSuccessResult) {
        super("logIn");
    }
}
