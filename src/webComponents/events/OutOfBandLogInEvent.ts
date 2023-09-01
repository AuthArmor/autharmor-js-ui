import { IAuthenticationSuccessResult } from "@autharmor/autharmor-js";

export class OutOfBandLogInEvent extends Event {
    constructor(public readonly authenticationResult: IAuthenticationSuccessResult) {
        super("outOfBandLogIn");
    }
}
