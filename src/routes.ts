export const routes = [
    {
        path: "/",
        controller: "index",
        function: "handle"
    },
    {
        path: Bun.env.ADMIN_DIR,
        controller: "admin",
        function: "login"
    }
];