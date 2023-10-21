import { base } from "./base";
import { view } from "./view";

export class index extends base {
    public async handle() {
        const v = new view("CV");
        return await v.display("index");
    }
}