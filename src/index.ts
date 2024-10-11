import { Hono } from 'hono';
import sendTGMessage from './libs/tg';

const app = new Hono();

app.get('/', (c) => {
    return c.text('Hello Pusher!');
});

app.post('/github-deployment', async (c) => {
    const { token, chatId } = c.req.query();
    const body = await c.req.json();

    const res = await sendTGMessage({
        token,
        chatId,
        message: 'Github deployment success !',
    });

    if (res.ok) {
        return c.text(res.message, 200);
    } else {
        return c.text(res.message, 500);
    }
});

export default app;
