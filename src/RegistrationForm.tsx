import { IRegistrationSuccessResult, RegistrationResult, ApiError } from "@autharmor/sdk";
import { Show, createSignal } from "solid-js";
import { useClient } from "./context/useClient";
import { RequestDismissedError } from "./errors/RequestDismissedError";
import styles from "./Form.module.css";
import { useTranslationTable } from "./context/useTranslationTable";

export interface IRegistrationFormProps {
    onRegister: (registrationResult: IRegistrationSuccessResult) => void;
}

export function RegistrationForm(props: IRegistrationFormProps) {
    const [{ interactiveClient }] = useClient();

    const tt = useTranslationTable();

    let currentRequestAbortController: AbortController | null = null;

    const [error, setError] = createSignal<string | null>(null);

    let usernameTextbox: HTMLInputElement = undefined!;

    const handleRegister = async (event: Event) => {
        event.preventDefault();

        currentRequestAbortController?.abort(new RequestDismissedError());

        setError(null);

        const username = usernameTextbox.value;

        if (username === "") {
            setError(tt().form.register.username.errors.usernameNotProvided);
            return;
        }

        currentRequestAbortController = new AbortController();
        const abortSignal = currentRequestAbortController.signal;

        let result: RegistrationResult | null;

        try {
            result = await interactiveClient().registerAsync(username, abortSignal);
        } catch (error: unknown) {
            if (error instanceof ApiError) {
                setError(error.message);
            } else {
                setError(tt().form.register.username.errors.internalFailed);

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
                    aborted: tt().statusDialog.authenticator.logIn.status.aborted,
                    unknown: tt().statusDialog.authenticator.logIn.status.unknownFailed
                }[result.failureReason];

                setError(failureMessage);

                currentRequestAbortController = null;
                return;
            }

            props.onRegister(result);
        }

        currentRequestAbortController = null;
    };

    return (
        <form class={styles.usernameCaptureForm} onSubmit={handleRegister}>
            <input type="text" ref={usernameTextbox} />
            <Show when={error() !== null}>
                <p class={styles.error}>{error()}</p>
            </Show>
            <button type="submit">{tt().form.register.username.registerButton}</button>
        </form>
    );
}
