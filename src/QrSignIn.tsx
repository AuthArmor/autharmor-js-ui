import {
    IAuthenticationSuccessResult,
    QrCodeResult,
    AuthenticationResult,
    ApiError
} from "autharmor-sdk";
import { Match, Show, Switch, createSignal, onCleanup, onMount } from "solid-js";
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
    // const [remainingTimeSeconds, setRemainingTimeSeconds] = createSignal<number | null>(null);

    const [isLoading, setIsLoading] = createSignal(false);
    const [error, setError] = createSignal<string | null>(null);

    // let interval: unknown | null = null;

    // const ensureIntervalIsCleared = () => {
    //     if (interval !== null) {
    //         clearInterval(interval as any);
    //         interval = null;
    //     }
    // };

    const tryAuthentication = async () => {
        // ensureIntervalIsCleared();

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
        // setRemainingTimeSeconds(60);
        setIsLoading(false);

        // interval = setInterval(() => {
        //     setRemainingTimeSeconds((rts) => (rts === null ? null : rts - 1));
        // }, 1000);

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

        // ensureIntervalIsCleared();

        setSignInUrl(null);
        // setRemainingTimeSeconds(null);

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

    onMount(() => {
        tryAuthentication();
    });

    onCleanup(() => {
        // ensureIntervalIsCleared();

        abortController.abort();
    });

    // const remainingTimeSecondsComponent = () => (remainingTimeSeconds() ?? 0) % 60;
    // const remainingTimeMinutesComponent = () =>
    //     ((remainingTimeSeconds() ?? 0) - remainingTimeSecondsComponent()) / 60;

    return (
        <section>
            <div class={styles.qrCodeContainer}>
                <Show when={signInUrl() !== null}>
                    <Switch fallback={<QrCode class={styles.qrCode} data={signInUrl()!} />}>
                        <Match when={isMobile}>
                            <AppLinkButton link={signInUrl()!}>
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
