import {
    IAvailableAuthenticationMethods,
    ILogInOptions,
    IAuthenticatorLogInOptions,
    IAuthenticatorUserSpecificLogInOptions,
    IAuthenticatorUsernamelessLogInOptions,
    IEmailMagicLinkLogInOptions,
    IRegisterOptions,
    IAuthenticatorRegisterOptions,
    IWebAuthnRegisterOptions,
    IEmailMagicLinkRegisterOptions
} from "autharmor-sdk";
import { IUiOptions } from "../options";
import { IInternationalizationOptions } from "../options/IInternationalizationOptions";

export interface IAuthArmorInteractiveClientConfiguration {
    permittedMethods?: Partial<IAvailableAuthenticationMethods>;

    defaultLogInOptions?: Partial<ILogInOptions>;
    defaultAuthenticatorLogInOptions?: Partial<IAuthenticatorLogInOptions>;
    defaultAuthenticatorUserSpecificLogInOptions?: Partial<IAuthenticatorUserSpecificLogInOptions>;
    defaultAuthenticatorUsernamelessLogInOptions?: Partial<IAuthenticatorUsernamelessLogInOptions>;
    defaultEmailMagicLinkLogInOptions?: Partial<IEmailMagicLinkLogInOptions>;
    defaultRegisterOptions?: Partial<IRegisterOptions>;
    defaultAuthenticatorRegisterOptions?: Partial<IAuthenticatorRegisterOptions>;
    defaultWebAuthnRegisterOptions?: Partial<IWebAuthnRegisterOptions>;
    defaultEmailMagicLinkRegisterOptions?: Partial<IEmailMagicLinkRegisterOptions>;

    emailMagicLinkRedirectUrl?: string;

    uiOptions?: IUiOptions;

    internationalizationOptions?: IInternationalizationOptions;
}
