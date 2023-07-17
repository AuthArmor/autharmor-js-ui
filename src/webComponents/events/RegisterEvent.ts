import { IRegistrationSuccessResult } from "@autharmor/autharmor-js";

export class RegisterEvent extends Event {
    constructor(public readonly registrationResult: IRegistrationSuccessResult) {
        super("register");
    }
}
