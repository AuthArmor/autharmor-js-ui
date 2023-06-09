import { IAuthenticationSuccessResult } from "../../../client";

export class LogInEvent extends Event {
    constructor(public readonly authenticationResult: IAuthenticationSuccessResult) {
        super("logIn");
    }
}
