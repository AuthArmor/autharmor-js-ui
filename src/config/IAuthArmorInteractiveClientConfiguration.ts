import {
    AvailableAuthenticationMethods,
    ILogInOptions,
    IAuthenticatorLogInOptions,
    IAuthenticatorUserSpecificLogInOptions,
    IAuthenticatorUsernamelessLogInOptions,
    IMagicLinkEmailLogInOptions,
    IRegisterOptions,
    IAuthenticatorRegisterOptions,
    IWebAuthnRegisterOptions,
    IMagicLinkEmailRegisterOptions
} from "@autharmor/sdk";
import { IInternationalizationOptions, IUiOptions } from "../options";

export interface IAuthArmorInteractiveClientConfiguration {
    permittedMethods?: Partial<AvailableAuthenticationMethods>;

    defaultLogInOptions?: Partial<ILogInOptions>;
    defaultAuthenticatorLogInOptions?: Partial<IAuthenticatorLogInOptions>;
    defaultAuthenticatorUserSpecificLogInOptions?: Partial<IAuthenticatorUserSpecificLogInOptions>;
    defaultAuthenticatorUsernamelessLogInOptions?: Partial<IAuthenticatorUsernamelessLogInOptions>;
    defaultEmailMagicLinkLogInOptions?: Partial<IMagicLinkEmailLogInOptions>;
    defaultRegisterOptions?: Partial<IRegisterOptions>;
    defaultAuthenticatorRegisterOptions?: Partial<IAuthenticatorRegisterOptions>;
    defaultWebAuthnRegisterOptions?: Partial<IWebAuthnRegisterOptions>;
    defaultEmailMagicLinkRegisterOptions?: Partial<IMagicLinkEmailRegisterOptions>;

    defaultEmailMagicLinkLogInRedirectUrl?: string;
    defaultEmailMagicLinkRegisterRedirectUrl?: string;

    uiOptions?: IUiOptions;

    internationalizationOptions?: IInternationalizationOptions;
}
