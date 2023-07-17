import { InjectionToken, Provider } from "@angular/core";
import { AuthArmorClient } from "@autharmor/autharmor-js";
import { IAuthArmorInteractiveClientConfiguration } from "@autharmor/autharmor-js-ui";
import { environment } from "src/config/environment";

export const AUTH_ARMOR_INTERACTIVE_CLIENT_CONFIG_TOKEN =
    new InjectionToken<IAuthArmorInteractiveClientConfiguration>(
        "AuthArmorInteractiveClientConfig"
    );

export function provideAuthArmorClients(): Provider[] {
    const authArmorClient = new AuthArmorClient({
        clientSdkApiKey: environment.clientSdkApiKey,
        webAuthnClientId: environment.webAuthnClientId
    });

    const authArmorIntractiveClientConfig: IAuthArmorInteractiveClientConfiguration = {
        defaultMagicLinkEmailLogInRedirectUrl: `${environment.frontendBaseUrl}/`,
        defaultMagicLinkEmailRegisterRedirectUrl: `${environment.frontendBaseUrl}/`
    };

    return [
        { provide: AuthArmorClient, useValue: authArmorClient },
        {
            provide: AUTH_ARMOR_INTERACTIVE_CLIENT_CONFIG_TOKEN,
            useValue: authArmorIntractiveClientConfig
        }
    ];
}
