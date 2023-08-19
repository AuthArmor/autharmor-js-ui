import {
    AuthArmorClient,
    AuthenticationResult,
    IAuthenticatorUserSpecificAuthenticateOptions,
    QrCodeResult,
    ApiError,
    IMagicLinkEmailAuthenticateOptions,
    RegistrationResult,
    IAuthenticatorRegisterOptions,
    IWebAuthnRegisterOptions,
    IMagicLinkEmailRegisterOptions,
    AuthenticationMethod,
    AvailableAuthenticationMethods
} from "@autharmor/autharmor-js";
import { IAuthArmorInteractiveClientConfiguration } from "./config/IAuthArmorInteractiveClientConfiguration";
import { ITranslationTable, defaultTranslationTable } from "./i18n";
import { NoAuthenticationMethodsAvailableError } from "./errors";

/**
 * The client for interacting with AuthArmor's client-side SDK providing a user-facing interface.
 */
export class AuthArmorInteractiveClient {
    /**
     * The translation table to use for strings displayed to the user.
     */
    private readonly tt: ITranslationTable;

    /**
     * @param client The AuthArmorClient for interacting with AuthArmor's client-side SDK.
     * @param configuration The configuration for the interactive client.
     */
    public constructor(
        private readonly client: AuthArmorClient,
        private readonly configuration: IAuthArmorInteractiveClientConfiguration = {}
    ) {
        this.tt =
            this.configuration.internationalizationOptions?.translationTable ??
            defaultTranslationTable;
    }

    /**
     * Authenticates, prompting them for the authentication method if necessary.
     *
     * @param username The username of the user.
     * @param abortSignal The abort signal to use for this request.
     *
     * @returns
     *  A promise that resolves with the authentication result, or null if the authentication result is not available
     *  (e.g. the user has used an email magic link).
     */
    public async authenticateAsync(
        username: string,
        abortSignal?: AbortSignal
    ): Promise<AuthenticationResult | null> {
        const selectedMethod = await this.selectAuthenticationMethodAsync(username, abortSignal);

        switch (selectedMethod) {
            case "authenticator": {
                return await this.authenticateWithAuthenticatorAsync(username, {}, abortSignal);
            }

            case "webAuthn": {
                return await this.authenticateWithWebAuthnAsync(username, abortSignal);
            }

            case "magicLinkEmail": {
                await this.authenticateWithMagicLinkEmailAsync(
                    username,
                    undefined,
                    {},
                    abortSignal
                );
                return null;
            }
        }
    }

    /**
     * Prompts a user to select an authentication method from the methods available to them.
     *
     * @param username The username of the user.
     * @param abortSignal The abort signal to use for this request.
     *
     * @returns A promise that resolves with the authentication method.
     */
    public async selectAuthenticationMethodAsync(
        username: string,
        abortSignal?: AbortSignal
    ): Promise<AuthenticationMethod> {
        let methods: AvailableAuthenticationMethods =
            await this.client.getAvailableAuthenticationMethodsAsync(username);

        if (this.configuration.permittedMethods !== undefined) {
            const permittedMethods: AvailableAuthenticationMethods = {
                authenticator: false,
                magicLinkEmail: false,
                webAuthn: false,
                ...this.configuration.permittedMethods
            };

            methods = {
                authenticator: permittedMethods.authenticator && methods.authenticator,
                magicLinkEmail: permittedMethods.magicLinkEmail && methods.magicLinkEmail,
                webAuthn: permittedMethods.webAuthn && methods.webAuthn
            };
        }

        const methodCount = Object.values(methods).filter((m) => m).length;

        if (methodCount === 0) {
            throw new NoAuthenticationMethodsAvailableError();
        }

        const selectedMethod =
            methodCount > 1
                ? await selectAuthenticationMethod(
                      methods,
                      this.tt,
                      this.configuration.uiOptions?.dialog,
                      abortSignal
                  )
                : (Object.keys(methods) as AuthenticationMethod[]).find((m) => methods[m])!;

        return selectedMethod;
    }

