import fastify from 'fastify';
import { authRoutes } from './controllers/auth.controller';
import { pointsRoutes } from './controllers/points.controller';
import { signinRoutes } from './controllers/signin.controller';
import { recordsRoutes } from './controllers/records.controller';
const app = fastify({ logger: true });

app.get('/health', async (_, reply) => {
    reply.send({ status: 'ok', time: new Date() });
});

app.register(async function apiPlugin(f) {
    await f.register(authRoutes);
    await f.register(pointsRoutes);
    await f.register(signinRoutes);
    await f.register(recordsRoutes);
}, { prefix: '/api' });

export default app;