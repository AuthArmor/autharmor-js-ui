import { Show, createSignal } from "solid-js";
import { useTranslationTable } from "../i18n";
import { UsernamelessLogIn, UsernamelessLogInError } from "./UsernamelessLogIn";
import { UsernameLogIn, UsernameLogInError } from "./UsernameLogIn";
import formStyles from "./Form.module.css";

export type LogInFormProps = {
    qrCodeData: string | null | false;
    verificationCode?: string | null;
    isLoading?: boolean;
    preferUsernamelessLogIn?: boolean;
    usernamelessError?: UsernamelessLogInError | null;
    usernameError?: UsernameLogInError | null;

    onUsernamelessRetry: () => void;
    onUsernameLogInRequest: (username: string) => void;
};

export function LogInForm(props: LogInFormProps) {
    const tt = useTranslationTable();

    const isUsernamelessLogInAvailable = () => props.qrCodeData !== false;

    const [isUserSelectedUsernameForm, setIsUserSelectedUsernameForm] =
        createSignal<boolean>(false);

    const isUsernameForm = () =>
        isUsernamelessLogInAvailable() ? isUserSelectedUsernameForm() : !props.preferUsernamelessLogIn;

    const toggleUserSelectedUsernameForm = () => {
        setIsUserSelectedUsernameForm((isUserSelectedUsernameForm) => !isUserSelectedUsernameForm);
    };

    return (
        <div class={formStyles.form}>
            <Show
                when={isUsernameForm()}
                fallback={
                    <UsernamelessLogIn
                        qrCodeData={props.qrCodeData as string | null}
                        verificationCode={props.verificationCode ?? null}
                        onRetry={props.onUsernamelessRetry}
                        error={props.usernamelessError}
                    />
                }
            >
                <UsernameLogIn
                    isLoading={props.isLoading}
                    error={props.usernameError}
                    onRequest={props.onUsernameLogInRequest}
                />
            </Show>

            <Show when={isUsernamelessLogInAvailable()}>
                <span class={formStyles.formDivider} />

                <button class={formStyles.methodLink} onClick={toggleUserSelectedUsernameForm}>
                    {
                        tt().form.actions.logIn.methodButtons[
                            isUsernameForm() ? "usernameless" : "username"
                        ]
                    }
                </button>
            </Show>
        </div>
    );
}