    /**
     * Logs a user in using their authenticator app.
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
        const abortController = new AbortController();
        const abortHandler = (reason: any) => abortController.abort(reason);
        abortSignal?.addEventListener("abort", abortHandler);

        const [
            _,
            { setTitle, setStatusMessage, setStatusType, setAuthenticationUrl, setVerificationCode }
        ] = createAuthStatusDialog(
            this.tt,
            this.configuration.uiOptions?.dialog,
            abortController.signal,
            abortController
        );

        setTitle(this.tt.statusDialog.authenticator.logIn.title);
        setStatusMessage(this.tt.statusDialog.authenticator.logIn.status.sending);

        let qrResult: QrCodeResult<AuthenticationResult>;

        try {
            qrResult = await this.client.authenticateWithAuthenticatorAsync(
                username,
                {
                    ...this.configuration.defaultAuthenticateOptions,
                    ...this.configuration.defaultAuthenticatorAuthenticateOptions,
                    ...this.configuration.defaultAuthenticatorUserSpecificAuthenticateOptions,
                    ...options
                },
                abortController.signal
            );
        } catch (error: unknown) {
            abortController.signal.throwIfAborted();

            setStatusType("error");

            if (error instanceof ApiError) {
                setStatusMessage(error.message);
            } else {
                setStatusMessage(this.tt.statusDialog.authenticator.logIn.status.unknownFailed);
            }

            throw error;
        }

        setStatusMessage(this.tt.statusDialog.authenticator.logIn.status.pending);
        setAuthenticationUrl(qrResult.qrCodeUrl);
        setVerificationCode(qrResult.verificationCode);

        let authenticationResult: AuthenticationResult;

        try {
            authenticationResult = await qrResult.resultAsync();
        } catch (error: unknown) {
            abortController.signal.throwIfAborted();

            setStatusType("error");
            setAuthenticationUrl(null);
            setVerificationCode(null);

            if (error instanceof ApiError) {
                setStatusMessage(error.message);
            } else {
                setStatusMessage(this.tt.statusDialog.authenticator.logIn.status.unknownFailed);
            }

            throw error;
        }

        if (authenticationResult.succeeded) {
            setStatusMessage(this.tt.statusDialog.authenticator.logIn.status.approved);
            setStatusType("success");

            setTimeout(() => abortController.abort(), 1000);
        } else {
            const failureMessage = {
                timedOut: this.tt.statusDialog.authenticator.logIn.status.timedOut,
                declined: this.tt.statusDialog.authenticator.logIn.status.declined,
                aborted: this.tt.statusDialog.authenticator.logIn.status.aborted,
                unknown: this.tt.statusDialog.authenticator.logIn.status.unknownFailed
            }[authenticationResult.failureReason];

            setStatusMessage(failureMessage);
            setStatusType("error");
            setAuthenticationUrl(null);
            setVerificationCode(null);
        }

        abortSignal?.removeEventListener("abort", abortHandler);

        return authenticationResult;
    }

    /**
     * Logs a user in using WebAuthn.
     *
     * @param username The username of the user.
     * @param abortSignal The abort signal to use for this request.
     *
     * @returns A promise that resolves with the authentication result.
     */
    public async authenticateWithWebAuthnAsync(
        username: string,
        abortSignal?: AbortSignal
    ): Promise<AuthenticationResult> {
        const abortController = new AbortController();
        const abortHandler = (reason: any) => abortController.abort(reason);
        abortSignal?.addEventListener("abort", abortHandler);

        const [_, { setTitle, setStatusMessage, setStatusType }] = createAuthStatusDialog(
            this.tt,
            this.configuration.uiOptions?.dialog,
            abortController.signal,
            abortController
        );

        setTitle(this.tt.statusDialog.webAuthn.logIn.title);
        setStatusMessage(this.tt.statusDialog.webAuthn.logIn.status.pending);

        let authenticationResult: AuthenticationResult;

        try {
            authenticationResult = await this.client.authenticateWithWebAuthnAsync(username);
        } catch (error: unknown) {
            abortController.signal.throwIfAborted();

            setStatusType("error");

            if (error instanceof ApiError) {
                setStatusMessage(error.message);
            } else {
                setStatusMessage(this.tt.statusDialog.webAuthn.logIn.status.unknownFailed);
            }

            throw error;
        }

        if (authenticationResult.succeeded) {
            setStatusMessage(this.tt.statusDialog.webAuthn.logIn.status.approved);
            setStatusType("success");

            setTimeout(() => abortController.abort(), 1000);
        } else {
            const failureMessage = {
                timedOut: this.tt.statusDialog.webAuthn.logIn.status.timedOut,
                declined: this.tt.statusDialog.webAuthn.logIn.status.declined,
                aborted: this.tt.statusDialog.webAuthn.logIn.status.aborted,
                unknown: this.tt.statusDialog.webAuthn.logIn.status.unknownFailed
            }[authenticationResult.failureReason];

            setStatusMessage(failureMessage);
            setStatusType("error");
        }

        abortSignal?.removeEventListener("abort", abortHandler);

        return authenticationResult;
    }

