import { FastifyPluginAsync } from "fastify";
import { authHook } from "../middleware/auth.hook";
import { AppDataSource } from "../config/db";
import { RewardItem } from "../entities/RewardItem";
import { PointsAccount } from "../entities/PointsAccount";
import { PointsTransaction } from "../entities/PointsTransaction";
import { RewardRecord } from "../entities/RewardRecord";

export const rewardRoutes: FastifyPluginAsync = async (fastify) => {
    fastify.get(
        '/rewards',
        {
            preHandler: authHook
        },
        async (req, reply) => {
            const userId = req.user!.id;
            const { stage, isLimited, page = 1, limit = 20 } = req.query as {
                stage?: 1 | 2,
                isLimited?: boolean | string,
                page?: number,
                limit?: number
            };
            const pageNum = Number(page);
            const limitNum = Number(limit);
            
            // SQLite Boolean 1/0 转换为 Boolean true/false
            let isLimitedFilter: boolean | undefined = undefined;
            if (isLimited !== undefined) {
                if (typeof isLimited === 'string') {
                    isLimitedFilter = isLimited === 'true';
                } else {
                    isLimitedFilter = Boolean(isLimited);
                }
            }

            // 解锁阶段
            const exchangedCount = await AppDataSource.getRepository(RewardRecord)
                .createQueryBuilder('rr')
                .where('rr.userId = :userId', {userId})
                .getCount();
            const unlockedStage = exchangedCount >= 3 ? 2 : 1;
            const stageFilter = Number(stage) || unlockedStage;
            if (Number(stage) && Number(stage) > unlockedStage) {
                return reply.status(403).send({
                    success: false,
                    message: '该阶段尚未解锁'
                });
            }

            const repo = AppDataSource.getRepository(RewardItem);
            
            let queryBuilder = repo.createQueryBuilder('item')
                .where('item.stage = :stage', { stage: stageFilter })
                .orderBy('item.pointsCost', 'ASC');
                
            // 如果指定了 isLimited 参数，则添加过滤条件
            if (isLimitedFilter !== undefined) {
                queryBuilder = queryBuilder.andWhere('item.isLimited = :isLimited', { isLimited: isLimitedFilter });
            }
            
            queryBuilder = queryBuilder
                .skip((pageNum - 1) * limitNum)
                .take(limitNum);

            const [items, total] = await queryBuilder.getManyAndCount();

            if (items.length === 0) {
                return reply.send({
                    success: true,
                    data: {
                        items: [],
                        currentStage: stageFilter,
                        stage2Unlocked: stageFilter === 2,
                        message: '暂无可兑换商品',
                    }
                });
            }

            reply.send({
                success: true,
                data: {
                    items: items.map(item => ({
                        id: item.id,
                        name: item.name,
                        description: item.description,
                        pointsCost: item.pointsCost,
                        couponType: item.couponType,
                        couponValue: item.couponValue,
                        conditionAmount: item.conditionAmount,
                        stock: item.stock,
                        stage: item.stage,
                        isLimited: item.isLimited
                    })),
                    currentStage: stageFilter,
                    stage2Unlocked: stageFilter === 2
                }
            });
        }
    );

    fastify.post(
        '/rewards/exchange',
        {
            preHandler: authHook
        },
        async (req, reply) => {
            const userId = req.user!.id;
            const { rewardItemId } = req.body as { rewardItemId: string };
            
            // 商品是否存在
            const itemRepo = AppDataSource.getRepository(RewardItem);
            const item = await itemRepo.findOneBy({ id: rewardItemId });
            if (!item || item.stock <= 0) {
                return reply.status(404).send({
                    success: false,
                    message: '商品不存在或告罄'
                });
            }
            
            // 获取积分账户
            const accountRepo = AppDataSource.getRepository(PointsAccount);
            const account = await accountRepo.findOneBy({ userId });
            if (!account) {
                return reply.status(404).send({
                    success: false,
                    message: '积分账户不存在'
                });
            }
            
            if (account.balance < item.pointsCost) {
                return reply.status(400).send({
                    success: false,
                    message: '积分不足'
                });
            }
            
            // 成功兑换 -> 扣积分，加流水
            const balanceBefore = account.balance;
            account.balance -= item.pointsCost;
            account.totalUsed += item.pointsCost;
            await accountRepo.save(account);

            await AppDataSource.getRepository(PointsTransaction).save(
                AppDataSource.getRepository(PointsTransaction).create({
                    userId,
                    accountId: account.id,
                    amount: -item.pointsCost,
                    type: 'use',
                    source: 'reward',
                    relatedId: item.id,
                    description: `${item.pointsCost} 积分兑换 ${item.name}`,
                    balanceBefore,
                    balanceAfter: account.balance,
                })
            );

            //扣库存
            const affected = await itemRepo.decrement({ id: rewardItemId }, 'stock', 1);
            if (affected.affected === 0) {
                return reply.status(409).send({
                    success: false,
                    message: '库存不足，请重试'
                });
            }
            
            // 优惠券couponCode生成
            const couponCode = 'CODE' + Math.random().toString(36).substr(2, 8).toUpperCase();

            // 写兑换记录
            const recordRepo = AppDataSource.getRepository(RewardRecord);
            const record = recordRepo.create({
                userId,
                rewardItemId: item.id,
                pointsCost: item.pointsCost,
                couponCode,
                status: 'active',
            });
            await recordRepo.save(record);

            reply.send({
                success: true,
                data: {
                    couponCode,
                    pointsCost: item.pointsCost,
                    newBalance: account.balance,
                },
            });
        });

    fastify.get(
        '/coupons/:couponCode',
        async (req, reply) => {
            const { couponCode } = req.params as {
                couponCode: string
            };

            const record = await AppDataSource.getRepository(RewardRecord)
                .createQueryBuilder('rr')
                .leftJoinAndSelect('rr.rewardItem', 'item')
                .where('rr.couponCode = :code', { code: couponCode })
                .getOne();

            if (!record) {
                return reply.status(404).send({
                    success: false,
                    message: '优惠券不存在'
                });
            }

            reply.send({
                success: true,
                data: {
                    couponCode: record.couponCode,
                    couponType: record.rewardItem.couponType,
                    coupinValue: record.rewardItem.couponValue,
                    conditionAmount: record.rewardItem.conditionAmount,
                    status: record.status,
                    exporyDate: new Date(Date.now() + 7 * 24 * 60 * 1000).toISOString(),
                }
            });
        }
    );
}