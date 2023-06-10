export interface ITranslationTable {
    form: {
        logIn: {
            tab: string;
            authenticatorApp: {
                prompt: string;
                appLink: string;
                appLinkLoading: string;
                qrCodePrompt: string;
                retryButton: string;
                errors: {
                    declined: string;
                    unknownFailed: string;
                };
            };
            username: {
                prompt: string;
                logInButton: string;
                errors: {
                    usernameNotProvided: string;
                    declined: string;
                    timedOut: string;
                    aborted: string;
                    unknownFailed: string;
                };
            };
        };
        register: {
            tab: string;
            username: {
                prompt: string;
                registerButton: string;
                errors: {
                    usernameNotProvided: string;
                    timedOut: string;
                    aborted: string;
                    unknownFailed: string;
                };
            };
        };
        methodSeparator: string;
    };
    dialogCommon: {
        closeButton: string;
    };
    statusDialog: {
        common: {
            logoAltText: string;
            qrCodePrompt: string;
            appLink: string;
            appLinkPrompt: string;
            showQrCodeButton: string;
            hideQrCodeButton: string;
            showAppLinkButton: string;
            hideAppLinkButton: string;
        };
        authenticator: {
            logIn: {
                title: string;
                status: {
                    sending: string;
                    pending: string;
                    approved: string;
                    declined: string;
                    timedOut: string;
                    aborted: string;
                    unknownFailed: string;
                };
            };
            register: {
                title: string;
                status: {
                    sending: string;
                    pending: string;
                    approved: string;
                    timedOut: string;
                    aborted: string;
                    unknownFailed: string;
                };
            };
        };
        webAuthn: {
            logIn: {
                title: string;
                status: {
                    pending: string;
                    approved: string;
                    declined: string;
                    timedOut: string;
                    aborted: string;
                    unknownFailed: string;
                };
            };
            register: {
                title: string;
                status: {
                    pending: string;
                    approved: string;
                    timedOut: string;
                    aborted: string;
                    unknownFailed: string;
                };
            };
        };
        emailMagicLink: {
            logIn: {
                title: string;
                status: {
                    sending: string;
                    pending: string;
                    unknownFailed: string;
                };
            };
            register: {
                title: string;
                status: {
                    sending: string;
                    pending: string;
                    unknownFailed: string;
                };
            };
        };
    };
    methodSelectorDialog: {
        prompt: {
            logIn: string;
            register: string;
        };
        methods: {
            authenticator: {
                button: string;
                text: string;
                prompt: {
                    logIn: string;
                    register: string;
                };
            };
            email: {
                button: string;
                text: string;
                prompt: {
                    logIn: string;
                    register: string;
                };
            };
            webAuthn: {
                button: string;
                text: string;
                prompt: {
                    logIn: string;
                    register: string;
                };
            };
        };
    };
}
