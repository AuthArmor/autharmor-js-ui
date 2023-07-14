import { AuthenticationMethod } from "@autharmor/sdk";

export interface LogInRequest {
    requestId: string;
    authenticationMethod: AuthenticationMethod;
    validationToken: string;
}
