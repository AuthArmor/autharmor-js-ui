export class ErrorThrownEvent extends Event {
    constructor(public readonly error: unknown) {
        super("error");
    }
}
