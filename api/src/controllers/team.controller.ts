import fastify, { FastifyPluginAsync } from "fastify";
import { authHook } from "../middleware/auth.hook";
import { AppDataSource } from "../config/db";
import { Team } from "../entities/Team";
import { TeamMember } from "../entities/TeamMember";
import { stat } from "fs";

export const teamRoutes: FastifyPluginAsync = async (fastify) => {
    fastify.addHook('preHandler', authHook);
    fastify.post(
        '/teams',
        async (req, reply) => {
            const userId = req.user!.id;
            const { name } = req.body as {
                name: string 
            }
            const teamRepo = AppDataSource.getRepository(Team);
            const memberRepo = AppDataSource.getRepository(TeamMember);

            // 不能重复创建
            const exist = await teamRepo.findOneBy({ captainId: userId, status: 'active' });
            if (exist) {
                return reply.status(400).send({
                    success: false,
                    message: '已有活跃团队'
                });
            }

            // 创建团队
            const team = teamRepo.create({
                captainId: userId,
                name: name,
                startTime: new Date(),
                endTime: new Date(Date.now() + 3 * 60 * 60 * 1000),
                totalPoints: 100,
                status: 'active',
                createdAt: new Date(),
                // memberCount: 3
            });
            await teamRepo.save(team);

            // 增加团队成员
            const caption = memberRepo.create({
                teamId: team.id,
                userId: userId,
                role: 'captain',
                isNewUser: req.user!.isNewUser,
                pointsEarned: 50,
                joinedAt: new Date()
            });
            await memberRepo.save(caption);

            return reply.status(201).send({
                success: true,
                data: {
                    team: {
                        ...team,
                        memberCount: 1,
                        remainingTime: Math.max(0, Math.floor((new Date(team.endTime).getTime() - Date.now()) / 1000))
                    },
                    member: {
                        caption
                    },
                    pointsEarned: 50
                }
            });
        }
    );

    fastify.post(
        '/teams/:teamId/join',
        async (req, reply) => {
            const userId = req.user!.id;
            const isNewUser = req.user!.isNewUser;
            const { teamId } = req.params as { teamId: string };
            const teamRepo = AppDataSource.getTreeRepository(Team);
            const memberRepo = AppDataSource.getRepository(TeamMember);

            const team = await teamRepo.findOneBy({ id: teamId });
            
            // 过期/满员/不存在/已在其中
            if (!team || team.status !== 'active') {
                return reply.status(400).send({
                    success: false,
                    message: '团队不存在或已过期'
                });
            }

            const now = new Date();
            if (new Date(team.endTime).getTime() < now.getTime()) {
                return reply.status(400).send({
                    success: false,
                    message: '团队已过期'
                });
            }

            const exist = await memberRepo.findOneBy({
                userId, teamId
            });
            if (exist) {
                return reply.status(400).send({
                    success: false,
                    message: '已在团队中'
                });
            }

            if (team.memberCount >= 3) {
                return reply.status(400).send({
                    success: false,
                    message: '团队已满员'
                });
            }
            
            //得积分
            let pointsEarned = 50;
            if (isNewUser) {
                pointsEarned = Math.floor(pointsEarned * 1.5);
                const captain = await memberRepo.findOneBy({ teamId, role: 'captain' });
                if (captain) {
                    captain.pointsEarned += 50;
                }
            }

            // 存入数据库
            const newMember = memberRepo.create({
                teamId,
                userId,
                role: 'member',
                isNewUser,
                pointsEarned,
                joinedAt: new Date()
            });
            await memberRepo.save(newMember);
            
            team.memberCount += 1;
            await teamRepo.save(team);

            return reply.send({
                success: true,
                data: {
                    pointsEarned,
                    teamInfo: {
                        ...team,
                        remainingTime: Math.max(0, Math.floor((new Date(team.endTime).getTime() - Date.now()) / 1000))
                    }
                }
            });
        }
    );
    fastify.get(
        '/teams/my',
        async (req, reply) => {
            const userId = req.user!.id;
            const { page = 1, limit = 5, status } = req.params as {
                page: number,
                limit: number,
                status: string
            }
            const memberRepo = AppDataSource.getRepository(TeamMember);
            const query = memberRepo.createQueryBuilder('mb')
                .leftJoinAndSelect('mb.team', 'team')
                .where('mb.userId = :userId', { userId })
            if (status) {
                query.andWhere('team.status = :status', { status })
            }

            const [records, total] = await query
                .orderBy('mb.joinedAt', 'DESC')
                .skip((Number(page) - 1) * Number(limit))
                .take(Number(limit))
                .getManyAndCount()

            return reply.send({
                success: true,
                data: {
                    records,
                    pagination: {
                        page: Number(page),
                        limit: Number(limit),
                        total,
                        totalPages: Math.ceil(total / Number(limit))
                    }
                }
            });
        }
    );
    // fastify.get();
    // fastify.get();
}