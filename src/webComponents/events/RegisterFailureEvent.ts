import { IRegistrationFailureResult } from "@autharmor/autharmor-js";

export class RegisterFailureEvent extends Event {
    constructor(public readonly registrationResult: IRegistrationFailureResult) {
        super("registerFailure");
    }
}
