import { ITranslationTable } from "./ITranslationTable";

export type IncludedLanguages = "en-US";

export const translationTables: Record<IncludedLanguages, ITranslationTable> = {
    "en-US": {
        form: {
            actions: {
                logIn: {
                    tabName: "Log in",
                    usernameless: {
                        title: "Sign in with app.",
                        description: {
                            appLink: "Click the button to open the Auth Armor app.",
                            qrCode: "Scan the code below with the Auth Armor app."
                        },
                        verificationCode: (verificationCode) => [
                            "Your verification code is ",
                            verificationCode,
                            "."
                        ],
                        retry: "Try again"
                    },
                    username: {
                        title: "Sign in with username or email.",
                        fields: {
                            username: {
                                label: "Username or email address"
                            }
                        },
                        submit: "Continue"
                    },
                    prompt: (username) => ["Authenticating as ", username, "."]
                },
                register: {
                    tabName: "Register",
                    username: {
                        title: "Sign up.",
                        fields: {
                            username: {
                                label: "Username or email address"
                            }
                        },
                        submit: "Continue"
                    },
                    prompt: (username) => ["Registering as ", username, "."]
                }
            },
            back: "Back",
            methods: {
                prompt: "Select authentication method.",
                authenticator: {
                    label: "Authenticator app",
                    description:
                        "Receive a push notification or scan a QR code using your Auth Armor app."
                },
                magicLinkEmail: {
                    label: "Magic link email",
                    description: "Receive an email with a link to authenticate yourself."
                },
                passkey: {
                    label: "Passkey",
                    description:
                        "Sign in using your browser’s built-in secure authentication mechanism."
                }
            },
            prompts: {
                authenticator: {
                    logIn: {
                        title: "Authenticate with authenticator app.",
                        description: {
                            qrCode: "We’ve sent a push notification to your authenticator app. If that’s not working, you can scan the code below instead.",
                            appLink:
                                "We’ve sent a push notification to your authenticator app. If that’s not working, you can click the button below instead."
                        }
                    },
                    register: {
                        title: "Register with authenticator app.",
                        description: {
                            qrCode: "Scan the code below with your phone. We’ll prompt you to download the Auth Armor app if it isn’t already installed.",
                            appLink:
                                "Click the button below. We’ll prompt you to download the Auth Armor app if it isn’t already installed."
                        }
                    }
                },
                magicLinkEmail: {
                    logIn: {
                        title: "Authenticate with magic link email.",
                        description: "We’ve sent you an email with a link to log you in.",
                        outOfBandCompletionInfo: "You’ve logged in on a different tab or window."
                    },
                    register: {
                        title: "Register with magic link email.",
                        description: "We’ve sent you an email with a link to register you.",
                        outOfBandCompletionInfo: "You’ve registered on a different tab or window."
                    }
                },
                passkey: {
                    logIn: {
                        title: "Authenticate with passkey.",
                        description:
                            "Please check your browser or security device for instructions."
                    },
                    register: {
                        title: "Register with passkey.",
                        description:
                            "Please check your browser or security device for instructions."
                    }
                },
                wait: {
                    title: "Please wait.",
                    description: "We’re processing your request."
                },
                captcha: {
                    title: "Verification needed.",
                    description:
                        "We need to make sure you’re not a robot."
                }
            },
            errors: {
                usernamelessLogIn: {
                    declined: "You declined the request.",
                    network: "A network error occurred. Please check the console.",
                    unknown: "An unknown error occurred. The console may have further details."
                },
                usernameLogIn: {
                    userNotFound: "The requested user does not exist.",
                    noAvailableMethods: "There are no available methods for the user.",
                    network: "A network error occurred. Please check the console.",
                    unknown: "An unknown error occurred. The console may have further details."
                },
                usernameRegister: {
                    userAlreadyExists: "This username is already taken.",
                    noAvailableMethods: "There are no available methods to use.",
                    network: "A network error occurred. Please check the console.",
                    unknown: "An unknown error occurred. The console may have further details."
                },
                authenticator: {
                    timedOut: "The request timed out.",
                    declined: "You declined the request.",
                    network: "A network error occurred. Please check the console.",
                    unknown: "An unknown error occurred. The console may have further details."
                },
                magicLinkEmail: {
                    network: "A network error occurred. Please check the console.",
                    unknown: "An unknown error occurred. The console may have further details."
                },
                passkey: {
                    declined: "You declined the request.",
                    network: "A network error occurred. Please check the console.",
                    unknown: "An unknown error occurred. The console may have further details."
                }
            }
        }
    }
};

export const defaultTranslationTable = translationTables["en-US"];
