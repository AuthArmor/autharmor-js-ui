import { CUSTOM_ELEMENTS_SCHEMA, Component, Inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthArmorClient, AvailableAuthenticationMethods } from "@autharmor/autharmor-js";
import {
    IAuthArmorInteractiveClientConfiguration,
    LogInEvent,
    RegisterEvent
} from "@autharmor/autharmor-js-ui";
import "@autharmor/autharmor-js-ui";
import { SampleBackendService } from "src/app/services/sample-backend.service";
import { TokenStorageService } from "src/app/services/token-storage.service";
import { Router } from "@angular/router";
import { AUTH_ARMOR_INTERACTIVE_CLIENT_CONFIG_TOKEN } from "src/app/providers/provideAuthArmorClients";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";

@Component({
    selector: "app-sign-up-log-in",
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    templateUrl: "./sign-up-log-in.component.html"
})
export class SignUpLogInComponent {
    public constructor(
        public readonly authArmorClient: AuthArmorClient,
        @Inject(AUTH_ARMOR_INTERACTIVE_CLIENT_CONFIG_TOKEN)
        private readonly baseAuthArmorInteractiveClientConfig: IAuthArmorInteractiveClientConfiguration,
        private readonly backendService: SampleBackendService,
        private readonly tokenService: TokenStorageService,
        private readonly router: Router
    ) {}

    public authArmorInteractiveClientConfig: IAuthArmorInteractiveClientConfiguration = {
        ...this.baseAuthArmorInteractiveClientConfig,
        permittedMethods: {
            authenticator: true,
            magicLinkEmail: true,
            webAuthn: true
        }
    };

    public allowLogIn: boolean = true;
    public allowRegister: boolean = true;
    public allowUsernamelessAuth: boolean = true;

    public preferencesForm = new FormGroup({
        allowedActions: new FormGroup({
            logIn: new FormControl(true),
            register: new FormControl(true)
        }),
        allowedMethods: new FormGroup({
            authenticator: new FormControl(true),
            magicLinkEmail: new FormControl(true),
            webAuthn: new FormControl(true)
        }),
        miscellaneous: new FormGroup({
            usernamelessAuth: new FormControl(true)
        })
    });

    public applyPreferences() {
        const preferences = this.preferencesForm.getRawValue();

        this.allowLogIn = preferences.allowedActions.logIn ?? true;
        this.allowRegister = preferences.allowedActions.register ?? true;
        this.authArmorInteractiveClientConfig.permittedMethods =
            preferences.allowedMethods as AvailableAuthenticationMethods;
        this.allowUsernamelessAuth = preferences.miscellaneous.usernamelessAuth ?? true;
    }

    public onLogIn({ authenticationResult }: LogInEvent) {
        this.backendService
            .logIn(authenticationResult)
            .subscribe(({ token }) => this.handleTokenResponse(token));
    }

    public onRegister({ registrationResult }: RegisterEvent) {
        this.backendService
            .register(registrationResult)
            .subscribe(({ token }) => this.handleTokenResponse(token));
    }

    private handleTokenResponse(token: string) {
        this.tokenService.saveToken(token);
        this.router.navigate(["/"]);
    }
}
