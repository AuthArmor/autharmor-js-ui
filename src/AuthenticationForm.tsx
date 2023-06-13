import {
    AuthArmorClient,
    IAuthenticationSuccessResult,
    IRegistrationSuccessResult
} from "autharmor-sdk";
import { JSXElement, Match, Show, Switch, createMemo, createSignal } from "solid-js";
import { ClientProvider } from "./context/ClientProvider";
import { LogInForm } from "./LogInForm";
import QrSignIn from "./QrSignIn";
import { RegistrationForm } from "./RegistrationForm";
import styles from "./Form.module.css";
import { IAuthArmorInteractiveClientConfiguration } from "./config";
import { defaultUiOptions } from "./options";
import { getUiOptionsStyle } from "./common/getUiOptionsStyle";
import { TranslationTableProvider } from "./context/TranslationTableProvider";
import { defaultTranslationTable } from "./i18n";

export type AuthenticationMode = "logIn" | "register";

export interface IAuthenticationFormProps {
    client: AuthArmorClient;
    interactiveConfig: IAuthArmorInteractiveClientConfiguration;

    enableLogIn: boolean;
    enableRegistration: boolean;

    initialMode: AuthenticationMode;

    enableUsernameless: boolean;

    onLogIn: (authenticationResult: IAuthenticationSuccessResult) => void;
    onRegister: (registrationResult: IRegistrationSuccessResult) => void;
}

export function AuthenticationForm(props: IAuthenticationFormProps): JSXElement {
    const [authenticationMode, setAuthenticationMode] = createSignal<AuthenticationMode>(
        props.initialMode
    );

    const handleSwitchToLogIn = () => {
        setAuthenticationMode("logIn");
    };

    const handleSwitchToRegister = () => {
        setAuthenticationMode("register");
    };

    const handleLogIn = (authenticationResult: IAuthenticationSuccessResult) => {
        props.onLogIn?.(authenticationResult);
    };

    const handleRegister = (registrationResult: IRegistrationSuccessResult) => {
        props.onRegister?.(registrationResult);
    };

    const uiOptionsStyle = createMemo(() =>
        getUiOptionsStyle(defaultUiOptions.form!, props.interactiveConfig.uiOptions?.form)
    );

    const tt = () =>
        props.interactiveConfig.internationalizationOptions?.translationTable ??
        defaultTranslationTable;

    return (
        <ClientProvider client={props.client} interactiveConfiguration={props.interactiveConfig}>
            <TranslationTableProvider translationTable={tt}>
                <div class={styles.form} style={uiOptionsStyle()}>
                    <nav>
                        <Show when={props.enableLogIn}>
                            <button
                                onClick={handleSwitchToLogIn}
                                aria-current={authenticationMode() === "logIn" || undefined}
                            >
                                {tt().form.logIn.tab}
                            </button>
                        </Show>
                        <Show when={props.enableRegistration}>
                            <button
                                onClick={handleSwitchToRegister}
                                aria-current={authenticationMode() === "register" || undefined}
                            >
                                {tt().form.register.tab}
                            </button>
                        </Show>
                    </nav>
                    <div class={styles.methods}>
                        <Switch>
                            <Match when={authenticationMode() === "logIn"}>
                                <Show when={props.enableUsernameless}>
                                    <div class={styles.method}>
                                        <p class={styles.methodPrompt}>
                                            {tt().form.logIn.authenticatorApp.prompt}
                                        </p>
                                        <QrSignIn onLogIn={handleLogIn} />
                                    </div>
                                    <div class={styles.separator}>{tt().form.methodSeparator}</div>
                                </Show>
                                <div class={styles.method}>
                                    <p class={styles.methodPrompt}>
                                        {tt().form.logIn.username.prompt}
                                    </p>
                                    <LogInForm onLogIn={handleLogIn} />
                                </div>
                            </Match>
                            <Match when={authenticationMode() === "register"}>
                                <div class={styles.method}>
                                    <p class={styles.methodPrompt}>
                                        {tt().form.register.username.prompt}
                                    </p>
                                    <RegistrationForm onRegister={handleRegister} />
                                </div>
                            </Match>
                        </Switch>
                    </div>
                </div>
            </TranslationTableProvider>
        </ClientProvider>
    );
}
