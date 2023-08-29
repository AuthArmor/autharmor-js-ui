import { IAuthenticationFailureResult } from "@autharmor/autharmor-js";

export class LogInFailureEvent extends Event {
    constructor(public readonly authenticationResult: IAuthenticationFailureResult) {
        super("logInFailure");
    }
}
