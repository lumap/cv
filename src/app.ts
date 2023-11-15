import { Server } from "bun";
import { existsSync } from "fs";
import { routes } from "./utils/routes";
import { watch } from "chokidar";
import { sendError } from "./utils/sendResponse";

async function handleRequest(request: Request, server: Server): Promise<Response> {
    const urlMatch = request.url.match(`https{0,1}:\/\/([a-z]{0,255})?\.?(${Bun.env.DOMAIN}|localhost:${Bun.env.PORT})\/?(.{0,10000})?`);
    if (!urlMatch) {
        return sendError(418, "Don't be silly!"); // never supposed to happen but whatever
    }
    const pathAccessed = "/" + (urlMatch[3]?.split("?")[0] || "");
    if (pathAccessed.includes(".") && existsSync(`./src/assets${pathAccessed}`)) {
        const fileContent = Bun.file(`./src/assets${pathAccessed}`);
        console.log(fileContent);
        return new Response(fileContent, {
            headers: {
                "content-type": fileContent.type,
                "Access-Control-Allow-Origin": "*"
            }
        });
    }
    const route = routes.find(r => r.path === pathAccessed);
    if (!route) {
        logHTTPRequest(404, request, server);
        return sendError(404, "Page Not Found");
    }
    try {
        const contFile = await import(`./controller/${route.controller}`);
        logHTTPRequest(200, request, server);
        return await new contFile[route.controller]()[route.function](request, server) as Promise<Response>;
    } catch (err) {
        console.log(err);
        return sendError(500, JSON.stringify(err));
    }
}

/**
 * Generates a formatted date string with a 2 hour offset from the current date.
 * @returns {string} The formatted date string.
 */
function generateDate(): string {
    const currentDate = new Date(Date.now() + 2 * 60 * 60000);
    let formattedDate = currentDate.toISOString().replace('T', ' ').replace('Z', '');
    return formattedDate;
}

/**
 * Logs an HTTP request with its status, request and server information.
 * @param status - The status of the HTTP request.
 * @param req - The HTTP request object.
 * @param s - The server object.
 */
function logHTTPRequest(status: number, req: Request, s: Server) {
    console.log(`[Server at ${generateDate()}] - ${s.requestIP(req)?.address || "No IP"} "${req.url}" ${status}`);
};

Bun.serve({
    port: 80,
    fetch: handleRequest
});

watch("./", {
    persistent: true
}).on("change", () => {
    process.exit(0);
});