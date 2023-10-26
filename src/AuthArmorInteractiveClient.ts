import {
    AuthArmorClient,
    IAuthenticatorUserSpecificAuthenticateOptions,
    IMagicLinkEmailAuthenticateOptions,
    IAuthenticatorRegisterOptions,
    IPasskeyRegisterOptions,
    IMagicLinkEmailRegisterOptions,
    IAuthenticateOptions,
    IRegisterOptions,
    AuthenticationResult,
    RegistrationResult
} from "@autharmor/autharmor-js";
import { IAuthArmorInteractiveClientConfiguration } from "./config";
import { ITranslationTable, defaultTranslationTable } from "./i18n";
import { ErrorThrownEvent } from "./webComponents";
import { AuthArmorFormCustomElementProps } from "./webComponents/AuthArmorFormCustomElementProps";

/**
 * The client for interacting with AuthArmor's client-side SDK providing a user-facing interface.
 */
export class AuthArmorInteractiveClient {
    /**
     * The translation table to use for strings displayed to the user.
     */
    protected readonly tt: ITranslationTable;

    /**
     * @param client The AuthArmorClient for interacting with AuthArmor's client-side SDK.
     * @param configuration The configuration for the interactive client.
     */
    public constructor(
        private readonly client: AuthArmorClient,
        private readonly configuration: IAuthArmorInteractiveClientConfiguration = {},
        private readonly renderTarget: HTMLElement | null = null
    ) {
        this.tt =
            this.configuration.internationalizationOptions?.translationTable ??
            defaultTranslationTable;
    }

    /**
     * Authenticates a user.
     *
     * @param username The username of the user.
     * @param options The options to use for this request.
     * @param abortSignal The abort signal to use for this request.
     *
     * @returns A promise that resolves with the authentication result.
     */
    public async authenticateAsync(
        username: string,
        options: Partial<IAuthenticateOptions> = {},
        abortSignal?: AbortSignal
    ): Promise<AuthenticationResult> {
        return (await this.evaluateFormAsync(
            {
                action: "logIn",
                username,
                method: null,
                defaultAction: "logIn",
                enableUsernamelessLogIn: false
            },
            {
                defaultAuthenticateOptions: {
                    ...this.configuration.defaultAuthenticateOptions,
                    ...options
                },
                defaultAuthenticatorUserSpecificAuthenticateOptions: {
                    ...this.configuration.defaultAuthenticatorUserSpecificAuthenticateOptions,
                    ...options
                },
                defaultMagicLinkEmailAuthenticateOptions: {
                    ...this.configuration.defaultMagicLinkEmailAuthenticateOptions,
                    ...options
                }
            },
            abortSignal
        )) as AuthenticationResult;
    }

    /**
     * Authenticates a user using their authenticator app.
     *
     * @param username The username of the user.
     * @param options The options to use for this request.
     * @param abortSignal The abort signal to use for this request.
     *
     * @returns A promise that resolves with the authentication result.
     */
    public async authenticateWithAuthenticatorAsync(
        username: string,
        options: Partial<IAuthenticatorUserSpecificAuthenticateOptions> = {},
        abortSignal?: AbortSignal
    ): Promise<AuthenticationResult> {
        return (await this.evaluateFormAsync(
            {
                action: "logIn",
                username,
                method: "authenticator",
                defaultAction: "logIn",
                enableUsernamelessLogIn: false
            },
            {
                defaultAuthenticatorUserSpecificAuthenticateOptions: {
                    ...this.configuration.defaultAuthenticatorUserSpecificAuthenticateOptions,
                    ...options
                }
            },
            abortSignal
        )) as AuthenticationResult;
    }

    /**
     * Authenticates a user using a passkey.
     *
     * @param username The username of the user.
     * @param options The options to use for this request.
     * @param abortSignal The abort signal to use for this request.
     *
     * @returns A promise that resolves with the authentication result.
     */
    public async authenticateWithPasskeyAsync(
        username: string,
        options: Partial<IAuthenticateOptions>,
        abortSignal?: AbortSignal
    ): Promise<AuthenticationResult> {
        return (await this.evaluateFormAsync(
            {
                action: "logIn",
                username,
                method: "passkey",
                defaultAction: "logIn",
                enableUsernamelessLogIn: false
            },
            {
                defaultAuthenticateOptions: {
                    ...this.configuration.defaultAuthenticateOptions,
                    ...options
                }
            },
            abortSignal
        )) as AuthenticationResult;
    }

