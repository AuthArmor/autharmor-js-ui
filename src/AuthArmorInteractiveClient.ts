import {
    AuthArmorClient,
    IAuthenticatorUserSpecificAuthenticateOptions,
    IMagicLinkEmailAuthenticateOptions,
    IAuthenticatorRegisterOptions,
    IWebAuthnRegisterOptions,
    IMagicLinkEmailRegisterOptions,
    IAuthenticateOptions,
    IRegisterOptions,
    AuthenticationResult,
    RegistrationResult
} from "@autharmor/autharmor-js";
import { JSXElement } from "solid-js";
import { render } from "solid-js/web";
import { IAuthArmorInteractiveClientConfiguration } from "./config";
import { ITranslationTable, defaultTranslationTable } from "./i18n";
import { ModalContainer } from "./ui/ModalContainer";
import { AuthArmorForm, AuthArmorFormProps } from "./form/AuthArmorForm";

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
     * Authenticates a user using WebAuthn.
     *
     * @param username The username of the user.
     * @param options The options to use for this request.
     * @param abortSignal The abort signal to use for this request.
     *
     * @returns A promise that resolves with the authentication result.
     */
    public async authenticateWithWebAuthnAsync(
        username: string,
        options: Partial<IAuthenticateOptions>,
        abortSignal?: AbortSignal
    ): Promise<AuthenticationResult> {
        return (await this.evaluateFormAsync(
            {
                action: "logIn",
                username,
                method: "webAuthn",
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
     * A promise that resolves with the authentication result. The promise will not resolve in the
     * case of successful authentication.
     *
     * @remarks
     * The user will be redirected to the specified URL after they have logged in. The validation
     * token and request ID will be added as query parameters with the names
     * `auth_validation_token` and `auth_request_id` respectively.
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
                defaultWebAuthnRegisterOptions: {
                    ...this.configuration.defaultWebAuthnRegisterOptions,
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
     * Authenticates a user using WebAuthn.
     *
     * @param username The username of the user.
     * @param options The options to use for this request.
     * @param abortSignal The abort signal to use for this request.
     *
     * @returns A promise that resolves with the registration result.
     */
    public async registerWithWebAuthnAsync(
        username: string,
        options: Partial<IWebAuthnRegisterOptions>,
        abortSignal?: AbortSignal
    ): Promise<RegistrationResult> {
        return (await this.evaluateFormAsync(
            {
                action: "register",
                username,
                method: "webAuthn",
                defaultAction: "register",
                enableUsernamelessLogIn: false
            },
            {
                defaultWebAuthnRegisterOptions: {
                    ...this.configuration.defaultWebAuthnRegisterOptions,
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
     * A promise that resolves with the authentication result. The promise will not resolve in the
     * case of successful authentication.
     *
     * @remarks
     * The user will be redirected to the specified URL after they have logged in. The validation
     * token will be added as a query parameters with the name `registration_validation_token`.
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
    protected render(code: () => JSXElement): () => void {
        if (this.renderTarget !== null) {
            return render(code, this.renderTarget);
        }

        const temporaryRenderTarget = document.createElement("div");
        document.body.appendChild(temporaryRenderTarget);

        const solidCleanup = render(
            () => ModalContainer({ children: code() }),
            temporaryRenderTarget
        );

        const cleanup = () => {
            solidCleanup();
            document.body.removeChild(temporaryRenderTarget);
        };

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
        props: Omit<
            AuthArmorFormProps,
            | "client"
            | "interactiveConfig"
            | "onLogIn"
            | "onRegister"
            | "onLogInFailure"
            | "onRegisterFailure"
            | "onError"
        >,
        configurationOverride: Partial<IAuthArmorInteractiveClientConfiguration> = {},
        abortSignal?: AbortSignal
    ): Promise<AuthenticationResult | RegistrationResult> {
        return new Promise((resolve, reject) => {
            const handleResult = (result: AuthenticationResult | RegistrationResult) => {
                cleanup();
                resolve(result);
            };

            const handleError = (error: unknown) => {
                cleanup();
                reject(error);
            };

            const cleanup = this.render(() =>
                AuthArmorForm({
                    client: this.client,
                    interactiveConfig: {
                        ...this.configuration,
                        ...configurationOverride
                    },
                    ...props,
                    onLogIn: handleResult,
                    onRegister: handleResult,
                    onLogInFailure: handleResult,
                    onRegisterFailure: handleResult,
                    onError: handleError
                })
            );

            abortSignal?.addEventListener("abort", (reason) => {
                cleanup();
                reject(reason);
            });
        });
    }
}
