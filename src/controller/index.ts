import { Server } from "bun";
import { view } from "./_view";
import { sendError } from "../utils/sendResponse";

export class index {
    async handle(request: Request, server: Server) {
        if (request.url.split("?")[1] !== "access_token=" + Bun.env.CV_ACCESS_TOKEN) {
            return sendError(404, "Page Not Found!");
        }
        return new view("CV").display("index");
    }
}