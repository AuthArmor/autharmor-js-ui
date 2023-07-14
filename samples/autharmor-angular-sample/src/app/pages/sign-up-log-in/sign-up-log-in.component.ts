import { CUSTOM_ELEMENTS_SCHEMA, Component, Inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthArmorClient } from "@autharmor/sdk";
import { IAuthArmorInteractiveClientConfiguration, LogInEvent, RegisterEvent } from "@autharmor/ui";
import "@autharmor/ui";
import { SampleBackendService } from "src/app/services/sample-backend.service";
import { TokenStorageService } from "src/app/services/token-storage.service";
import { Router } from "@angular/router";
import { AUTH_ARMOR_INTERACTIVE_CLIENT_CONFIG_TOKEN } from "src/app/providers/provideAuthArmorClients";

@Component({
    selector: "app-sign-up-log-in",
    standalone: true,
    imports: [CommonModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    templateUrl: "./sign-up-log-in.component.html"
})
export class SignUpLogInComponent {
    public constructor(
        public readonly authArmorClient: AuthArmorClient,
        @Inject(AUTH_ARMOR_INTERACTIVE_CLIENT_CONFIG_TOKEN)
        public readonly authArmorInteractiveClientConfig: IAuthArmorInteractiveClientConfiguration,
        private readonly backendService: SampleBackendService,
        private readonly tokenService: TokenStorageService,
        private readonly router: Router
    ) {}

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