    /**
     * Authenticates a user using an email magic link.
     *
     * @param username The username of the user.
     * @param redirectUrl
     * The URL that's sent to the user's email. If this is blank, the default one configured for
     * this interactive client will be used.
     * @param options The options to use for this request.
     * @param abortSignal The abort signal to use for this request.
     *
     * @returns
     * A promise that resolves with the authentication result.
     *
     * @remarks
     * The user will be redirected to the specified URL after they have logged in. The validation
     * token and request ID will be added as query parameters with the names
     * `auth_validation_token` and `auth_request_id` respectively.
     *
     * The validation token will not be included in the returned `AuthenticationResult`.
     */
    public async authenticateWithMagicLinkEmailAsync(
        username: string,
        redirectUrl?: string,
        options: Partial<IMagicLinkEmailAuthenticateOptions> = {},
        abortSignal?: AbortSignal
    ): Promise<AuthenticationResult> {
        return (await this.evaluateFormAsync(
            {
                action: "logIn",
                username,
                method: "magicLinkEmail",
                defaultAction: "logIn",
                enableUsernamelessLogIn: false
            },
            {
                defaultMagicLinkEmailAuthenticateOptions: {
                    ...this.configuration.defaultMagicLinkEmailAuthenticateOptions,
                    ...options
                },
                defaultMagicLinkEmailLogInRedirectUrl:
                    redirectUrl ?? this.configuration.defaultMagicLinkEmailLogInRedirectUrl
            },
            abortSignal
        )) as AuthenticationResult;
    }

    /**
     * Registers a user.
     *
     * @param username The username of the user.
     * @param options The options to use for this request.
     * @param abortSignal The abort signal to use for this request.
     *
     * @returns A promise that resolves with the registration result.
     */
    public async registerAsync(
        username: string,
        options: Partial<IRegisterOptions> = {},
        abortSignal?: AbortSignal
    ): Promise<RegistrationResult> {
        return (await this.evaluateFormAsync(
            {
                action: "register",
                username,
                method: null,
                defaultAction: "register",
                enableUsernamelessLogIn: false
            },
            {
                defaultAuthenticateOptions: {
                    ...this.configuration.defaultRegisterOptions,
                    ...options
                },
                defaultAuthenticatorRegisterOptions: {
                    ...this.configuration.defaultAuthenticatorRegisterOptions,
                    ...options
                },
                defaultPasskeyRegisterOptions: {
                    ...this.configuration.defaultPasskeyRegisterOptions,
                    ...options
                },
                defaultMagicLinkEmailRegisterOptions: {
                    ...this.configuration.defaultMagicLinkEmailRegisterOptions,
                    ...options
                }
            },
            abortSignal
        )) as RegistrationResult;
    }

    /**
     * Registers a user using their authenticator app.
     *
     * @param username The username of the user.
     * @param options The options to use for this request.
     * @param abortSignal The abort signal to use for this request.
     *
     * @returns A promise that resolves with the registration result.
     */
    public async registerWithAuthenticatorAsync(
        username: string,
        options: Partial<IAuthenticatorRegisterOptions> = {},
        abortSignal?: AbortSignal
    ): Promise<RegistrationResult> {
        return (await this.evaluateFormAsync(
            {
                action: "register",
                username,
                method: "authenticator",
                defaultAction: "register",
                enableUsernamelessLogIn: false
            },
            {
                defaultAuthenticatorRegisterOptions: {
                    ...this.configuration.defaultAuthenticatorRegisterOptions,
                    ...options
                }
            },
            abortSignal
        )) as RegistrationResult;
    }

    /**
     * Registers a user using a passkey.
     *
     * @param username The username of the user.
     * @param options The options to use for this request.
     * @param abortSignal The abort signal to use for this request.
     *
     * @returns A promise that resolves with the registration result.
     */
    public async registerWithPasskeyAsync(
        username: string,
        options: Partial<IPasskeyRegisterOptions>,
        abortSignal?: AbortSignal
    ): Promise<RegistrationResult> {
        return (await this.evaluateFormAsync(
            {
                action: "register",
                username,
                method: "passkey",
                defaultAction: "register",
                enableUsernamelessLogIn: false
            },
            {
                defaultPasskeyRegisterOptions: {
                    ...this.configuration.defaultPasskeyRegisterOptions,
                    ...options
                }
            },
            abortSignal
        )) as RegistrationResult;
    }

