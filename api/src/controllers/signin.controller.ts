import fastify, { FastifyPluginAsync } from "fastify";
import { AppDataSource } from "../config/db";
import { SignInConfig } from "../entities/SignInConfig";
import { authHook } from "../middleware/auth.hook";

export const signinRoutes: FastifyPluginAsync = async (fastify) => {
    fastify.get(
        '/signin/config',
        {
            preHandler: authHook
        },
        async (req, reply) => {
            const cfg = await AppDataSource.getRepository(SignInConfig).findOne({
                where: {},
                order: { createdAt: 'DESC'}
            });

            if (!cfg) return reply.status(404).send({
                success: false,
                message: '暂无配置'
            });

            reply.send({
                success: true,
                data: cfg
            });
        }
    );
}