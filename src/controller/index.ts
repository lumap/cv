import { Server } from "bun";
import { view } from "./_view";
import { sendError } from "../utils/sendResponse";

export class index {

    /**
     * Handles the incoming request and returns the appropriate response.
     * @param request - The incoming request object.
     * @param server - The server object.
     * @returns A Promise that resolves to the response object.
     */
    async handle(request: Request, server: Server) {
        if (request.url.split("?")[1] !== "access_token=" + Bun.env.CV_ACCESS_TOKEN) {
            return sendError(404, "Page Not Found!");
        }
        return new view("CV").display("index");
    }
}
