import {
    ApiError,
    AuthArmorClient,
    AuthenticationMethod,
    AuthenticationResult,
    AvailableAuthenticationMethods,
    IAuthenticationFailureResult,
    IAuthenticationSuccessResult,
    ICaptchaConfirmationRequest,
    IRegistrationFailureResult,
    IRegistrationSuccessResult,
    QrCodeResult,
    RegistrationResult
} from "@autharmor/autharmor-js";
import {
    Match,
    Show,
    Switch,
    createEffect,
    createMemo,
    createSignal,
    on,
    onCleanup
} from "solid-js";
import { IAuthArmorInteractiveClientConfiguration } from "../config";
import { TabControl } from "../ui/TabControl";
import { LogInForm } from "../components/LogInForm";
import { RegisterForm } from "../components/RegisterForm";
import { MethodSelectionPrompt } from "../components/MethodSelectionPrompt";
import { PromptContainer } from "../components/PromptContainer";
import { AuthenticatorError, AuthenticatorPrompt } from "../components/AuthenticatorPrompt";
import { MagicLinkEmailError, MagicLinkEmailPrompt } from "../components/MagicLinkEmailPrompt";
import { WebAuthnError, WebAuthnPrompt } from "../components/WebAuthnPrompt";
import { WaitPrompt } from "../components/WaitPrompt";
import { UsernameLogInError } from "../components/UsernameLogIn";
import { CaptchaProtectedWindow } from "../components/CaptchaProtectedWindow";
import { UsernamelessLogInError } from "../components/UsernamelessLogIn";
import { UsernameRegisterError } from "../components/UsernameRegister";
import { useDocumentVisibility } from "../common/useDocumentVisibility";
import { isMobile } from "../common/isMobile";
import { defaultUiOptions } from "../options";
import { TranslationTableContext, defaultTranslationTable } from "../i18n";
import {
    NoAuthenticationMethodsAvailableError,
    UserAlreadyExistsError,
    UserNotFoundError
} from "../errors";
import styles from "./AuthArmorForm.module.css";

export type FormAction = "logIn" | "register";
export const defaultFormAction: FormAction = "logIn";

export type AuthArmorFormProps = {
    client: AuthArmorClient;
    interactiveConfig: IAuthArmorInteractiveClientConfiguration;

    action: FormAction | null;
    username: string | null;
    method: AuthenticationMethod | null;

    defaultAction: FormAction | null;

    enableUsernamelessLogIn: boolean;

    onLogIn: (authenticationResult: IAuthenticationSuccessResult) => void;
    onRegister: (registrationResult: IRegistrationSuccessResult) => void;

    onOutOfBandLogIn: (authenticationResult: IAuthenticationSuccessResult) => void;
    onOutOfBandRegister: (registrationResult: IRegistrationSuccessResult) => void;

    onLogInFailure: (authenticationResult: IAuthenticationFailureResult) => void;
    onRegisterFailure: (registrationResult: IRegistrationFailureResult) => void;

    onError: (error: unknown) => void;
};

