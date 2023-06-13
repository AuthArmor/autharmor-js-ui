export class NoAuthenticationMethodsAvailableError extends Error {
    public constructor() {
        super("No methods are available for this user.");
    }
}