    /**
     * Registers a user using an email magic link.
     *
     * @param username The username of the user.
     * @param redirectUrl
     *  The URL that's sent to the user's email. If this is blank, the default one configured for
     *  this interactive client will be used.
     * @param options The options to use for this request.
     * @param abortSignal The abort signal to use for this request.
     *
     * @returns
     * A promise that resolves with the authentication result.
     *
     * @remarks
     * The user will be redirected to the specified URL after they have registered. The validation
     * token and registration ID will be added as query parameters with the names
     * `registration_validation_token` and `registration_id` respectively.
     *
     * The validation token will not be included in the returned `RegistrationResult`.
     */
    public async registerWithMagicLinkEmailAsync(
        username: string,
        redirectUrl?: string,
        options: Partial<IMagicLinkEmailRegisterOptions> = {},
        abortSignal?: AbortSignal
    ): Promise<RegistrationResult> {
        return (await this.evaluateFormAsync(
            {
                action: "register",
                username,
                method: "magicLinkEmail",
                defaultAction: "register",
                enableUsernamelessLogIn: false
            },
            {
                defaultMagicLinkEmailRegisterOptions: {
                    ...this.configuration.defaultMagicLinkEmailRegisterOptions,
                    ...options
                },
                defaultMagicLinkEmailRegisterRedirectUrl:
                    redirectUrl ?? this.configuration.defaultMagicLinkEmailRegisterRedirectUrl
            },
            abortSignal
        )) as RegistrationResult;
    }

    /**
     * Renders the given code into this interactive client's render target.
     *
     * @param code The code to render.
     *
     * @returns A function to clean up and destroy the rendered root.
     *
     * @remarks
     * If this interactive client does not have an explicitly specified render target, a new render
     * target is created that functions as a modal.
     */
    protected render(element: HTMLElement): () => void {
        if (this.renderTarget !== null) {
            this.renderTarget.appendChild(element);
        }

        const backdrop = document.createElement("div");

        backdrop.style.position = "fixed";
        backdrop.style.inset = "0";
        backdrop.style.display = "flex";
        backdrop.style.alignItems = "center";
        backdrop.style.justifyContent = "center";
        backdrop.style.padding = "1rem";
        backdrop.style.backgroundColor = "hsl(0deg 0% 0% / 50%)";
        backdrop.style.backdropFilter = "blur(0.125rem)";
        backdrop.style.zIndex = "999";

        const dialogContainer = document.createElement("div");

        dialogContainer.style.boxSizing = "border-box";
        dialogContainer.style.overflowY = "auto";
        dialogContainer.style.borderRadius = "0.5rem";
        dialogContainer.style.padding = "2rem";
        dialogContainer.style.width = "min(32rem, 95vw)";
        dialogContainer.style.height = "min(32rem, 95vh)";
        dialogContainer.style.backgroundColor = "hsl(0deg 0% 100%)";

        dialogContainer.appendChild(element);

        backdrop.appendChild(dialogContainer);
        
        document.body.appendChild(backdrop);

        const cleanup = () => document.body.removeChild(backdrop);

        return cleanup;
    }

    /**
     * Evaluates the result of an Auth Armor form.
     *
     * @param props The props to pass to the form.
     * @param abortSignal The abort signal to use for this request.
     *
     * @returns A promise that resolves with the authentication or registration result.
     */
    protected evaluateFormAsync(
        props: Omit<AuthArmorFormCustomElementProps, "client" | "interactiveConfig">,
        configurationOverride: Partial<IAuthArmorInteractiveClientConfiguration> = {},
        abortSignal?: AbortSignal
    ): Promise<AuthenticationResult | RegistrationResult> {
        return new Promise((resolve, reject) => {
            const handleAuthenticationResult = (event: {
                authenticationResult: AuthenticationResult;
            }) => {
                cleanup();
                resolve(event.authenticationResult);
            };

            const handleRegistrationResult = (event: {
                registrationResult: RegistrationResult;
            }) => {
                cleanup();
                resolve(event.registrationResult);
            };

            const handleError = (event: ErrorThrownEvent) => {
                cleanup();
                reject(event.error);
            };

            const formElement = document.createElement("autharmor-form");

            formElement.client = this.client;
            formElement.interactiveConfig = { ...this.configuration, ...configurationOverride };

            Object.assign(formElement, props);

            formElement.addEventListener("logIn" as any, handleAuthenticationResult);
            formElement.addEventListener("register" as any, handleRegistrationResult);
            formElement.addEventListener("outOfBandLogIn" as any, handleAuthenticationResult);
            formElement.addEventListener("outOfBandRegister" as any, handleRegistrationResult);
            formElement.addEventListener("logInFailure" as any, handleAuthenticationResult);
            formElement.addEventListener("registerFailure" as any, handleRegistrationResult);
            formElement.addEventListener("error" as any, handleError);

            const cleanup = this.render(formElement);

            abortSignal?.addEventListener("abort", (reason) => {
                cleanup();
                reject(reason);
            });
        });
    }
}
