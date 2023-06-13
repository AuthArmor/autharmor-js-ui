import {
    AuthArmorClient,
    AuthenticationResult,
    IAvailableAuthenticationMethods,
    IAuthenticatorUserSpecificLogInOptions,
    QrCodeResult,
    ApiError,
    IEmailMagicLinkLogInOptions,
    RegistrationResult,
    IAuthenticatorRegisterOptions,
    IWebAuthnRegisterOptions,
    IEmailMagicLinkRegisterOptions
} from "autharmor-sdk";
import { createAuthStatusDialog } from "./dialogs/createAuthStatusDialog";
import { selectAuthenticationMethod } from "./dialogs/selectAuthenticationMethod";
import { IAuthArmorInteractiveClientConfiguration } from "./config/IAuthArmorInteractiveClientConfiguration";
import { ITranslationTable, defaultTranslationTable } from "./i18n";

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
     * Logs a user in, prompting them for the authentication method if necessary.
     *
     * @param username The username of the user.
     * @param abortSignal The abort signal to use for this request.
     *
     * @returns
     *  A promise that resolves with the authentication result, or null if the authentication result is not available
     *  (e.g. the user has used an email magic link).
     */
    public async logInAsync(
        username: string,
        abortSignal?: AbortSignal
    ): Promise<AuthenticationResult | null> {
        const selectedMethod = await this.selectLogInMethodAsync(username, abortSignal);

        switch (selectedMethod) {
            case "authenticator": {
                return await this.logInWithAuthenticatorAsync(username, {}, abortSignal);
            }

            case "webAuthn": {
                return await this.logInWithWebAuthnAsync(username, abortSignal);
            }

            case "emailMagicLink": {
                await this.logInWithEmailMagicLinkAsync(username, undefined, {}, abortSignal);
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
    public async selectLogInMethodAsync(
        username: string,
        abortSignal?: AbortSignal
    ): Promise<keyof IAvailableAuthenticationMethods> {
        const methods: IAvailableAuthenticationMethods =
            await this.client.getAvailableLogInMethodsAsync(username);

        const methodCount = Object.values(methods).filter((m) => m).length;

        if (methodCount === 0) {
            throw new Error("No methods are available for this user.");
        }

        const selectedMethod =
            methodCount > 1
                ? await selectAuthenticationMethod(
                      methods,
                      this.tt,
                      this.configuration.uiOptions?.dialog,
                      abortSignal
                  )
                : (Object.keys(methods) as (keyof IAvailableAuthenticationMethods)[]).find(
                      (m) => methods[m]
                  )!;

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
    public async logInWithAuthenticatorAsync(
        username: string,
        options: Partial<IAuthenticatorUserSpecificLogInOptions> = {},
        abortSignal?: AbortSignal
    ): Promise<AuthenticationResult> {
        const abortController = new AbortController();
        const abortHandler = (reason: any) => abortController.abort(reason);
        abortSignal?.addEventListener("abort", abortHandler);

        const [_, { setTitle, setStatusMessage, setStatusType, setAuthenticationUrl }] =
            createAuthStatusDialog(
                this.tt,
                this.configuration.uiOptions?.dialog,
                abortController.signal,
                abortController
            );

        setTitle(this.tt.statusDialog.authenticator.logIn.title);
        setStatusMessage(this.tt.statusDialog.authenticator.logIn.status.sending);

        let qrResult: QrCodeResult<AuthenticationResult>;

        try {
            qrResult = await this.client.logInWithAuthenticatorAsync(
                username,
                {
                    ...this.configuration.defaultLogInOptions,
                    ...this.configuration.defaultAuthenticatorLogInOptions,
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

        let authenticationResult: AuthenticationResult;

        try {
            authenticationResult = await qrResult.resultAsync();
        } catch (error: unknown) {
            abortController.signal.throwIfAborted();

            setStatusType("error");
            setAuthenticationUrl(null);

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
    public async logInWithWebAuthnAsync(
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
            authenticationResult = await this.client.logInWithWebAuthnAsync(username);
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
     *  The URL that's sent to the user's email.
     *  If this is blank, the default one configured for this interactive client will be used.
     *  The validation token and request ID will be added as query parameters with the names `auth_validation_token` and `auth_request_id` respectively.
     * @param options The options to use for this request.
     * @param abortSignal The abort signal to use for this request.
     *
     * @returns A promise that resolves once the email was sent.
     */
    public async logInWithEmailMagicLinkAsync(
        emailAddress: string,
        redirectUrl?: string,
        options: Partial<IEmailMagicLinkLogInOptions> = {},
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

        setTitle(this.tt.statusDialog.emailMagicLink.logIn.title);
        setStatusMessage(this.tt.statusDialog.emailMagicLink.logIn.status.sending);

        const finalRedirectUrl =
            redirectUrl ?? this.configuration.defaultEmailMagicLinkLogInRedirectUrl;

        if (finalRedirectUrl === undefined) {
            setStatusMessage(this.tt.statusDialog.emailMagicLink.logIn.status.unknownFailed);
            setStatusType("error");

            throw new Error("Redirect link not specified.");
        }

        try {
            await this.client.sendLoginMagicLinkAsync(emailAddress, finalRedirectUrl, {
                ...this.configuration.defaultLogInOptions,
                ...this.configuration.defaultEmailMagicLinkLogInOptions,
                ...options
            });
        } catch (error: unknown) {
            abortController.signal.throwIfAborted();

            setStatusType("error");

            if (error instanceof ApiError) {
                setStatusMessage(error.message);
            } else {
                setStatusMessage(this.tt.statusDialog.emailMagicLink.logIn.status.unknownFailed);
            }

            throw error;
        }

        setStatusMessage(this.tt.statusDialog.emailMagicLink.logIn.status.pending);

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

            case "emailMagicLink": {
                await this.registerWithEmailMagicLinkAsync(username, undefined, {}, abortSignal);
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
    ): Promise<keyof IAvailableAuthenticationMethods> {
        const methods: IAvailableAuthenticationMethods = {
            authenticator: true,
            emailMagicLink: true,
            webAuthn: true
        };

        const selectedMethod = await selectAuthenticationMethod(
            methods,
            this.tt,
            this.configuration.uiOptions?.dialog,
            abortSignal
        );

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
            { setTitle, setStatusMessage, setStatusType, setAuthenticationUrl, setAlwaysShowQrCode }
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
                    ...this.configuration.defaultAuthenticatorRegisterOptions,
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

        let registrationResult: RegistrationResult;

        try {
            registrationResult = await qrResult.resultAsync();
        } catch (error: unknown) {
            abortController.signal.throwIfAborted();

            setStatusType("error");
            setAuthenticationUrl(null);

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
     *  The URL that's sent to the user's email.
     *  If this is blank, the default one configured for this interactive client will be used.
     *  The validation token will be added as a query parameter with the name `registration_validation_token`.
     * @param options The options to use for this request.
     * @param abortSignal The abort signal to use for this request.
     *
     * @returns A promise that resolves once the email was sent.
     */
    public async registerWithEmailMagicLinkAsync(
        emailAddress: string,
        redirectUrl?: string,
        options: Partial<IEmailMagicLinkRegisterOptions> = {},
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

        setTitle(this.tt.statusDialog.emailMagicLink.register.title);
        setStatusMessage(this.tt.statusDialog.emailMagicLink.register.status.sending);

        const finalRedirectUrl =
            redirectUrl ?? this.configuration.defaultEmailMagicLinkRegisterRedirectUrl;

        if (finalRedirectUrl === undefined) {
            setStatusMessage(this.tt.statusDialog.emailMagicLink.register.status.unknownFailed);
            setStatusType("error");

            throw new Error("Redirect link not specified.");
        }

        try {
            await this.client.sendRegisterMagicLinkAsync(emailAddress, finalRedirectUrl, {
                ...this.configuration.defaultRegisterOptions,
                ...this.configuration.defaultEmailMagicLinkRegisterOptions,
                ...options
            });
        } catch (error: unknown) {
            abortController.signal.throwIfAborted();

            setStatusType("error");

            if (error instanceof ApiError) {
                setStatusMessage(error.message);
            } else {
                setStatusMessage(this.tt.statusDialog.emailMagicLink.register.status.unknownFailed);
            }

            throw error;
        }

        setStatusMessage(this.tt.statusDialog.emailMagicLink.register.status.pending);

        abortSignal?.removeEventListener("abort", abortHandler);
    }
}