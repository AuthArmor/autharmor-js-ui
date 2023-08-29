export class UserNotFoundError extends Error {
    public constructor() {
        super("The specified user was not found.");
    }
}
