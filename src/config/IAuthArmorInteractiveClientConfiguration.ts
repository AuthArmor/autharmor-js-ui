import {
    AvailableAuthenticationMethods,
    IAuthenticateOptions,
    IAuthenticatorAuthenticateOptions,
    IAuthenticatorUserSpecificAuthenticateOptions,
    IAuthenticatorUsernamelessAuthenticateOptions,
    IMagicLinkEmailAuthenticateOptions,
    IRegisterOptions,
    IAuthenticatorRegisterOptions,
    IWebAuthnRegisterOptions,
    IMagicLinkEmailRegisterOptions
} from "@autharmor/sdk";
import { IInternationalizationOptions, IUiOptions } from "../options";

export interface IAuthArmorInteractiveClientConfiguration {
    permittedMethods?: Partial<AvailableAuthenticationMethods>;

    defaultAuthenticateOptions?: Partial<IAuthenticateOptions>;
    defaultAuthenticatorAuthenticateOptions?: Partial<IAuthenticatorAuthenticateOptions>;
    defaultAuthenticatorUserSpecificAuthenticateOptions?: Partial<IAuthenticatorUserSpecificAuthenticateOptions>;
    defaultAuthenticatorUsernamelessAuthenticateOptions?: Partial<IAuthenticatorUsernamelessAuthenticateOptions>;
    defaultMagicLinkEmailAuthenticateOptions?: Partial<IMagicLinkEmailAuthenticateOptions>;
    defaultRegisterOptions?: Partial<IRegisterOptions>;
    defaultAuthenticatorRegisterOptions?: Partial<IAuthenticatorRegisterOptions>;
    defaultWebAuthnRegisterOptions?: Partial<IWebAuthnRegisterOptions>;
    defaultMagicLinkEmailRegisterOptions?: Partial<IMagicLinkEmailRegisterOptions>;

    defaultMagicLinkEmailLogInRedirectUrl?: string;
    defaultMagicLinkEmailRegisterRedirectUrl?: string;

    uiOptions?: IUiOptions;

    internationalizationOptions?: IInternationalizationOptions;
}