export function AuthArmorForm(props: AuthArmorFormProps) {
    const tt = () =>
        props.interactiveConfig.internationalizationOptions?.translationTable ??
        defaultTranslationTable;

    const [usernamelessLogInError, setUsernamelessLogInError] =
        createSignal<UsernamelessLogInError | null>(null);
    const [usernameLogInError, setUsernameLogInError] = createSignal<UsernameLogInError | null>(
        null
    );
    const [usernameRegisterError, setUsernameRegisterError] =
        createSignal<UsernameRegisterError | null>(null);
    const [authenticatorError, setAuthenticatorError] = createSignal<AuthenticatorError | null>(
        null
    );
    const [magicLinkEmailError, setMagicLinkEmailError] = createSignal<MagicLinkEmailError | null>(
        null
    );
    const [webAuthnError, setWebAuthnError] = createSignal<WebAuthnError | null>(null);

    const [userSelectedCurrentAction, setUserSelectedCurrentAction] =
        createSignal<FormAction | null>(null);

    const currentAction = createMemo(
        () =>
            props.action ?? userSelectedCurrentAction() ?? props.defaultAction ?? defaultFormAction
    );

    const [userSelectedCurrentUsername, setUserSelectedCurrentUsername] = createSignal<
        string | null
    >(null);

    const currentUsername = createMemo(() => props.username ?? userSelectedCurrentUsername());

    const [availableMethods, setAvailableMethods] =
        createSignal<AvailableAuthenticationMethods | null>(null);

    const availableMethodsList = createMemo(
        () =>
            availableMethods() &&
            Object.entries(availableMethods()!)
                .filter(([_, isEnabled]) => isEnabled)
                .map(([method]) => method as AuthenticationMethod)
    );

    const singleAvailableMethod = () =>
        availableMethodsList()?.length === 1 ? availableMethodsList()![0] : null;

    const [userSelectedCurrentMethod, setUserSelectedCurrentMethod] =
        createSignal<AuthenticationMethod | null>(null);

    const currentMethod = createMemo(
        () => props.method ?? singleAvailableMethod() ?? userSelectedCurrentMethod()
    );

    const enableUsernamelessLogIn = () => props.enableUsernamelessLogIn && props.username === null;

    const [usernamelessLogInQrCodeData, setUsernamelessLogInQrCodeData] = createSignal<
        string | null
    >(null);
    const [usernamelessLogInVerificationCode, setUsernamelessLogInVerificationCode] = createSignal<
        string | null
    >();
    const [qrCodeData, setQrCodeData] = createSignal<string | null>(null);

    const [hCaptchaSiteId, setHCaptchaSiteId] = createSignal<string | false | null>(null);
    const [captchaConfirmation, setCaptchaConfirmation] =
        createSignal<ICaptchaConfirmationRequest | null>(null);
    const [isCaptchaConfirmationStale, setIsCaptchaConfirmationStale] = createSignal(false);
    const isCaptchaRequired = () =>
        (currentMethod() === "authenticator" && currentAction() === "logIn") ||
        currentMethod() === "magicLinkEmail";
    const isCaptchaPending = () =>
        isCaptchaRequired() && hCaptchaSiteId() !== false && captchaConfirmation() === null;

    const [isLoading, setIsLoading] = createSignal(false);
    const [isSucceeded, setIsSucceeded] = createSignal(false);
    const [isOutOfBandCompleted, setIsOutOfBandCompleted] = createSignal(false);

    const isDocumentVisible = useDocumentVisibility();

    const isDesktopDocumentVisible = createMemo(() => (isMobile ? true : isDocumentVisible()));

    const uiOptions = createMemo(() => ({
        ...defaultUiOptions,
        ...props.interactiveConfig.uiOptions
    }));

    const uiOptionsDerivedStyles = createMemo(() =>
        Object.fromEntries(
            Object.entries(uiOptions()).map(([property, value]) => [
                `--${property
                    .replace(/([a-z])([A-Z])/g, "$1-$2")
                    .replace(/([a-zA-Z])([0-9])/g, "$1-$2")
                    .replace(/([0-9])(a-zA-Z)/g, "$1-$2")
                    .toLowerCase()}`,
                value
            ])
        )
    );

    createEffect(
        on(
            () => props.client,
            (client) => {
                let isCleanedUp = false;

                onCleanup(() => {
                    setHCaptchaSiteId(null);

                    isCleanedUp = true;
                });

                client.getHCaptchaSiteId().then((hCaptchaSiteId) => {
                    if (isCleanedUp) return;

                    setHCaptchaSiteId(hCaptchaSiteId ?? false);
                });
            }
        )
    );

    createEffect(
        on(
            [
                enableUsernamelessLogIn,
                currentAction,
                currentUsername,
                availableMethods,
                isDesktopDocumentVisible,
                usernamelessLogInError
            ],
            async ([
                enableUsernamelessLogIn,
                action,
                username,
                availableMethods,
                isDesktopDocumentVisible,
                usernamelessLogInError
            ]) => {
                if (
                    !enableUsernamelessLogIn ||
                    action !== "logIn" ||
                    (username !== null && availableMethods !== null) ||
                    !isDesktopDocumentVisible ||
                    usernamelessLogInError !== null
                ) {
                    return;
                }

                setUsernamelessLogInQrCodeData(null);
                setUsernamelessLogInVerificationCode(null);

                const abortController = new AbortController();

                onCleanup(() => {
                    setUsernamelessLogInQrCodeData(null);
                    setUsernamelessLogInVerificationCode(null);

                    abortController.abort();
                });

                while (!abortController.signal.aborted) {
                    let qrResult: QrCodeResult<AuthenticationResult>;

                    try {
                        qrResult =
                            await props.client.authenticateWithAuthenticatorUsernamelessAsync(
                                {
                                    ...props.interactiveConfig.defaultAuthenticateOptions,
                                    ...props.interactiveConfig
                                        .defaultAuthenticatorAuthenticateOptions,
                                    ...props.interactiveConfig
                                        .defaultAuthenticatorUsernamelessAuthenticateOptions
                                },
                                abortController.signal
                            );
                    } catch (error: unknown) {
                        if (abortController.signal.aborted) {
                            return;
                        }

                        if (error instanceof TypeError) {
                            setUsernamelessLogInError("network");
                        } else {
                            setUsernamelessLogInError("unknown");
                        }

                        props.onError(error);
                        return;
                    }

                    if (abortController.signal.aborted) {
                        return;
                    }

                    setUsernamelessLogInQrCodeData(qrResult.qrCodeUrl);
                    setUsernamelessLogInVerificationCode(qrResult.verificationCode);

                    const authenticationResult = await qrResult.resultAsync();

                    if (authenticationResult.succeeded) {
                        setIsSucceeded(true);
                        setUserSelectedCurrentUsername(authenticationResult.username);

                        props.onLogIn(authenticationResult);

                        break;
                    } else if (authenticationResult.failureReason !== "timedOut") {
                        switch (authenticationResult.failureReason) {
                            case "declined": {
                                setUsernamelessLogInError("declined");
                                break;
                            }

                            default: {
                                setUsernamelessLogInError("unknown");
                                break;
                            }
                        }

                        props.onLogInFailure(authenticationResult);

                        break;
                    }
                }
            }
        )
    );

    createEffect(
        on([currentUsername], async ([username]) => {
            setAvailableMethods(null);

            if (username === null) return;

            const abortController = new AbortController();

            onCleanup(() => {
                setIsLoading(false);

                abortController.abort();
            });

            setUsernameLogInError(null);
            setUsernameRegisterError(null);

            setIsLoading(true);

            let availableMethodsForUser: AvailableAuthenticationMethods | null = null;

            try {
                availableMethodsForUser =
                    await props.client.getAvailableAuthenticationMethodsAsync(username);
            } catch (error: unknown) {
                if (!(error instanceof ApiError && error.statusCode === 404)) {
                    if (currentAction() === "logIn") {
                        setUsernameLogInError("unknown");
                    } else {
                        setUsernameRegisterError("unknown");
                    }

                    props.onError(error);
                    return;
                }
            } finally {
                if (abortController.signal.aborted) return;

                setIsLoading(false);
            }

            switch (currentAction()) {
                case "logIn": {
                    if (availableMethodsForUser === null) {
                        setUsernameLogInError("userNotFound");

                        props.onError(new UserNotFoundError());
                        return;
                    }

                    break;
                }

                case "register": {
                    if (availableMethodsForUser !== null) {
                        setUsernameRegisterError("userAlreadyExists");

                        props.onError(new UserAlreadyExistsError());
                        return;
                    }

                    const availableMethods: AvailableAuthenticationMethods = {
                        authenticator: false,
                        magicLinkEmail: false,
                        webAuthn: false,
                        ...(props.interactiveConfig.permittedMethods ?? {
                            authenticator: true,
                            magicLinkEmail:
                                props.interactiveConfig.defaultMagicLinkEmailRegisterRedirectUrl !==
                                undefined,
                            webAuthn: true
                        })
                    };

                    if (
                        availableMethods.magicLinkEmail &&
                        !/^[^@]+@[^@:/?#]*[^@:/.?#]+$/.test(username)
                    ) {
                        availableMethods.magicLinkEmail = false;
                    }

                    availableMethodsForUser = availableMethods;

                    break;
                }
            }

            const availableMethodsForUserList = Object.entries(availableMethodsForUser)
                .filter(([_, isEnabled]) => isEnabled)
                .map(([method]) => method as AuthenticationMethod);

            if (
                availableMethodsForUserList.length === 0 ||
                (currentMethod() !== null &&
                    !availableMethodsForUserList.includes(currentMethod()!))
            ) {
                if (currentAction() === "logIn") {
                    setUsernameLogInError("noAvailableMethods");
                } else {
                    setUsernameRegisterError("noAvailableMethods");
                }

                props.onError(new NoAuthenticationMethodsAvailableError());
                return;
            }

            setAvailableMethods(availableMethodsForUser);
        })
    );

    createEffect(
        on(
            [currentAction, currentUsername, currentMethod, isCaptchaPending, captchaConfirmation],
            async ([action, username, method, isCaptchaPending, captchaConfirmation]) => {
                if (action === null || username === null || method === null || isCaptchaPending) {
                    return;
                }

                if (isCaptchaConfirmationStale()) {
                    setIsCaptchaConfirmationStale(false);
                    setCaptchaConfirmation(null);

                    return;
                }

                if (captchaConfirmation !== null) {
                    setIsCaptchaConfirmationStale(true);
                }

                const abortController = new AbortController();

                setIsLoading(true);
                setAuthenticatorError(null);
                setMagicLinkEmailError(null);
                setWebAuthnError(null);
                setQrCodeData(null);

                onCleanup(() => {
                    abortController.abort();
                });

                switch (method) {
                    case "authenticator": {
                        switch (action) {
                            case "logIn": {
                                let qrResult: QrCodeResult<AuthenticationResult>;

                                try {
                                    qrResult =
                                        await props.client.authenticateWithAuthenticatorAsync(
                                            username,
                                            {
                                                ...props.interactiveConfig
                                                    .defaultAuthenticateOptions,
                                                ...props.interactiveConfig
                                                    .defaultAuthenticatorAuthenticateOptions,
                                                ...props.interactiveConfig
                                                    .defaultAuthenticatorUserSpecificAuthenticateOptions
                                            },
                                            captchaConfirmation ?? undefined,
                                            abortController.signal
                                        );

                                    if (abortController.signal.aborted) {
                                        return;
                                    }

                                    setQrCodeData(qrResult.qrCodeUrl);
                                } catch (error: unknown) {
                                    if (abortController.signal.aborted) {
                                        return;
                                    }

                                    if (error instanceof TypeError) {
                                        setAuthenticatorError("network");
                                    } else {
                                        setAuthenticatorError("unknown");
                                    }

                                    props.onError(error);
                                    return;
                                } finally {
                                    setIsLoading(false);
                                }

                                const authenticationResult = await qrResult.resultAsync();

                                if (abortController.signal.aborted) {
                                    return;
                                }

                                if (authenticationResult.succeeded) {
                                    setIsSucceeded(true);

                                    props.onLogIn(authenticationResult);
                                } else {
                                    setAuthenticatorError(authenticationResult.failureReason);

                                    props.onLogInFailure(authenticationResult);
                                }

                                break;
                            }

                            case "register": {
                                let qrResult: QrCodeResult<RegistrationResult>;

                                try {
                                    qrResult =
                                        await props.client.registerWithAuthenticatorQrCodeAsync(
                                            username,
                                            {
                                                ...props.interactiveConfig.defaultRegisterOptions,
                                                ...props.interactiveConfig
                                                    .defaultAuthenticatorRegisterOptions
                                            },
                                            abortController.signal
                                        );

                                    if (abortController.signal.aborted) {
                                        return;
                                    }

                                    setQrCodeData(qrResult.qrCodeUrl);
                                } catch (error: unknown) {
                                    if (abortController.signal.aborted) {
                                        return;
                                    }

                                    if (error instanceof TypeError) {
                                        setAuthenticatorError("network");
                                    } else {
                                        setAuthenticatorError("unknown");
                                    }

                                    props.onError(error);
                                    return;
                                } finally {
                                    setIsLoading(false);
                                }

                                const registrationResult = await qrResult.resultAsync();

                                if (abortController.signal.aborted) {
                                    return;
                                }

                                if (registrationResult.succeeded) {
                                    setIsSucceeded(true);

                                    props.onRegister(registrationResult);
                                } else {
                                    setAuthenticatorError(registrationResult.failureReason);

                                    props.onRegisterFailure(registrationResult);
                                }

                                break;
                            }
                        }

                        break;
                    }

                    case "magicLinkEmail": {
                        switch (currentAction()) {
                            case "logIn": {
                                try {
                                    const authenticationResult =
                                        await props.client.sendAuthenticateMagicLinkEmailAsync(
                                            username,
                                            props.interactiveConfig
                                                .defaultMagicLinkEmailLogInRedirectUrl!,
                                            {
                                                ...props.interactiveConfig
                                                    .defaultAuthenticateOptions,
                                                ...props.interactiveConfig
                                                    .defaultMagicLinkEmailAuthenticateOptions
                                            },
                                            captchaConfirmation ?? undefined
                                        );

                                    if (abortController.signal.aborted) {
                                        return;
                                    }

                                    if (authenticationResult.succeeded) {
                                        setIsOutOfBandCompleted(true);

                                        props.onOutOfBandLogIn(authenticationResult);
                                    } else {
                                        props.onLogInFailure(authenticationResult);
                                    }
                                } catch (error: unknown) {
                                    if (abortController.signal.aborted) {
                                        return;
                                    }

                                    if (error instanceof TypeError) {
                                        setMagicLinkEmailError("network");
                                    } else {
                                        setMagicLinkEmailError("unknown");
                                    }

                                    props.onError(error);
                                    return;
                                } finally {
                                    setIsLoading(false);
                                }

                                break;
                            }

                            case "register": {
                                try {
                                    const registrationResult =
                                        await props.client.sendRegisterMagicLinkEmailAsync(
                                            username,
                                            props.interactiveConfig
                                                .defaultMagicLinkEmailRegisterRedirectUrl!,
                                            {
                                                ...props.interactiveConfig.defaultRegisterOptions,
                                                ...props.interactiveConfig
                                                    .defaultMagicLinkEmailRegisterOptions
                                            },
                                            captchaConfirmation ?? undefined
                                        );

                                    if (abortController.signal.aborted) {
                                        return;
                                    }

                                    if (registrationResult.succeeded) {
                                        setIsOutOfBandCompleted(true);

                                        props.onOutOfBandRegister(registrationResult);
                                    } else {
                                        props.onRegisterFailure(registrationResult);
                                    }
                                } catch (error: unknown) {
                                    if (abortController.signal.aborted) {
                                        return;
                                    }

                                    if (error instanceof TypeError) {
                                        setMagicLinkEmailError("network");
                                    } else {
                                        setMagicLinkEmailError("unknown");
                                    }

                                    props.onError(error);
                                    return;
                                } finally {
                                    setIsLoading(false);
                                }

                                break;
                            }
                        }

                        break;
                    }

                    case "webAuthn": {
                        setIsLoading(false);

                        switch (currentAction()) {
                            case "logIn": {
                                try {
                                    const authenticationResult =
                                        await props.client.authenticateWithWebAuthnAsync(username);

                                    if (abortController.signal.aborted) {
                                        return;
                                    }

                                    if (authenticationResult.succeeded) {
                                        setIsSucceeded(true);

                                        props.onLogIn(authenticationResult);
                                    } else {
                                        setWebAuthnError(
                                            authenticationResult.failureReason as WebAuthnError
                                        );

                                        props.onLogInFailure(authenticationResult);
                                    }
                                } catch (error: unknown) {
                                    if (abortController.signal.aborted) {
                                        return;
                                    }

                                    if (error instanceof TypeError) {
                                        setWebAuthnError("network");
                                    } else {
                                        setWebAuthnError("unknown");
                                    }

                                    props.onError(error);
                                    return;
                                }

                                break;
                            }

                            case "register": {
                                try {
                                    const registrationResult =
                                        await props.client.registerWithWebAuthnAsync(username);

                                    if (abortController.signal.aborted) {
                                        return;
                                    }

                                    if (registrationResult.succeeded) {
                                        setIsSucceeded(true);

                                        props.onRegister(registrationResult);
                                    } else {
                                        setWebAuthnError(
                                            registrationResult.failureReason as WebAuthnError
                                        );

                                        props.onRegisterFailure(registrationResult);
                                    }
                                } catch (error: unknown) {
                                    if (abortController.signal.aborted) {
                                        return;
                                    }

                                    if (error instanceof TypeError) {
                                        setWebAuthnError("network");
                                    } else {
                                        setWebAuthnError("unknown");
                                    }

                                    props.onError(error);
                                    return;
                                }

                                break;
                            }
                        }

                        break;
                    }
                }
            }
        )
    );

    const handleTabSelect = (action: FormAction) => {
        if (isSucceeded()) return;

        setUserSelectedCurrentMethod(null);
        setUserSelectedCurrentUsername(null);
        setUserSelectedCurrentAction(action);
    };

    const handleUsernamelessRetry = () => {
        setUsernamelessLogInError(null);
    };

    const handleUsernameSelect = async (username: string) => {
        setUserSelectedCurrentUsername(username);
    };

    const handleMethodSelect = (method: AuthenticationMethod) => {
        setUserSelectedCurrentMethod(method);
    };

    const handleCaptchaConfirm = (captchaConfirmation: ICaptchaConfirmationRequest) => {
        setIsCaptchaConfirmationStale(false);
        setCaptchaConfirmation(captchaConfirmation);
    };

    const goBackHandler = () => {
        if (isSucceeded()) {
            return undefined;
        } else if (userSelectedCurrentMethod() !== null) {
            return () => setUserSelectedCurrentMethod(null);
        } else if (userSelectedCurrentUsername() !== null) {
            return () => setUserSelectedCurrentUsername(null);
        } else {
            return undefined;
        }
    };

    return (
        <TranslationTableContext.Provider value={tt}>
            <section class={styles.authArmorForm} style={uiOptionsDerivedStyles()}>
                <Show when={props.action === null}>
                    <TabControl
                        tabs={[
                            { id: "logIn", displayName: tt().form.actions.logIn.tabName },
                            { id: "register", displayName: tt().form.actions.register.tabName }
                        ]}
                        activeTabId={currentAction()}
                        onTabSelect={handleTabSelect}
                    ></TabControl>
                </Show>
                <div class={styles.view}>
                    <Show
                        when={availableMethods() !== null || props.username !== null}
                        fallback={
                            <Switch>
                                <Match when={currentAction() === "logIn"}>
                                    <LogInForm
                                        qrCodeData={
                                            enableUsernamelessLogIn()
                                                ? usernamelessLogInQrCodeData()
                                                : false
                                        }
                                        verificationCode={usernamelessLogInVerificationCode()}
                                        isLoading={isLoading()}
                                        usernameError={usernameLogInError()}
                                        usernamelessError={usernamelessLogInError()}
                                        onUsernamelessRetry={handleUsernamelessRetry}
                                        onUsernameLogInRequest={handleUsernameSelect}
                                    />
                                </Match>
                                <Match when={currentAction() === "register"}>
                                    <RegisterForm
                                        isLoading={isLoading()}
                                        usernameError={usernameRegisterError()}
                                        onUsernameRegisterRequest={handleUsernameSelect}
                                    />
                                </Match>
                            </Switch>
                        }
                    >
                        <PromptContainer
                            username={currentUsername()!}
                            isRegistering={currentAction() === "register"}
                            onGoBack={goBackHandler()}
                        >
                            <Show
                                when={isSucceeded()}
                                fallback={
                                    <Show
                                        when={currentMethod() !== null}
                                        fallback={
                                            <Show when={availableMethods() !== null}>
                                                <MethodSelectionPrompt
                                                    availableMethods={availableMethods()!}
                                                    onSelect={handleMethodSelect}
                                                />
                                            </Show>
                                        }
                                    >
                                        <CaptchaProtectedWindow
                                            hCaptchaSiteId={hCaptchaSiteId() || null}
                                            isCaptchaRequired={isCaptchaRequired()}
                                            onConfirm={handleCaptchaConfirm}
                                        >
                                            <Switch>
                                                <Match when={currentMethod() === "authenticator"}>
                                                    <AuthenticatorPrompt
                                                        qrCodeData={qrCodeData()}
                                                        isRegistering={
                                                            currentAction() === "register"
                                                        }
                                                        error={authenticatorError()}
                                                    />
                                                </Match>
                                                <Match when={currentMethod() === "magicLinkEmail"}>
                                                    <MagicLinkEmailPrompt
                                                        isRegistering={
                                                            currentAction() === "register"
                                                        }
                                                        isOutOfBandCompleted={isOutOfBandCompleted()}
                                                        error={magicLinkEmailError()}
                                                    />
                                                </Match>
                                                <Match when={currentMethod() === "webAuthn"}>
                                                    <WebAuthnPrompt
                                                        isRegistering={
                                                            currentAction() === "register"
                                                        }
                                                        error={webAuthnError()}
                                                    />
                                                </Match>
                                            </Switch>
                                        </CaptchaProtectedWindow>
                                    </Show>
                                }
                            >
                                <WaitPrompt />
                            </Show>
                        </PromptContainer>
                    </Show>
                </div>
            </section>
        </TranslationTableContext.Provider>
    );
}
