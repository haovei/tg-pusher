import { Context } from 'hono';
import sendTGMessage from '../libs/tg';

const handleGithubDeployment = async (c: Context) => {
    const { token, chatId, topicId } = c.req.query();
    const body = await c.req.json();
    const { deployment_status, repository = {} } = body;
    const { state, description, environment, target_url, updated_at } = deployment_status ?? {};

    if (!deployment_status) {
        return c.text('Pong', 200);
    }

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
};

export default handleGithubDeployment;
