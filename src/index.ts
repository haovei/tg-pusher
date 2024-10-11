import { Hono } from 'hono';
import sendTGMessage from './libs/tg';

const app = new Hono();

app.get('/', (c) => {
    return c.text('Hello Pusher!');
});

app.post('/github-deployment', async (c) => {
    const { token, chatId, topicId } = c.req.query();
    const body = await c.req.json();
    const { deployment_status = {}, repository = {} } = body;
    const { state, description, environment, target_url, updated_at } = deployment_status;

    console.log('Github deployment payload:', body);

    let message = '';

    if (state === 'success') {
        message = `
👏 "${repository.full_name}" deployed to "${environment}" successfully
${target_url}
`;
    } else {
        message = `
❌ "${repository.full_name}" deployed to "${environment}" failed
${description}
`;
    }

    const res = await sendTGMessage({
        token,
        chatId,
        message,
        topicId: Number(topicId),
    });

    if (res.ok) {
        return c.text(res.message, 200);
    } else {
        return c.text(res.message, 500);
    }
});

export default app;
