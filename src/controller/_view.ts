import { renderFile } from "ejs";
import langs from "../private_assets/langs";
import { sendHTML } from "../utils/sendResponse";

export class view {
    private vars: Map<string, any> = new Map();

    constructor(headTitle: string) {
        this.vars.set("headTitle", `${headTitle} - CHRTN`);
        this.vars.set("langs", langs);
        this.vars.set("selected", "fr");
    }

    set(varName: string, varValue: any) {
        this.vars.set(varName, varValue);
        return this;
    }

    async display(fileName: string, status = 200, message = "OK") {
        this.vars.set("status", status);
        this.vars.set("message", message);
        const obj: { [key: string]: any; } = {};
        this.vars.forEach((value, key) => {
            obj[key] = value;
        });
        return sendHTML(await renderFile(`src/view/${fileName}.ejs`, obj));
    }
}