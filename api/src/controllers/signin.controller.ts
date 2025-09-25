import fastify, { FastifyPluginAsync } from "fastify";
import { AppDataSource } from "../config/db";
import { SignInConfig } from "../entities/SignInConfig";
import { SignInRecord } from "../entities/SignInRecord";
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
    fastify.get(
        '/signin/status',
        {
            preHandler: authHook
        },
        async (req, reply) => {
            // config
            const userId = req.user!.id;

            const now = new Date();
            now.setHours(0, 0, 0, 0);

            const day = now.getDay();
            const diff = day === 0 ? -6 : 1 - day;
            
            const monday = new Date(now);
            monday.setDate(now.getDate() + diff);
            const sunday = new Date(monday);
            sunday.setDate(monday.getDate() + 6);

            // todaySigned
            const todaySigned = !!(await 
                AppDataSource.getRepository(SignInRecord).findOneBy({
                    userId,
                    signInDate: now
                }));

            // continuousDays
            let continuous = 0;
            let check = new Date(now);
            check.setDate(check.getDate() - 1);
            while (true) {
                const hit = await 
                    AppDataSource.getRepository(SignInRecord).findOneBy({
                        userId,
                        signInDate: check
                    });
                if (!hit) break;
                continuous++;
                check.setDate(check.getDate() - 1);    
            }

            // weekStatus
            const weekStatus = [];
            for (let i = 0; i < 7; i++) {
                const d = new Date(monday);
                d.setDate(monday.getDate() + i);
                const record = await
                    AppDataSource.getRepository(SignInRecord).findOneBy({
                        userId,
                        signInDate: d,
                    });
                const isToday = d.toDateString() === now.toDateString();
                const canMakeUp = !record && d < now; // 过去且未签
                weekStatus.push({
                    date: d.toISOString().slice(0, 10),
                    signed: !!record,
                    points: record?.pointsEarned || 0,
                    isToday,
                    canMakeUp,
                });
            }

            reply.send({
                success: true,
                data: {
                    todaySigned,
                    continuousDays: todaySigned ? continuous + 1 : 0,
                    weekStatus,
                }
            });
        }
    );
}