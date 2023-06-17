import { ITranslationTable } from "./ITranslationTable";

export type IncludedLanguages = "en-US";

export const translationTables: Record<IncludedLanguages, ITranslationTable> = {
    "en-US": {
        form: {
            logIn: {
                tab: "Log in",
                authenticatorApp: {
                    prompt: "Sign in using the Auth Armor Authenticator app",
                    appLink: "Log in with app",
                    appLinkLoading: "Please wait",
                    qrCodePrompt: "Scan this QR code using the app to sign in",
                    verificationCodeMessage: (verificationCode: string) =>
                        `Your verification code is ${verificationCode}`,
                    successMessage: "Approved",
                    retryButton: "Try again",
                    errors: {
                        declined: "Request declined.",
                        internalFailed: "Communication error, please check console.",
                        unknownFailed: "Failed."
                    }
                },
                username: {
                    prompt: "Sign in with your username",
                    logInButton: "Log in",
                    errors: {
                        usernameNotProvided: "Username must be specified.",
                        noMethodsAvailable: "No authentication methods are available.",
                        declined: "Request declined.",
                        timedOut: "Timed out.",
                        aborted: "Aborted.",
                        internalFailed: "Communication error, please check console.",
                        unknownFailed: "Failed."
                    }
                }
            },
            register: {
                tab: "Register",
                username: {
                    prompt: "Register with a username",
                    registerButton: "Register",
                    errors: {
                        usernameNotProvided: "Username must be specified.",
                        timedOut: "Timed out.",
                        aborted: "Aborted.",
                        internalFailed: "Communication error, please check console.",
                        unknownFailed: "Failed."
                    }
                }
            },
            methodSeparator: "Or"
        },
        dialogCommon: {
            closeButton: "Close"
        },
        statusDialog: {
            common: {
                logoAltText: "Auth Armor logo",
                qrCodePrompt: "Please scan the QR code with your device",
                appLinkPrompt: "Please click the button to open or download the AuthArmor app",
                appLink: "Open in app",
                showQrCodeButton: "Scan a QR code instead",
                hideQrCodeButton: "Hide QR code",
                showAppLinkButton: "Show button to open app",
                hideAppLinkButton: "Hide app button"
            },
            authenticator: {
                logIn: {
                    title: "We've sent a push message to your device(s)",
                    status: {
                        sending: "Sending",
                        pending: "Please check your device",
                        approved: "Approved",
                        declined: "Declined",
                        timedOut: "Timed out",
                        aborted: "Aborted",
                        unknownFailed: "Failed"
                    }
                },
                register: {
                    title: "We're making a link to register your device",
                    status: {
                        sending: "Please wait",
                        pending: "Register on device",
                        approved: "Registered",
                        timedOut: "Timed out",
                        aborted: "Aborted",
                        unknownFailed: "Failed"
                    }
                }
            },
            webAuthn: {
                logIn: {
                    title: "We've sent an authentication request to your device",
                    status: {
                        pending: "Authenticate on device",
                        approved: "Approved",
                        declined: "Declined",
                        timedOut: "Timed out",
                        aborted: "Aborted",
                        unknownFailed: "Failed"
                    }
                },
                register: {
                    title: "We've sent a registration request to your device",
                    status: {
                        pending: "Register on device",
                        approved: "Registered",
                        timedOut: "Timed out",
                        aborted: "Aborted",
                        unknownFailed: "Failed"
                    }
                }
            },
            magicLinkEmail: {
                logIn: {
                    title: "We've sent you an email magic link to log you in",
                    status: {
                        sending: "Sending",
                        pending: "Please check your email",
                        unknownFailed: "Failed"
                    }
                },
                register: {
                    title: "We've sent you an email magic link to register yourself",
                    status: {
                        sending: "Sending",
                        pending: "Please check your email",
                        unknownFailed: "Failed"
                    }
                }
            }
        },
        methodSelectorDialog: {
            prompt: {
                logIn: "Please select your authentication method.",
                register: "Please select your registration method."
            },
            methods: {
                authenticator: {
                    button: "Authenticator App",
                    text: "Mobile Phone Biometrics",
                    prompt: {
                        logIn: "Log in with your mobile device",
                        register: "Register your mobile device"
                    }
                },
                email: {
                    button: "Email",
                    text: "Email Magic Link",
                    prompt: {
                        logIn: "Send an email link to log in",
                        register: "Send an email link for registration"
                    }
                },
                webAuthn: {
                    button: "WebAuthn",
                    text: "WebAuthn",
                    prompt: {
                        logIn: "Log in using WebAuthn or Passkey",
                        register: "Register using WebAuthn or Passkey"
                    }
                }
            }
        }
    }
};

export const defaultTranslationTable = translationTables["en-US"];
