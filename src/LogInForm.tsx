import { IAuthenticationSuccessResult, AuthenticationResult, ApiError } from "@autharmor/sdk";
import { Show, createSignal } from "solid-js";
import { useClient } from "./context/useClient";
import { RequestDismissedError } from "./errors/RequestDismissedError";
import styles from "./Form.module.css";
import { useTranslationTable } from "./context/useTranslationTable";
import { NoAuthenticationMethodsAvailableError } from "./errors";

export interface ILogInFormProps {
    onLogIn: (authenticationResult: IAuthenticationSuccessResult) => void;
}

export function LogInForm(props: ILogInFormProps) {
    const [{ interactiveClient }] = useClient();

    const tt = useTranslationTable();

    let currentRequestAbortController: AbortController | null = null;

    const [error, setError] = createSignal<string | null>(null);

    let usernameTextbox: HTMLInputElement = undefined!;

    const handleLogIn = async (event: Event) => {
        event.preventDefault();

        currentRequestAbortController?.abort(new RequestDismissedError());

        setError(null);

        const username = usernameTextbox.value;

        if (username === "") {
            setError(tt().form.logIn.username.errors.usernameNotProvided);
            return;
        }

        currentRequestAbortController = new AbortController();
        const abortSignal = currentRequestAbortController.signal;

        let result: AuthenticationResult | null;

        try {
            result = await interactiveClient().logInAsync(username, abortSignal);
        } catch (error: unknown) {
            if (error instanceof RequestDismissedError) {
            } else if (error instanceof NoAuthenticationMethodsAvailableError) {
                setError(tt().form.logIn.username.errors.noMethodsAvailable);
            } else if (error instanceof ApiError) {
                setError(error.message);
            } else {
                setError(tt().form.logIn.username.errors.internalFailed);

                currentRequestAbortController = null;
                throw error;
            }

            currentRequestAbortController = null;
            return;
        }

        if (result !== null) {
            if (!result.succeeded) {
                const failureMessage = {
                    timedOut: tt().statusDialog.authenticator.logIn.status.timedOut,
                    declined: tt().statusDialog.authenticator.logIn.status.declined,
                    aborted: tt().statusDialog.authenticator.logIn.status.aborted,
                    unknown: tt().statusDialog.authenticator.logIn.status.unknownFailed
                }[result.failureReason];

                setError(failureMessage);

                currentRequestAbortController = null;
                return;
            }

            props.onLogIn(result);
        }

        currentRequestAbortController = null;
    };

    return (
        <form class={styles.usernameCaptureForm} onSubmit={handleLogIn}>
            <input type="text" ref={usernameTextbox} />
            <Show when={error() !== null}>
                <p class={styles.error}>{error()}</p>
            </Show>
            <button type="submit">{tt().form.logIn.username.logInButton}</button>
        </form>
    );
}
