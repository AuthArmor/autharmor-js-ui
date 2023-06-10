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

export interface IQrSignInProps {
    onLogIn: (authenticationResult: IAuthenticationSuccessResult) => void;
}

export default function QrSignIn(props: IQrSignInProps) {
    const [{ client, interactiveConfiguration }] = useClient();

    const tt = useTranslationTable();

    const abortController = new AbortController();

    const [signInUrl, setSignInUrl] = createSignal<string | null>(null);

    const [isLoading, setIsLoading] = createSignal(false);
    const [error, setError] = createSignal<string | null>(null);

    const tryAuthentication = async () => {
        setIsLoading(true);
        setError(null);

        let qrResult: QrCodeResult<AuthenticationResult>;

        try {
            qrResult = await client.logInWithAuthenticatorUsernamelessAsync(
                {
                    ...interactiveConfiguration.defaultLogInOptions,
                    ...interactiveConfiguration.defaultAuthenticatorLogInOptions,
                    ...interactiveConfiguration.defaultAuthenticatorUsernamelessLogInOptions
                },
                abortController.signal
            );
        } catch (error: unknown) {
            if (!(error instanceof ApiError)) {
                throw error;
            }

            setIsLoading(false);
            setError(error.message);

            return;
        }

        setSignInUrl(qrResult.qrCodeUrl);
        setIsLoading(false);

        let authenticationResult: AuthenticationResult;

        try {
            authenticationResult = await qrResult.resultAsync();
        } catch (error: unknown) {
            if (!(error instanceof ApiError)) {
                throw error;
            }

            setSignInUrl(null);
            setError(error.message);

            return;
        }

        if (abortController.signal.aborted) {
            return;
        }

        setSignInUrl(null);

        if (authenticationResult.succeeded) {
            handleAuthenticationSuccess(authenticationResult);
        } else {
            switch (authenticationResult.failureReason) {
                case "timedOut": {
                    await tryAuthentication();
                    break;
                }

                case "declined": {
                    setError(tt.form.logIn.authenticatorApp.errors.declined);
                    break;
                }

                case "unknown": {
                    setError(tt.form.logIn.authenticatorApp.errors.unknownFailed);
                    break;
                }
            }
        }
    };

    const handleAuthenticationSuccess = (authenticationResult: IAuthenticationSuccessResult) => {
        props.onLogIn(authenticationResult);
    };

    let existingWindow: Window | null = null;

    const tryCloseWindow = () => {
        if (existingWindow !== null) {
            existingWindow.close();
            existingWindow = null;
        }
    };

    const handleAppLinkClicked = (): boolean | void => {
        const authenticationUrl = signInUrl();

        if (authenticationUrl === null) {
            return;
        }

        existingWindow = window.open(authenticationUrl, "_blank");

        if (existingWindow === null) {
            return;
        }

        return false;
    };

    createEffect(on(signInUrl, tryCloseWindow));

    onMount(() => {
        tryAuthentication();
    });

    onCleanup(() => {
        tryCloseWindow();

        abortController.abort();
    });

    return (
        <section>
            <div class={styles.qrCodeContainer}>
                <Show when={signInUrl() !== null}>
                    <Switch fallback={<QrCode class={styles.qrCode} data={signInUrl()!} />}>
                        <Match when={isMobile}>
                            <AppLinkButton link={signInUrl()!} onClick={handleAppLinkClicked}>
                                {tt.form.logIn.authenticatorApp.appLink}
                            </AppLinkButton>
                        </Match>
                    </Switch>
                </Show>
                <Show when={isLoading()}>
                    <LoadingSpinner class={styles.qrCodeSpinner} />
                </Show>
                <Show when={error() !== null}>
                    <div class={styles.error}>
                        <p>{error()!}</p>
                        <button onClick={tryAuthentication}>
                            {tt.form.logIn.authenticatorApp.retryButton}
                        </button>
                    </div>
                </Show>
            </div>
            <p class={styles.qrPrompt}>{tt.form.logIn.authenticatorApp.qrCodePrompt}</p>
        </section>
    );
}
