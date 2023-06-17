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
    defaultEmailMagicLinkAuthenticateOptions?: Partial<IMagicLinkEmailAuthenticateOptions>;
    defaultRegisterOptions?: Partial<IRegisterOptions>;
    defaultAuthenticatorRegisterOptions?: Partial<IAuthenticatorRegisterOptions>;
    defaultWebAuthnRegisterOptions?: Partial<IWebAuthnRegisterOptions>;
    defaultEmailMagicLinkRegisterOptions?: Partial<IMagicLinkEmailRegisterOptions>;

    defaultEmailMagicLinkLogInRedirectUrl?: string;
    defaultEmailMagicLinkRegisterRedirectUrl?: string;

    uiOptions?: IUiOptions;

    internationalizationOptions?: IInternationalizationOptions;
}
