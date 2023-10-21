import { renderFile } from "ejs";

export class view {
    private vars: Map<string, any> = new Map();

    constructor(headTitle: string) {
        this.vars.set("headTitle", `${headTitle} - CHRTN`);
    }

    public setVar(varName: string, varValue: any) {
        this.vars.set(varName, varValue);
        return this;
    }

    public async display(fileName: string) {
        const obj: { [key: string]: any; } = {};
        this.vars.forEach((value, key) => {
            obj[key] = value;
        });
        return await renderFile(`src/view/${fileName}.ejs`, obj);
    }
}