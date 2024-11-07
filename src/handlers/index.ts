import { Context } from 'hono';

const handleRoot = (c: Context) => {
    return c.text('Hello Pusher!');
};

export default handleRoot;
