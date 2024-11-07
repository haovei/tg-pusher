import { Hono } from 'hono';
import handleRoot from './handlers';
import handleGithubDeployment from './handlers/github-deployment';

const app = new Hono();

app.get('/', handleRoot);
app.post('/github-deployment', handleGithubDeployment);

export default app;
