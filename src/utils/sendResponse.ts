import { error } from "../controller/error";

export function sendHTML(html: string, status = 200, statusText?: string) {
    return new Response(html, {
        status,
        statusText,
        headers: {
            "content-type": "text/html; charset=utf-8"
        }
    });
}

export async function sendError(errorNum: number, errorMsg: string) {
    return await new error().handle(errorNum, errorMsg);
}