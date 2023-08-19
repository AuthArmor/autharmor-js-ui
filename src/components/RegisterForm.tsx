import formStyles from "./Form.module.css";
import { UsernameRegister, UsernameRegisterError } from "./UsernameRegister";

export type RegisterFormProps = {
    isLoading?: boolean;
    usernameError?: UsernameRegisterError | null;

    onUsernameRegisterRequest: (username: string) => void;
};

export function RegisterForm(props: RegisterFormProps) {
    return (
        <div class={formStyles.form}>
            <UsernameRegister
                isLoading={props.isLoading}
                error={props.usernameError}
                onRequest={props.onUsernameRegisterRequest}
            />
        </div>
    );
}
