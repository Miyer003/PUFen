import fastify from 'fastify';
import { AppDataSource } from './config/db';
import { authMiddleware } from './middleware/auth';
import { authRoutes } from './controllers/auth.controller';
import { pointsRoutes } from './controllers/points.controller';

const app = fastify({ logger: true });

app.get('/health', async (_, reply) => {
    reply.send({ status: 'ok', time: new Date() });
});

app.register(async function apiPlugin(f) {
    f.register(authMiddleware);
    f.register(authRoutes);
    f.register(pointsRoutes);
}, { prefix: '/api' });


const start = async () => {
    try {
        await AppDataSource.initialize();
        console.log('数据库连接成功');
    } catch (err) {
        console.log('数据库连接失败', err);
        process.exit(1);
    }
};

start();
export default app;