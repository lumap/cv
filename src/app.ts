import { Server } from "bun";
import { existsSync } from "fs";
import { getType } from "mime";
import { routes } from "./utils/routes";
import { watch } from "chokidar";
import { sendError } from "./utils/sendResponse";

async function handleRequest(request: Request, server: Server): Promise<Response> {
    const urlMatch = request.url.match(`https{0,1}:\/\/([a-z]{0,255})?\.?(${Bun.env.DOMAIN}|localhost:${Bun.env.PORT})\/?(.{0,10000})?`);
    // match[0] = req.url
    // match[1] = subdomain or undefined
    // match[2] = domain or "localhost:port"
    // match[3] = which page is being accessed or ''
    if (!urlMatch) {
        return sendError(418, "Don't be silly!"); // never supposed to happen but whatever
    }
    const pathAccessed = "/" + (urlMatch[3]?.split("?")[0] || "");
    if (pathAccessed.includes(".") && existsSync(`./src/assets${pathAccessed}`)) {
        const fileContent = await Bun.file(`./src/assets${pathAccessed}`).text();
        return new Response(fileContent, {
            headers: {
                "content-type": getType(`./src/assets${pathAccessed}`)!
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

function generateDate(): string {
    const currentDate = new Date(Date.now() + 2 * 60 * 60000);
    let formattedDate = currentDate.toISOString().replace('T', ' ').replace('Z', '');
    return formattedDate;
}

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