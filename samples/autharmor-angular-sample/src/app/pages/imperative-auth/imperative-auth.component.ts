import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import {
    ApiError,
    AuthArmorClient,
    AuthenticationResult,
    RegistrationResult
} from "@autharmor/autharmor-js";
import {
    AuthArmorInteractiveClient,
    IAuthArmorInteractiveClientConfiguration
} from "@autharmor/autharmor-js-ui";
import { Subscription, filter, firstValueFrom, map, merge, switchMap } from "rxjs";
import { SampleBackendService } from "src/app/services/sample-backend.service";
import { ActivatedRoute } from "@angular/router";
import { LogInRequest } from "src/app/api-models/log-in.request";
import { RegisterWithMagicLinkRequest } from "src/app/api-models/register-with-magic-link.request";
import { AUTH_ARMOR_INTERACTIVE_CLIENT_CONFIG_TOKEN } from "src/app/providers/provideAuthArmorClients";
import { environment } from "src/config/environment";

@Component({
    selector: "app-imperative-auth",
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: "./imperative-auth.component.html"
})
export class ImperativeAuthComponent implements OnInit, OnDestroy {
    public error: string | null = null;
    public serverMessage: string | null = null;

    private readonly authArmorInteractiveClient: AuthArmorInteractiveClient;

    private magicLinkLogInRequestTokens$ = this.activatedRoute.queryParamMap.pipe(
        filter((p) => p.has("auth_request_id") && p.has("auth_validation_token")),
        map(
            (p) =>
                ({
                    requestId: p.get("auth_request_id")!,
                    authenticationMethod: "magicLinkEmail",
                    validationToken: p.get("auth_validation_token")!
                } satisfies LogInRequest)
        ),
        switchMap((r) => this.backendService.logIn(r)),
        map((r) => r.token)
    );
    private magicLinkRegisterRequestTokens$ = this.activatedRoute.queryParamMap.pipe(
        filter((p) => p.has("registration_validation_token")),
        map(
            (p) =>
                ({
                    validationToken: p.get("registration_validation_token")!
                } satisfies RegisterWithMagicLinkRequest)
        ),
        switchMap((r) => this.backendService.registerWithMagicLink(r)),
        map((r) => r.token)
    );
    private magicLinkTokens$ = merge(
        this.magicLinkLogInRequestTokens$,
        this.magicLinkRegisterRequestTokens$
    );

    private magicLinkTokenSubscription?: Subscription;

    public constructor(
        authArmorClient: AuthArmorClient,
        @Inject(AUTH_ARMOR_INTERACTIVE_CLIENT_CONFIG_TOKEN)
        authArmorInteractiveClientConfig: IAuthArmorInteractiveClientConfiguration,
        private readonly backendService: SampleBackendService,
        private readonly activatedRoute: ActivatedRoute
    ) {
        this.authArmorInteractiveClient = new AuthArmorInteractiveClient(authArmorClient, {
            ...authArmorInteractiveClientConfig,
            defaultMagicLinkEmailLogInRedirectUrl: `${environment.frontendBaseUrl}/imperative-auth`,
            defaultMagicLinkEmailRegisterRedirectUrl: `${environment.frontendBaseUrl}/imperative-auth`
        });
    }

    public ngOnInit(): void {
        this.magicLinkTokenSubscription = this.magicLinkTokens$.subscribe(async (t) => {
            const { message } = await firstValueFrom(this.backendService.getGreeting(t));
            this.serverMessage = message;
        });
    }

    public ngOnDestroy(): void {
        this.magicLinkTokenSubscription?.unsubscribe();
    }

    public async authenticate(username: string) {
        let authenticationResult: AuthenticationResult | null;

        try {
            authenticationResult = await this.authArmorInteractiveClient.authenticateAsync(
                username
            );
        } catch (error) {
            if (error instanceof ApiError) {
                this.error = error.message;
                return;
            } else {
                this.error = "An unexpected error occurred. Please check the console.";
                throw error;
            }
        }

        if (authenticationResult === null || !authenticationResult.succeeded) {
            return;
        }

        const { token } = await firstValueFrom(this.backendService.logIn(authenticationResult));
        const { message } = await firstValueFrom(this.backendService.getGreeting(token));

        this.serverMessage = message;
    }

    public async register(username: string) {
        let registrationResult: RegistrationResult | null;

        try {
            registrationResult = await this.authArmorInteractiveClient.registerAsync(username);
        } catch (error) {
            if (error instanceof ApiError) {
                this.error = error.message;
                return;
            } else {
                this.error = "An unexpected error occurred. Please check the console.";
                throw error;
            }
        }

        if (registrationResult === null || !registrationResult.succeeded) {
            return;
        }

        const { token } = await firstValueFrom(this.backendService.register(registrationResult));
        const { message } = await firstValueFrom(this.backendService.getGreeting(token));

        this.serverMessage = message;
    }
}
