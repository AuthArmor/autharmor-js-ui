import {
    IAuthenticationSuccessResult,
    QrCodeResult,
    AuthenticationResult,
    ApiError
} from "autharmor-sdk";
import { Match, Show, Switch, createEffect, createSignal, on, onCleanup, onMount } from "solid-js";
import { QrCode } from "./common/QrCode";
import { useClient } from "./context/useClient";
import styles from "./Form.module.css";
import { LoadingSpinner } from "./common/LoadingSpinner";
import { isMobile } from "./common/isMobile";
import { AppLinkButton } from "./common/AppLinkButton";
import { useTranslationTable } from "./context/useTranslationTable";
import { useDocumentVisibility } from "./common/useDocumentVisibility";
import { createAppLinkHandler } from "./common/createAppLinkHandler";

export interface IQrSignInProps {
    onLogIn: (authenticationResult: IAuthenticationSuccessResult) => void;
}

export default function QrSignIn(props: IQrSignInProps) {
    const [{ client, interactiveConfiguration }] = useClient();

    const tt = useTranslationTable();

    const abortController = new AbortController();

    const [signInUrl, setSignInUrl] = createSignal<string | null>(null);
    const [verificationCode, setVerificationCode] = createSignal<string | null>(null);

    const [isLoading, setIsLoading] = createSignal(false);
    const [isAuthenticated, setIsAuthenticated] = createSignal(false);
    const [error, setError] = createSignal<string | null>(null);

    const isDocumentVisible = useDocumentVisibility();

    let retryPendingAfterVisibility = false;

    createEffect(on(isDocumentVisible, () => {
        if (isDocumentVisible() && retryPendingAfterVisibility) {
            retryPendingAfterVisibility = false;
            tryAuthentication();
        }
    }));

    const tryAuthentication = async () => {
        setIsLoading(true);
        setError(null);

        let qrResult: QrCodeResult<AuthenticationResult>;

        try {
            qrResult = await client().logInWithAuthenticatorUsernamelessAsync(
                {
                    ...interactiveConfiguration().defaultLogInOptions,
                    ...interactiveConfiguration().defaultAuthenticatorLogInOptions,
                    ...interactiveConfiguration().defaultAuthenticatorUsernamelessLogInOptions,
                    ...(isMobile
                        ? {
                              // Visual verify serves no purpose on mobile and is more difficult for the user because they then need to remember the code.
                              useVisualVerify: false
                          }
                        : {})
                },
                abortController.signal
            );
        } catch (error: unknown) {
            setIsLoading(false);

            if (!(error instanceof ApiError)) {
                setError(tt().form.logIn.authenticatorApp.errors.internalFailed);

                throw error;
            }

            setError(error.message);

            return;
        }

        setSignInUrl(qrResult.qrCodeUrl);
        setVerificationCode(qrResult.verificationCode);
        setIsLoading(false);

        let authenticationResult: AuthenticationResult;

        try {
            authenticationResult = await qrResult.resultAsync();
        } catch (error: unknown) {
            if (!(error instanceof ApiError)) {
                throw error;
            }

            setSignInUrl(null);
            setVerificationCode(null);
            setError(error.message);

            return;
        }

        if (abortController.signal.aborted) {
            return;
        }

        setSignInUrl(null);
        setVerificationCode(null);

        if (authenticationResult.succeeded) {
            handleAuthenticationSuccess(authenticationResult);
        } else {
            switch (authenticationResult.failureReason) {
                case "timedOut": {
                    if (isDocumentVisible()) {
                        await tryAuthentication();
                    } else {
                        retryPendingAfterVisibility = true;
                    }

                    break;
                }

                case "declined": {
                    setError(tt().form.logIn.authenticatorApp.errors.declined);
                    break;
                }

                case "unknown": {
                    setError(tt().form.logIn.authenticatorApp.errors.unknownFailed);
                    break;
                }
            }
        }
    };

    const handleAuthenticationSuccess = (authenticationResult: IAuthenticationSuccessResult) => {
        setIsAuthenticated(true);

        props.onLogIn(authenticationResult);
    };

    const handleAppLinkClicked = createAppLinkHandler(signInUrl);

    onMount(() => {
        tryAuthentication();
    });

    onCleanup(() => {
        abortController.abort();
    });

    return (
        <section>
            <Show
                when={isMobile}
                fallback={
                    <>
                        <div class={styles.qrCodeContainer}>
                            <Switch>
                                <Match when={isAuthenticated()}>
                                    <LoadingSpinner class={styles.qrCodeSuccessSpinner} />
                                </Match>
                                <Match when={isLoading()}>
                                    <LoadingSpinner class={styles.qrCodeSpinner} />
                                </Match>
                                <Match when={error() !== null}>
                                    <div class={styles.error}>
                                        <p>{error()!}</p>
                                        <button onClick={tryAuthentication}>
                                            {tt().form.logIn.authenticatorApp.retryButton}
                                        </button>
                                    </div>
                                </Match>
                                <Match when={signInUrl() !== null}>
                                    <QrCode class={styles.qrCode} data={signInUrl()!} />
                                </Match>
                            </Switch>
                        </div>
                        <p class={styles.qrPrompt}>
                            {tt().form.logIn.authenticatorApp.qrCodePrompt}
                        </p>
                        <Show when={verificationCode() !== null}>
                            <p class={styles.verificationCodeMessage}>
                                {tt().form.logIn.authenticatorApp.verificationCodeMessage(
                                    verificationCode()!
                                )}
                            </p>
                        </Show>
                    </>
                }
            >
                <div class={styles.mobileAppContainer}>
                    <Switch>
                        <Match when={isAuthenticated()}>
                            <AppLinkButton link={null}>
                                {tt().form.logIn.authenticatorApp.successMessage}
                            </AppLinkButton>
                        </Match>
                        <Match when={isLoading()}>
                            <AppLinkButton link={null}>
                                {tt().form.logIn.authenticatorApp.appLinkLoading}
                            </AppLinkButton>
                        </Match>
                        <Match when={error() !== null}>
                            <div class={styles.error}>
                                <p>{error()}</p>
                                <button onClick={tryAuthentication}>
                                    {tt().form.logIn.authenticatorApp.retryButton}
                                </button>
                            </div>
                        </Match>
                        <Match when={signInUrl() !== null}>
                            <AppLinkButton link={signInUrl()} onClick={handleAppLinkClicked}>
                                {tt().form.logIn.authenticatorApp.appLink}
                            </AppLinkButton>
                        </Match>
                    </Switch>
                </div>
            </Show>
        </section>
    );
}
