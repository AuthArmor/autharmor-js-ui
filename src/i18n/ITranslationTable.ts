export interface ITranslationTable {
    form: {
        actions: {
            logIn: {
                tabName: string;
                usernameless: {
                    title: string;
                    description: {
                        qrCode: string;
                        appLink: string;
                    };
                    verificationCode: <TVerificationCode>(
                        verificationCode: TVerificationCode
                    ) => (string | TVerificationCode)[];
                    retry: string;
                };
                username: {
                    title: string;
                    fields: {
                        username: {
                            label: string;
                        };
                    };
                    submit: string;
                };
                methodButtons: {
                    usernameless: string;
                    username: string;
                };
                prompt: <TUsername>(usernameToken: TUsername) => (string | TUsername)[];
            };
            register: {
                tabName: string;
                username: {
                    title: string;
                    fields: {
                        username: {
                            label: string;
                        };
                    };
                    submit: string;
                };
                prompt: <TUsername>(usernameToken: TUsername) => (string | TUsername)[];
            };
        };
        back: string;
        methods: {
            prompt: string;
            authenticator: {
                label: string;
                description: string;
            };
            magicLinkEmail: {
                label: string;
                description: string;
            };
            passkey: {
                label: string;
                description: string;
            };
        };
        prompts: {
            authenticator: {
                logIn: {
                    title: string;
                    description: {
                        qrCode: string;
                        appLink: string;
                    };
                };
                register: {
                    title: string;
                    description: {
                        qrCode: string;
                        appLink: string;
                    };
                };
            };
            magicLinkEmail: {
                logIn: {
                    title: string;
                    description: string;
                    outOfBandCompletionInfo: string;
                };
                register: {
                    title: string;
                    description: string;
                    outOfBandCompletionInfo: string;
                };
            };
            passkey: {
                logIn: {
                    title: string;
                    description: string;
                };
                register: {
                    title: string;
                    description: string;
                };
            };
            wait: {
                title: string;
                description: string;
            };
            captcha: {
                title: string;
                description: string;
            };
        };
        errors: {
            usernamelessLogIn: {
                declined: string;
                network: string;
                unknown: string;
            };
            usernameLogIn: {
                userNotFound: string;
                noAvailableMethods: string;
                network: string;
                unknown: string;
            };
            usernameRegister: {
                userAlreadyExists: string;
                noAvailableMethods: string;
                network: string;
                unknown: string;
            };
            authenticator: {
                timedOut: string;
                declined: string;
                network: string;
                unknown: string;
            };
            magicLinkEmail: {
                network: string;
                unknown: string;
            };
            passkey: {
                declined: string;
                network: string;
                unknown: string;
            };
            recover: string;
        };
    };
}
