import { IRegistrationSuccessResult } from "@autharmor/autharmor-js";

export class OutOfBandRegisterEvent extends Event {
    constructor(public readonly registrationResult: IRegistrationSuccessResult) {
        super("outOfBandRegister");
    }
}
