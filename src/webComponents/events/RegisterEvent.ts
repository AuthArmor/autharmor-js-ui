import { IRegistrationSuccessResult } from "@autharmor/sdk";

export class RegisterEvent extends Event {
    constructor(public readonly registrationResult: IRegistrationSuccessResult) {
        super("register");
    }
}
