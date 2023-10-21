import { Server } from "bun";
import { existsSync } from "fs";
import { getType } from "mime";
import { routes } from "./routes";
import { error } from "./controller/error";

function sendHTML(html: string, status = 200, statusText?: string) {
    return new Response(html, {
        status,
        statusText,
        headers: {
            "content-type": "text/html; charset=utf-8"
        }
    });
}

async function sendError(errorNum: number, errorMsg: string) {
    return sendHTML(await new error().handle(errorNum, errorMsg), errorNum, errorMsg);
}

async function handleRequest(request: Request, server: Server): Promise<Response> {
    const urlMatch = request.url.match(`https{0,1}:\/\/([a-z]{0,255})?\.?(${Bun.env.DOMAIN}|localhost:${Bun.env.PORT})\/?(.{0,10000})?`);
    // match[0] = req.url
    // match[1] = subdomain or undefined
    // match[2] = domain or "localhost:port"
    // match[3] = which page is being accessed or ''
    if (!urlMatch) {
        return sendError(418, "Don't be silly!"); // never supposed to happen but whatever
    }
    const pathAccessed = urlMatch[3]?.split("?")[0] || "/";
    if (existsSync(`./public/${pathAccessed}`)) {
        const fileContent = await Bun.file(`./public/${pathAccessed}`).text();
        return new Response(fileContent, {
            headers: {
                "content-type": getType(`./public/${pathAccessed}`)!
            }
        });
    }
    const route = routes.find(r => r.path === pathAccessed);
    if (!route) {
        return sendError(404, "Page Not Found");
    }
    try {
        const contFile = require(`./controller/${route.controller}`);
        return sendHTML(await new contFile[route.controller]()[route.function]());
    } catch (err) {
        console.log(err);
        return sendError(500, JSON.stringify(err));
    }
}

Bun.serve({
    port: 80,
    fetch: handleRequest
});
console.log("Server started!");