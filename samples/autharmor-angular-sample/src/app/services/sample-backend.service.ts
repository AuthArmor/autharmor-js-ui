import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, map } from "rxjs";
import { GreetingResponse } from "../api-models/greeting.response";
import { LogInRequest } from "../api-models/log-in.request";
import { LogInResponse } from "../api-models/log-in.response";
import { RegisterRequest } from "../api-models/register.request";
import { RegisterResponse } from "../api-models/register.response";
import { RegisterWithMagicLinkRequest } from "../api-models/register-with-magic-link.request";
import { environment } from "src/config/environment";

@Injectable({
    providedIn: "root"
})
export class SampleBackendService {
    private readonly apiBaseUrl: string = environment.backendBaseUrl;

    public constructor(private readonly http: HttpClient) {}

    public logIn(request: LogInRequest): Observable<LogInResponse> {
        return this.http.post<LogInResponse>(`${this.apiBaseUrl}/auth/login`, request);
    }

    public register(request: RegisterRequest): Observable<RegisterResponse> {
        return this.http.post<RegisterResponse>(`${this.apiBaseUrl}/auth/register`, request);
    }

    public registerWithMagicLink(
        request: RegisterWithMagicLinkRequest
    ): Observable<RegisterResponse> {
        return this.http.post<RegisterResponse>(
            `${this.apiBaseUrl}/auth/register-magic-link`,
            request
        );
    }

    public getGreeting(token?: string): Observable<GreetingResponse> {
        const headers: Record<string, string> = {};

        if (token !== undefined) headers["Authorization"] = `Bearer ${token}`;

        return this.http.get<GreetingResponse>(`${this.apiBaseUrl}/greeting`, { headers });
    }
}
