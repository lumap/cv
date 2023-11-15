import { view } from "./_view";

export class error {

    /**
     * Handles an error with a given error code and message.
     * @param error - The error code.
     * @param msg - The error message.
     * @returns A view displaying the error.
     */
    async handle(error: number, msg: string) {
        return new view("Oops!")
            .display("error", error, msg);
    }

}