    /**
     * Logs a user in using an email magic link.
     *
     * @param username The username of the user.
     * @param redirectUrl
     *  The URL that's sent to the user's email. If this is blank, the default one configured for
     *  this interactive client will be used.
     * @param options The options to use for this request.
     * @param abortSignal The abort signal to use for this request.
     *
     * @returns A promise that resolves once the email was sent.
     *
     * @remarks
     * The user will be redirected to the specified URL after they have logged in. The validation
     * token and request ID will be added as query parameters with the names
     * `auth_validation_token` and `auth_request_id` respectively.
     */
    public async authenticateWithMagicLinkEmailAsync(
        emailAddress: string,
        redirectUrl?: string,
        options: Partial<IMagicLinkEmailAuthenticateOptions> = {},
        abortSignal?: AbortSignal
    ): Promise<void> {
        const abortController = new AbortController();
        const abortHandler = (reason: any) => abortController.abort(reason);
        abortSignal?.addEventListener("abort", abortHandler);

        const [_, { setTitle, setStatusMessage, setStatusType }] = createAuthStatusDialog(
            this.tt,
            this.configuration.uiOptions?.dialog,
            abortController.signal,
            abortController
        );

        setTitle(this.tt.statusDialog.magicLinkEmail.logIn.title);
        setStatusMessage(this.tt.statusDialog.magicLinkEmail.logIn.status.sending);

        const finalRedirectUrl =
            redirectUrl ?? this.configuration.defaultMagicLinkEmailLogInRedirectUrl;

        if (finalRedirectUrl === undefined) {
            setStatusMessage(this.tt.statusDialog.magicLinkEmail.logIn.status.unknownFailed);
            setStatusType("error");

            throw new Error("Redirect link not specified.");
        }

        try {
            await this.client.sendAuthenticateMagicLinkEmailAsync(emailAddress, finalRedirectUrl, {
                ...this.configuration.defaultAuthenticateOptions,
                ...this.configuration.defaultMagicLinkEmailAuthenticateOptions,
                ...options
            });
        } catch (error: unknown) {
            abortController.signal.throwIfAborted();

            setStatusType("error");

            if (error instanceof ApiError) {
                setStatusMessage(error.message);
            } else {
                setStatusMessage(this.tt.statusDialog.magicLinkEmail.logIn.status.unknownFailed);
            }

            throw error;
        }

        setStatusMessage(this.tt.statusDialog.magicLinkEmail.logIn.status.pending);

        abortSignal?.removeEventListener("abort", abortHandler);
    }

    /**
     * Registers a user, prompting them for the registration method if necessary.
     *
     * @param username The username of the user.
     * @param abortSignal The abort signal to use for this request.
     *
     * @returns
     *  A promise that resolves with the registration result, or null if the registration result is not available
     *  (e.g. the user has used an email magic link).
     */
    public async registerAsync(
        username: string,
        abortSignal?: AbortSignal
    ): Promise<RegistrationResult | null> {
        const selectedMethod = await this.selectRegistrationMethodAsync(abortSignal);

        switch (selectedMethod) {
            case "authenticator": {
                return await this.registerWithAuthenticatorAsync(username, {}, abortSignal);
            }

            case "webAuthn": {
                return await this.registerWithWebAuthnAsync(username, {}, abortSignal);
            }

            case "magicLinkEmail": {
                await this.registerWithMagicLinkEmailAsync(username, undefined, {}, abortSignal);
                return null;
            }
        }
    }

