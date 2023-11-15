import { error } from "../controller/error";

/**
 * Sends an HTML response with the specified status and status text.
 * @param html - The HTML content to send in the response.
 * @param status - The HTTP status code to send in the response. Defaults to 200.
 * @param statusText - The HTTP status text to send in the response.
 * @returns A Response object containing the HTML content and headers.
 */
export function sendHTML(html: string, status = 200, statusText?: string) {
    return new Response(html, {
        status,
        statusText,
        headers: {
            "content-type": "text/html; charset=utf-8"
        }
    });
}

/**
 * Sends an error response with the provided error code and error message.
 * @param errorNum The error code to send.
 * @param errorMsg The error message to send.
 * @returns A promise that resolves to an HTTP response.
 */
export async function sendError(errorNum: number, errorMsg: string) {
    return await new error().handle(errorNum, errorMsg);
}