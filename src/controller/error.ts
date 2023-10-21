import { base } from "./base";
import { view } from "./view";

export class error extends base {
    async handle(error: number, msg: string) {
        return new view("Oops!")
            .setVar("error", error)
            .setVar("msg", msg)
            .display("error");
    }
}