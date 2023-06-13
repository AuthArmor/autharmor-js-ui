import { IAuthenticationSuccessResult } from "@autharmor/sdk";

export class LogInEvent extends Event {
    constructor(public readonly authenticationResult: IAuthenticationSuccessResult) {
        super("logIn");
    }
}
