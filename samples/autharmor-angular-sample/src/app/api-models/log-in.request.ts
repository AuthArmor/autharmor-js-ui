import { AuthenticationMethod } from "@autharmor/autharmor-js";

export interface LogInRequest {
    requestId: string;
    authenticationMethod: AuthenticationMethod;
    validationToken: string;
}
