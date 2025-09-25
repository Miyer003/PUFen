import fastify, { FastifyPluginAsync } from "fastify";
import { AppDataSource } from "../config/db";
import { SignInConfig } from "../entities/SignInConfig";
import { SignInRecord } from "../entities/SignInRecord";
import { PointsAccount } from '../entities/PointsAccount';
import { PointsTransaction } from '../entities/PointsTransaction';
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
    fastify.post(
        '/signin',
        {
            preHandler: authHook
        },
        async (req, reply) => {
            // config
            const userId = req.user!.id;
            const today = new Date();

            console.log('当前用户ID:', req.user?.id);
            
            // 已签过
            today.setHours(0, 0, 0, 0);
            const exist = await AppDataSource.getRepository(SignInRecord).findOneBy({
                userId,
                signInDate: today
            });
            if (exist) return reply.status(400).send({
                success: false,
                message: '今日已签到'
            });

            // 获得本周签到配置
            const cfg = await AppDataSource.getRepository(SignInConfig).findOne({
                where: {},
                order: { createdAt: 'DESC' }
            });
            if (!cfg) return reply.status(404).send({
                success: false,
                message: '暂无配置'
            });

            // 计算积分
            const dayKeys = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
            const todayKey = dayKeys[today.getDay()-1];
            const multiplier = (cfg as any)[`day${today.getDay()}Multiplier`];
            const pointsEarned = Math.floor(cfg.basePoints * multiplier);

            // 连续签到奖励
            let hasBonus = false;
            let bonusCoupon: string | null = null;

            //
            let continuous = 0;
            let check = new Date(today);
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
            if (todayKey && cfg.bonusDay === today.getDay()) {
                hasBonus = true;
                bonusCoupon = cfg.bonusCoupon;
            }

            // 写记录
            const record = AppDataSource.getRepository(SignInRecord).create({
                userId,
                configId: cfg.id,
                signInDate: today,
                pointsEarned,
                isMakeUp: false,
                makeUpCost: null
            });
            await AppDataSource.getRepository(SignInRecord).save(record);

            // 加积分
            const accountRepo = AppDataSource.getRepository(PointsAccount);
            const account = await accountRepo.findOneBy({ userId });
            if (!account) throw new Error('积分账户不存在');

            const balanceBefore = account.balance;
            account.balance += pointsEarned;
            account.totalEarned += pointsEarned;
            await accountRepo.save(account);
            
            // 加流水
            const txRepo = AppDataSource.getRepository(PointsTransaction);
            await txRepo.save(
                txRepo.create({
                    userId,
                    accountId: (await account).id,
                    amount: pointsEarned,
                    type: 'earn',
                    source: 'signin',
                    relatedId: record.id,
                    description: `${cfg.basePoints}×${multiplier} 签到`,
                    balanceBefore,
                    balanceAfter: (await account).balance
                })
            );

            reply.send({
                success: true,
                data: {
                    pointsEarned,
                    continuousDays: continuous + 1,
                    hasBonus,
                    bonusCoupon,
                },
            });



        }
    );

    fastify.post(
        '/signin/makeup', 
        { 
            preHandler: authHook
        },
        async (req, reply) => {
            const userId = req.user!.id;
            const { date, method } = req.body as { date: string; method: 'points' | 'order' };

            // 只能补过去7天
            const target = new Date(date);
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            const sevenDaysAgo = new Date(now);
            sevenDaysAgo.setDate(now.getDate() - 7);
            if (target < sevenDaysAgo || target >= now) {
                return reply.status(400).send({ 
                    success: false,
                    message: '只能补签过去7天内'
                });
            }

            // 已签
            const exist = await AppDataSource.getRepository(SignInRecord).findOneBy({
                userId,
                signInDate: target,
            });
            if (exist) return reply.status(400).send({
                success: false,
                message: '该日期已签到'
            });

            // 取配置
            const cfg = await AppDataSource.getRepository(SignInConfig).findOne({
                where: {},
                order: { createdAt: 'DESC' },
            });
            if (!cfg) return reply.status(404).send({
                success: false,
                message: '暂无配置'
            });

            // points方式扣积分
            let pointsCost = 0;
            if (method === 'points') {
                pointsCost = 5;
                const accountRepo = AppDataSource.getRepository(PointsAccount);
                const account = await accountRepo.findOneBy({ userId });
                if (!account) throw new Error('积分账户不存在');
                if (account.balance < pointsCost) {
                return reply.status(400).send({ success: false, message: '积分不足' });
                }

                const balanceBefore = account.balance;
                account.balance -= pointsCost;
                account.totalUsed += pointsCost;
                await accountRepo.save(account);

                // 支出流水
                await AppDataSource.getRepository(PointsTransaction).save(
                    AppDataSource.getRepository(PointsTransaction).create({
                        userId,
                        accountId: account.id,
                        amount: -pointsCost,
                        type: 'use',
                        source: 'makeup',
                        relatedId: '', // 先空，后面补记录 ID
                        description: '补签消耗 5 积分',
                        balanceBefore,
                        balanceAfter: account.balance,
                    })
                );
            }

            // 算积分（同正常签到倍数）
            const dayKeys = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
            const targetKey = dayKeys[target.getDay() - 1];
            const multiplier = (cfg as any)[`day${target.getDay()}Multiplier`];
            const pointsEarned = Math.floor(cfg.basePoints * multiplier);

            // 写补签记录
            const record = AppDataSource.getRepository(SignInRecord).create({
                userId,
                configId: cfg.id,
                signInDate: target,
                pointsEarned,
                isMakeUp: true,
                makeUpCost: method === 'points' ? pointsCost : (method === 'order' ? null : null),
            });
            await AppDataSource.getRepository(SignInRecord).save(record);

            // 更新流水 relatedId（补填）
            if (method === 'points') {
                await AppDataSource.getRepository(PointsTransaction).update(
                { userId, source: 'makeup', relatedId: '' },
                { relatedId: record.id }
                );
            }

            // 返回结果
            reply.send({
                success: true,
                data: {
                pointsEarned,
                pointsCost: method === 'points' ? pointsCost : null,
                bonusCoupon: null, // 补签不发券
                },
            });
        });
    }