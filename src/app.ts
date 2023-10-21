Bun.serve({
    port: Bun.env.PORT,
    fetch(request, server) {
        return new Response("Hello World!");
    }
});