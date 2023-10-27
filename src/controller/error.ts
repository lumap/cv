import { view } from "./_view";

export class error {
    async handle(error: number, msg: string) {
        return new view("Oops!")
            .display("error", error, msg);
    }
}