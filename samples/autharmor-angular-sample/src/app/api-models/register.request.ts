import { AuthenticationMethod } from "@autharmor/autharmor-js";

export interface RegisterRequest {
    registrationId: string;
    authenticationMethod: AuthenticationMethod;
    validationToken: string;
}
