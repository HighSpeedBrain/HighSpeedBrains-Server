import { Hono } from 'hono';
const app = new Hono();
app.get('/', (c) => {
    return c.text('Hello Hono!');
});
Bun.serve({
    hostname: "0.0.0.0",
    port: 8080,
    fetch: app.fetch,
});
