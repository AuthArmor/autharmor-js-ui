import { Show } from "solid-js";
import { UsernamelessLogIn, UsernamelessLogInError } from "./UsernamelessLogIn";
import { UsernameLogIn, UsernameLogInError } from "./UsernameLogIn";
import formStyles from "./Form.module.css";

export type LogInFormProps = {
    qrCodeData: string | null | false;
    verificationCode?: string | null;
    isLoading?: boolean;
    usernamelessError?: UsernamelessLogInError | null;
    usernameError?: UsernameLogInError | null;

    onUsernamelessRetry: () => void;
    onUsernameLogInRequest: (username: string) => void;
};

export function LogInForm(props: LogInFormProps) {
    return (
        <div class={formStyles.form}>
            <Show when={props.qrCodeData !== false}>
                <UsernamelessLogIn
                    qrCodeData={props.qrCodeData as string | null}
                    verificationCode={props.verificationCode ?? null}
                    onRetry={props.onUsernamelessRetry}
                    error={props.usernamelessError}
                />
            </Show>

            <UsernameLogIn
                isLoading={props.isLoading}
                error={props.usernameError}
                onRequest={props.onUsernameLogInRequest}
            />
        </div>
    );
}
