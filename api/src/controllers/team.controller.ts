import fastify, { FastifyPluginAsync } from "fastify";
import { authHook } from "../middleware/auth.hook";
import { AppDataSource } from "../config/db";
import { Team } from "../entities/Team";
import { TeamMember } from "../entities/TeamMember";
import { stat } from "fs";
import { REPLServer } from "repl";
import { User } from "../entities/User";

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
            const inviteCode = 'INV' + Math.random().toString(36).substr(2, 6).toUpperCase();
            const team = teamRepo.create({
                captainId: userId,
                name: name,
                inviteCode,
                startTime: new Date(),
                endTime: new Date(Date.now() + 3 * 60 * 60 * 1000),
                totalPoints: 100,
                status: 'active',
                createdAt: new Date(),
                memberCount: 1
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
                await memberRepo.save(captain);
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

    // 通过邀请码加入团队
    fastify.post(
        '/teams/join-by-code',
        async (req, reply) => {
            const userId = req.user!.id;
            const isNewUser = req.user!.isNewUser;
            const { inviteCode } = req.body as { inviteCode: string };
            const teamRepo = AppDataSource.getRepository(Team);
            const memberRepo = AppDataSource.getRepository(TeamMember);

            const team = await teamRepo.findOneBy({ inviteCode, status: 'active' });
            
            if (!team) {
                return reply.status(400).send({
                    success: false,
                    message: '邀请码无效或团队已过期'
                });
            }

            const now = new Date();
            if (new Date(team.endTime).getTime() < now.getTime()) {
                return reply.status(400).send({
                    success: false,
                    message: '团队已过期'
                });
            }

            // 检查是否已经加入
            const exist = await memberRepo.findOneBy({
                userId, teamId: team.id
            });
            if (exist) {
                return reply.status(400).send({
                    success: false,
                    message: '已经是团队成员'
                });
            }

            // 检查团队人数限制（假设最多6人）
            const currentMemberCount = await memberRepo.count({
                where: { teamId: team.id }
            });
            if (currentMemberCount >= 6) {
                return reply.status(400).send({
                    success: false,
                    message: '团队已满员'
                });
            }

            // 加入团队
            const pointsEarned = isNewUser ? 70 : 30; // 新用户70分，老用户30分
            const member = memberRepo.create({
                teamId: team.id,
                userId: userId,
                role: 'member',
                isNewUser,
                pointsEarned,
                joinedAt: new Date()
            });
            await memberRepo.save(member);

            // 更新团队成员数
            team.memberCount = currentMemberCount + 1;
            await teamRepo.save(team);

            return reply.send({
                success: true,
                data: {
                    pointsEarned,
                    teamInfo: {
                        ...team,
                        memberCount: team.memberCount,
                        remainingTime: Math.max(0, Math.floor((new Date(team.endTime).getTime() - Date.now()) / 1000))
                    },
                    memberInfo: member
                }
            });
        }
    );

    // 获取我的活跃团队
    fastify.get(
        '/teams/my-active',
        async (req, reply) => {
            const userId = req.user!.id;
            const memberRepo = AppDataSource.getRepository(TeamMember);

            // 查找用户参与的活跃团队
            const member = await memberRepo
                .createQueryBuilder('member')
                .leftJoinAndSelect('member.team', 'team')
                .where('member.userId = :userId', { userId })
                .andWhere('team.status = :status', { status: 'active' })
                .andWhere('team.endTime > :now', { now: new Date() })
                .getOne();

            if (!member || !member.team) {
                return reply.send({
                    success: true,
                    data: null,
                    message: '暂无活跃团队'
                });
            }

            const team = member.team;
            
            // 获取团队所有成员
            const allMembers = await memberRepo
                .createQueryBuilder('member')
                .leftJoinAndSelect('member.user', 'user')
                .where('member.teamId = :teamId', { teamId: team.id })
                .getMany();

            const remainingTime = Math.max(0, Math.floor((new Date(team.endTime).getTime() - Date.now()) / 1000));

            return reply.send({
                success: true,
                data: {
                    team: {
                        ...team,
                        memberCount: allMembers.length,
                        remainingTime
                    },
                    myRole: member.role,
                    members: allMembers.map(m => ({
                        id: m.id,
                        username: m.user?.username || '未知用户',
                        role: m.role,
                        pointsEarned: m.pointsEarned,
                        isNewUser: m.isNewUser,
                        joinedAt: m.joinedAt
                    }))
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
    fastify.get(
        '/teams/:teamId',
        async (req, reply) => {
            const { teamId } = req.params as { teamId: string };
            const teamRepo = AppDataSource.getRepository(Team);
            const memberRepo = AppDataSource.getRepository(TeamMember);

            const team = await teamRepo.findOneBy({ id: teamId });
            if (!team) {
                return reply.status(404).send({
                    success: false,
                    message: '团队未找到'
                });
            }

            const members = await memberRepo.findBy({ teamId });

            reply.send({
                success: true,
                data: {
                    team: {
                        ...team,
                        memberCount: members.length,
                        remainingTime:  Math.max(0, Math.floor((new Date(team.endTime).getTime() - Date.now()) / 1000))
                    },
                    members
                }
            });
        }
    );
    fastify.get(
        '/teams/available',
        async (req, reply) => {
            const userId = req.user!.id;
            const { page = 1, limit = 5 } = req.query as {
                page: number,
                limit: number
            }
            const teamRepo = AppDataSource.getRepository(Team);
            const memberRepo = AppDataSource.getRepository(TeamMember);

            const joinedTeamId = await memberRepo.createQueryBuilder('m')
                .select('m.teamId')
                .where('m.userId = :userId', { userId })
                .getMany()
            const joinedIds = joinedTeamId.map(j => j.teamId);

            const query = teamRepo.createQueryBuilder('t')
                .where('t.status = :status', { status: 'active'})
                .andWhere('t.captainId != :userId', { userId })
                .andWhere('t.id NOT IN (:...joinedIds)', { joinedIds: joinedIds.length ? joinedIds : ['']  })
                .orderBy('t.createdAt', 'DESC')

            const [teams, total] = await query
                .skip((page - 1) * limit)
                .take(limit)
                .getManyAndCount();

            // 补充字段
            const raw = await teamRepo.createQueryBuilder('team')
                // 子查询
                .leftJoin(q => q
                    .select('teamId', 'tid')
                    .addSelect('COUNT(*)', 'cnt')
                    .from(TeamMember, 'm')
                    .groupBy('teamId'), 'mc', 'mc.tid = team.id')
                .leftJoin(User, 'cap', 'cap.id = team.captainId')
                .where('team.status = :status', { status: 'active' })
                .andWhere('team.captainId != :uid', { uid: userId })
                .andWhere(joinedIds.length ? 'team.id NOT IN (:...joinedIds)' : '1=1', { joinedIds })
                .orderBy('team.createdAt', 'DESC')
                .skip((page - 1) * limit)
                .take(limit)
                .select([
                    'team.id AS id',
                    'team.captainId AS captainId',
                    'team.name AS name',
                    'team.startTime AS startTime',
                    'team.endTime AS endTime',
                    'team.totalPoints AS totalPoints',
                    'team.status AS status',
                    'COALESCE(mc.cnt, 0) AS memberCount',
                    'cap.username AS captainName'
                ])
                .getRawMany();

            const teamsWithInfo = raw.map(e => ({
                ...e,
                memberCount: Number(e.memberCount),
                remainingTime: Math.max(0, Math.floor((new Date(e.endTime).getTime() - Date.now()) / 1000))
            }));
            
            reply.send({
                success: true,
                data: {
                    teams: teamsWithInfo,
                    pagination: {
                        page: Number(page),
                        limit: Number(limit),
                        total,
                        totalPages: Math.ceil(total / limit)
                    }
                }
            });
        }
    );
}