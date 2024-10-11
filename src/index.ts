import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) => {
    return c.text('Hello !');
});

app.get('/github-deployment', (c) => {
    return c.text('Hello github-deployment !');
});

export default app;