    /**
     * Prompts a user to select an authentication method for registration from the allowed mtehods.
     *
     * @param username The username of the user.
     * @param abortSignal The abort signal to use for this request.
     *
     * @returns A promise that resolves with the authentication method.
     */
    public async selectRegistrationMethodAsync(
        abortSignal?: AbortSignal
    ): Promise<AuthenticationMethod> {
        const methods: AvailableAuthenticationMethods = {
            authenticator: false,
            magicLinkEmail: false,
            webAuthn: false,
            ...(this.configuration.permittedMethods ?? {
                authenticator: true,
                magicLinkEmail: true,
                webAuthn: true
            })
        };

        const methodCount = Object.values(methods).filter((m) => m).length;

        if (methodCount === 0) {
            throw new NoAuthenticationMethodsAvailableError();
        }

        const selectedMethod =
            methodCount > 1
                ? await selectAuthenticationMethod(
                      methods,
                      this.tt,
                      this.configuration.uiOptions?.dialog,
                      abortSignal
                  )
                : (Object.keys(methods) as AuthenticationMethod[]).find((m) => methods[m])!;

        return selectedMethod;
    }

    /**
     * Registers a using their authenticator app.
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
        const abortController = new AbortController();
        const abortHandler = (reason: any) => abortController.abort(reason);
        abortSignal?.addEventListener("abort", abortHandler);

        const [
            _,
            {
                setTitle,
                setStatusMessage,
                setStatusType,
                setAuthenticationUrl,
                setAlwaysShowQrCode,
                setVerificationCode
            }
        ] = createAuthStatusDialog(
            this.tt,
            this.configuration.uiOptions?.dialog,
            abortController.signal,
            abortController
        );

        setTitle(this.tt.statusDialog.authenticator.register.title);
        setStatusMessage(this.tt.statusDialog.authenticator.register.status.sending);
        setAlwaysShowQrCode(true);

        let qrResult: QrCodeResult<RegistrationResult>;

        try {
            qrResult = await this.client.registerWithAuthenticatorQrCodeAsync(
                username,
                {
                    ...this.configuration.defaultRegisterOptions,
                    ...this.configuration.defaultAuthenticatorAuthenticateOptions,
                    ...options
                },
                abortController.signal
            );
        } catch (error: unknown) {
            abortController.signal.throwIfAborted();

            setStatusType("error");

            if (error instanceof ApiError) {
                setStatusMessage(error.message);
            } else {
                setStatusMessage("Unknown error");
            }

            throw error;
        }

        setStatusMessage(this.tt.statusDialog.authenticator.register.status.pending);
        setAuthenticationUrl(qrResult.qrCodeUrl);
        setVerificationCode(qrResult.verificationCode);

        let registrationResult: RegistrationResult;

        try {
            registrationResult = await qrResult.resultAsync();
        } catch (error: unknown) {
            abortController.signal.throwIfAborted();

            setStatusType("error");
            setAuthenticationUrl(null);
            setVerificationCode(null);

            if (error instanceof ApiError) {
                setStatusMessage(error.message);
            } else {
                setStatusMessage(this.tt.statusDialog.authenticator.register.status.unknownFailed);
            }

            throw error;
        }

        if (registrationResult.succeeded) {
            setStatusMessage(this.tt.statusDialog.authenticator.register.status.approved);
            setStatusType("success");

            setTimeout(() => abortController.abort(), 1000);
        } else {
            const failureMessage = {
                timedOut: this.tt.statusDialog.authenticator.register.status.timedOut,
                aborted: this.tt.statusDialog.authenticator.register.status.aborted,
                unknown: this.tt.statusDialog.authenticator.register.status.unknownFailed
            }[registrationResult.failureReason];

            setStatusMessage(failureMessage);
            setStatusType("error");
            setAuthenticationUrl(null);
            setVerificationCode(null);
        }

        abortSignal?.removeEventListener("abort", abortHandler);

        return registrationResult;
    }

    /**
     * Registers a using WebAuthn.
     *
     * @param username The username of the user.
     * @param options The options to use for this request.
     * @param abortSignal The abort signal to use for this request.
     *
     * @returns A promise that resolves with the registration result.
     */
    public async registerWithWebAuthnAsync(
        username: string,
        options: Partial<IWebAuthnRegisterOptions> = {},
        abortSignal?: AbortSignal
    ): Promise<RegistrationResult> {
        const abortController = new AbortController();
        const abortHandler = (reason: any) => abortController.abort(reason);
        abortSignal?.addEventListener("abort", abortHandler);

        const [_, { setTitle, setStatusMessage, setStatusType }] = createAuthStatusDialog(
            this.tt,
            this.configuration.uiOptions?.dialog,
            abortController.signal,
            abortController
        );

        setTitle(this.tt.statusDialog.webAuthn.register.title);
        setStatusMessage(this.tt.statusDialog.webAuthn.register.status.pending);

        let registrationResult: RegistrationResult;

        try {
            registrationResult = await this.client.registerWithWebAuthnAsync(username, {
                ...this.configuration.defaultRegisterOptions,
                ...this.configuration.defaultWebAuthnRegisterOptions,
                ...options
            });
        } catch (error: unknown) {
            abortController.signal.throwIfAborted();

            setStatusType("error");

            if (error instanceof ApiError) {
                setStatusMessage(error.message);
            } else {
                setStatusMessage(this.tt.statusDialog.webAuthn.register.status.unknownFailed);
            }

            throw error;
        }

        if (registrationResult.succeeded) {
            setStatusMessage(this.tt.statusDialog.webAuthn.register.status.approved);
            setStatusType("success");

            setTimeout(() => abortController.abort(), 1000);
        } else {
            const failureMessage = {
                timedOut: this.tt.statusDialog.webAuthn.register.status.timedOut,
                aborted: this.tt.statusDialog.webAuthn.register.status.aborted,
                unknown: this.tt.statusDialog.webAuthn.register.status.unknownFailed
            }[registrationResult.failureReason];

            setStatusMessage(failureMessage);
            setStatusType("error");
        }

        abortSignal?.removeEventListener("abort", abortHandler);

        return registrationResult;
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
     * @returns A promise that resolves once the email was sent.
     *
     * @remarks
     * The user will be redirected to the specified URL after they have logged in. The URL will
     * contain a query string parameter named `registration_validation_token` that can be used to
     * validate the registration.
     *
     * The account will not be created in AuthArmor's database until the registration is validated
     * from the server.
     */
    public async registerWithMagicLinkEmailAsync(
        emailAddress: string,
        redirectUrl?: string,
        options: Partial<IMagicLinkEmailRegisterOptions> = {},
        abortSignal?: AbortSignal
    ): Promise<void> {
        const abortController = new AbortController();
        const abortHandler = (reason: any) => abortController.abort(reason);
        abortSignal?.addEventListener("abort", abortHandler);

        const [_, { setTitle, setStatusMessage, setStatusType }] = createAuthStatusDialog(
            this.tt,
            this.configuration.uiOptions?.dialog,
            abortController.signal,
            abortController
        );

        setTitle(this.tt.statusDialog.magicLinkEmail.register.title);
        setStatusMessage(this.tt.statusDialog.magicLinkEmail.register.status.sending);

        const finalRedirectUrl =
            redirectUrl ?? this.configuration.defaultMagicLinkEmailRegisterRedirectUrl;

        if (finalRedirectUrl === undefined) {
            setStatusMessage(this.tt.statusDialog.magicLinkEmail.register.status.unknownFailed);
            setStatusType("error");

            throw new Error("Redirect link not specified.");
        }

        try {
            await this.client.sendRegisterMagicLinkEmailAsync(emailAddress, finalRedirectUrl, {
                ...this.configuration.defaultRegisterOptions,
                ...this.configuration.defaultMagicLinkEmailRegisterOptions,
                ...options
            });
        } catch (error: unknown) {
            abortController.signal.throwIfAborted();

            setStatusType("error");

            if (error instanceof ApiError) {
                setStatusMessage(error.message);
            } else {
                setStatusMessage(this.tt.statusDialog.magicLinkEmail.register.status.unknownFailed);
            }

            throw error;
        }

        setStatusMessage(this.tt.statusDialog.magicLinkEmail.register.status.pending);

        abortSignal?.removeEventListener("abort", abortHandler);
    }
}
