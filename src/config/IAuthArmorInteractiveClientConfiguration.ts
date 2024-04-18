import {
    AvailableAuthenticationMethods,
    IAuthenticateOptions,
    IAuthenticatorAuthenticateOptions,
    IAuthenticatorUserSpecificAuthenticateOptions,
    IAuthenticatorUsernamelessAuthenticateOptions,
    IMagicLinkEmailAuthenticateOptions,
    IRegisterOptions,
    IAuthenticatorRegisterOptions,
    IPasskeyRegisterOptions,
    IMagicLinkEmailRegisterOptions
} from "@autharmor/autharmor-js";
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
    defaultPasskeyRegisterOptions?: Partial<IPasskeyRegisterOptions>;
    defaultMagicLinkEmailRegisterOptions?: Partial<IMagicLinkEmailRegisterOptions>;

    defaultMagicLinkEmailLogInRedirectUrl?: string;
    defaultMagicLinkEmailRegisterRedirectUrl?: string;

    uiOptions?: IUiOptions;

    internationalizationOptions?: IInternationalizationOptions;

    preferUsernamelessLogIn?: boolean;
}
