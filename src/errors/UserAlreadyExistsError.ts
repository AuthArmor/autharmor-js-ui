export class UserAlreadyExistsError extends Error {
    public constructor() {
        super("The specified user already exists.");
    }
}
