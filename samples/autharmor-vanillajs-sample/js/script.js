const { AuthArmorClient } = authArmor;

var frontendBaseUrl = `${window.location.protocol}//${window.location.host}`;
var backendBaseUrl = "[Backend base URL]";

var authArmorClientConfig = {
    clientSdkApiKey: "[Client SDK API key]",
    webAuthnClientId: "[WebAuthn client ID]"
};

var authArmorInteractiveConfig = {
    defaultEmailMagicLinkLogInRedirectUrl: `${frontendBaseUrl}/`,
    defaultEmailMagicLinkRegisterRedirectUrl: `${frontendBaseUrl}/`
};

var authArmorClient = new AuthArmorClient(authArmorClientConfig);

async function handleLogIn({ authenticationResult }) {
    const token = await fetchTokenFromAuthentication(authenticationResult);
    saveAuthToken(token);

    window.location.href = "/";
}

async function handleRegister({ registrationResult }) {
    const token = await fetchTokenFromRegistration(registrationResult);
    saveAuthToken(token);

    window.location.href = "/";
}

async function handleRegisterWithMagicLinkEmail(validationToken) {
    const token = await claimMagicLinkEmailRegistration(validationToken);
    saveAuthToken(token);

    window.location.href = "/";
}

async function fetchTokenFromAuthentication(authenticationResult) {
    const response = await fetch(`${backendBaseUrl}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(authenticationResult)
    });

    const { token } = await response.json();

    return token;
}

async function fetchTokenFromRegistration(registrationResult) {
    const response = await fetch(`${backendBaseUrl}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(registrationResult)
    });

    const { token } = await response.json();

    return token;
}

async function claimMagicLinkEmailRegistration(validationToken) {
    const response = await fetch(`${backendBaseUrl}/auth/register-magic-link`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            validationToken
        })
    });

    const { token } = await response.json();

    return token;
}

function saveAuthToken(authToken) {
    window.localStorage.setItem("app-auth-token", authToken);
}

async function logOut() {
    window.localStorage.removeItem("app-auth-token");

    window.location.reload();
}

function getAuthToken() {
    return window.localStorage.getItem("app-auth-token");
}

function isLoggedIn() {
    return getAuthToken() !== null;
}

async function getGreeting() {
    const token = getAuthToken();

    const greeting = await getGreetingWithToken(token);
    return greeting;
}

async function getGreetingWithToken(token) {
    const response = await fetch(`${backendBaseUrl}/greeting`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const { message } = await response.json();

    return message;
}

window.addEventListener("load", () => {
    const navbarToggler = document.getElementById("navbar-toggler");
    const navbarMenu = document.getElementById("navbar-menu");

    navbarToggler.addEventListener("click", () => {
        navbarToggler.classList.toggle("is-active");
        navbarMenu.classList.toggle("is-active");
    });
});
