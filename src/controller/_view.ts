import { renderFile } from "ejs";
import langs from "../private_assets/langs";
import { sendHTML } from "../utils/sendResponse";

export class view {
    private vars: Map<string, any> = new Map();

    /**
     * Constructs a new instance of the View class.
     * @param headTitle - The title of the page.
     */
    constructor(headTitle: string) {
        this.vars.set("headTitle", `${headTitle} - CHRTN`);
        this.vars.set("langs", langs);
        this.vars.set("selected", "fr");
    }

    /**
     * Sets the value of a variable in the view.
     * @param varName - The name of the variable.
     * @param varValue - The value of the variable.
     */
    set(varName: string, varValue: any) {
        this.vars.set(varName, varValue);
        return this;
    }

    /**
     * Displays the specified file with the given status and message.
     * @param fileName - The name of the file to display.
     * @param status - The HTTP status code to send. Defaults to 200.
     * @param message - The message to send. Defaults to "OK".
     * @returns A Promise that resolves with the HTML content of the rendered file.
     */
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