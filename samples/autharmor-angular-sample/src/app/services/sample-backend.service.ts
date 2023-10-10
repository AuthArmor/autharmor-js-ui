import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { GreetingResponse } from "../api-models/greeting.response";
import { LogInRequest } from "../api-models/log-in.request";
import { LogInResponse } from "../api-models/log-in.response";
import { RegisterRequest } from "../api-models/register.request";
import { RegisterResponse } from "../api-models/register.response";
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

    public getGreeting(token?: string): Observable<GreetingResponse> {
        const headers: Record<string, string> = {};

        if (token !== undefined) headers["Authorization"] = `Bearer ${token}`;

        return this.http.get<GreetingResponse>(`${this.apiBaseUrl}/greeting`, { headers });
    }
}
