import { JSX } from "solid-js";
import formStyles from "./Form.module.css";
import { FormField } from "../ui/FormField";
import { InputFormControl } from "../ui/InputFormControl";
import { ButtonFormControl } from "../ui/ButtonFormControl";
import { useTranslationTable } from "../i18n";

export type UsernameRegisterError = "userAlreadyExists" | "network" | "unknown";

export type UsernameRegisterProps = {
    isLoading?: boolean;
    error?: UsernameRegisterError | null;

    onRequest: (username: string) => void;

    class?: string;
    style?: string | JSX.CSSProperties;
};

export function UsernameRegister(props: UsernameRegisterProps) {
    const tt = useTranslationTable();

    const errorString = () =>
        props.error !== undefined && props.error !== null
            ? tt().form.errors.usernameRegister[props.error]
            : null;

    let inputRef: HTMLInputElement = null!;

    const handleSubmit = (event: Event) => {
        event.preventDefault();

        const username = inputRef.value;
        props.onRequest(username);
    };

    return (
        <div class={props.class} style={props.style}>
            <p class={formStyles.methodTitle}>{tt().form.actions.register.username.title}</p>
            <form class={formStyles.methodForm} onSubmit={handleSubmit}>
                <FormField
                    label={tt().form.actions.register.username.fields.username.label}
                    error={errorString()}
                >
                    <InputFormControl ref={inputRef} type="text" />
                    <ButtonFormControl type="submit" disabled={props.isLoading}>
                        {tt().form.actions.register.username.submit}
                    </ButtonFormControl>
                </FormField>
            </form>
        </div>
    );
}
