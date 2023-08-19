import { JSX } from "solid-js";
import { FormField } from "../ui/FormField";
import { InputFormControl } from "../ui/InputFormControl";
import { ButtonFormControl } from "../ui/ButtonFormControl";
import { useTranslationTable } from "../i18n";
import formStyles from "./Form.module.css";

export type UsernameLogInError = "userNotFound" | "noAvailableMethods" | "network" | "unknown";

export type UsernameLogInProps = {
    isLoading?: boolean;
    error?: UsernameLogInError | null;

    onRequest: (username: string) => void;

    class?: string;
    style?: string | JSX.CSSProperties;
};

export function UsernameLogIn(props: UsernameLogInProps) {
    const tt = useTranslationTable();

    const errorString = () =>
        props.error !== undefined && props.error !== null
            ? tt().form.errors.usernameLogIn[props.error]
            : null;

    let inputRef: HTMLInputElement = null!;

    const handleSubmit = (event: Event) => {
        event.preventDefault();

        const username = inputRef.value;
        props.onRequest(username);
    };

    return (
        <div class={props.class} style={props.style}>
            <p class={formStyles.methodTitle}>{tt().form.actions.logIn.username.title}</p>
            <form class={formStyles.methodForm} onSubmit={handleSubmit}>
                <FormField
                    label={tt().form.actions.logIn.username.fields.username.label}
                    error={errorString()}
                >
                    <InputFormControl ref={inputRef} type="text" />
                    <ButtonFormControl type="submit" disabled={props.isLoading}>
                        {tt().form.actions.logIn.username.submit}
                    </ButtonFormControl>
                </FormField>
            </form>
        </div>
    );
}
