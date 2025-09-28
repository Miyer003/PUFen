import { FastifyPluginAsync } from "fastify";
import { authHook } from "../middleware/auth.hook";
import { AppDataSource } from "../config/db";
import { Team } from "../entities/Team";
import { TeamMember } from "../entities/TeamMember";
import { TeamRecord } from "../entities/TeamRecord";
import { User } from "../entities/User";
import { PointsAccount } from "../entities/PointsAccount";
import { PointsTransaction } from "../entities/PointsTransaction";

export const teamRoutes: FastifyPluginAsync = async (fastify) => {
    fastify.addHook('preHandler', authHook);

    // 生成6位邀请码
    const generateInviteCode = (): string => {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    };

    // 积分处理辅助函数
    const addPointsToUser = async (userId: string, points: number, description: string, relatedId: string) => {
        const pointsAccountRepo = AppDataSource.getRepository(PointsAccount);
        const pointsTransactionRepo = AppDataSource.getRepository(PointsTransaction);

        // 获取或创建用户积分账户
        let account = await pointsAccountRepo.findOneBy({ userId });
        if (!account) {
            account = pointsAccountRepo.create({
                userId,
                balance: 0,
                totalEarned: 0,
                totalUsed: 0
            });
        }

        const balanceBefore = account.balance;

        // 更新积分余额
        account.balance += points;
        account.totalEarned += points;
        await pointsAccountRepo.save(account);

        // 创建积分流水记录
        const transaction = pointsTransactionRepo.create({
            userId,
            accountId: account.id,
            amount: points,
            type: 'earn',
            source: 'team',
            relatedId,
            description,
            balanceBefore,
            balanceAfter: account.balance
        });
        await pointsTransactionRepo.save(transaction);

        console.log(`[积分系统] 用户 ${userId} 获得 ${points} 积分: ${description}，余额 ${balanceBefore} → ${account.balance}`);
        return account.balance;
    };

    // 创建团队记录的辅助函数
    const createTeamRecord = async (team: Team, members: TeamMember[]) => {
        const teamRecordRepo = AppDataSource.getRepository(TeamRecord);
        const records: TeamRecord[] = [];

        for (const member of members) {
            const record = teamRecordRepo.create({
                userId: member.userId,
                teamId: team.id,
                teamName: team.name,
                role: member.role,
                pointsEarned: member.pointsEarned,
                isNewUser: member.isNewUser,
                status: team.status,
                memberCount: members.length,
                completedAt: new Date()
            });
            records.push(record);
        }

        await teamRecordRepo.save(records);
        console.log(`[团队系统] 为团队 "${team.name}" 创建了 ${records.length} 条团队记录`);
        return records;
    };

    // 创建团队
    fastify.post(
        '/teams',
        async (req, reply) => {
            const userId = req.user!.id;
            const { name } = req.body as { name: string };
            const teamRepo = AppDataSource.getRepository(Team);
            const memberRepo = AppDataSource.getRepository(TeamMember);

            // 检查用户是否已有活跃团队
            const existingMember = await memberRepo
                .createQueryBuilder('member')
                .leftJoin('member.team', 'team')
                .where('member.userId = :userId', { userId })
                .andWhere('team.status = :status', { status: 'active' })
                .andWhere('team.endTime > :now', { now: new Date() })
                .getOne();

            if (existingMember) {
                return reply.status(400).send({
                    success: false,
                    message: '您已经在一个活跃团队中'
                });
            }

            // 创建团队
            const inviteCode = generateInviteCode();
            const now = new Date();
            const endTime = new Date(now.getTime() + 3 * 60 * 60 * 1000); // 3小时后过期

            const team = teamRepo.create({
                captainId: userId,
                name: name,
                inviteCode,
                startTime: now,
                endTime: endTime,
                totalPoints: 100,
                status: 'active',
                createdAt: now
            });
            await teamRepo.save(team);

            // 队长加入团队，默认获得50分
            const captain = memberRepo.create({
                teamId: team.id,
                userId: userId,
                role: 'captain',
                isNewUser: req.user!.isNewUser || false,
                pointsEarned: 50,
                joinedAt: now
            });
            await memberRepo.save(captain);

            // 给队长的积分账户增加积分并创建流水记录
            const newBalance = await addPointsToUser(
                userId, 
                50, 
                `创建团队「${team.name}」获得队长奖励`, 
                team.id
            );

            console.log(`[团队系统] 队长 ${userId} 创建团队 "${team.name}" 并获得 50 积分，当前余额: ${newBalance}`);

            return reply.status(201).send({
                success: true,
                data: {
                    team: {
                        ...team,
                        memberCount: 1,
                        remainingTime: Math.max(0, Math.floor((endTime.getTime() - Date.now()) / 1000))
                    },
                    pointsEarned: 50
                }
            });
        }
    );

    // 通过邀请码加入团队
    fastify.post(
        '/teams/join-by-code',
        async (req, reply) => {
            const userId = req.user!.id;
            const isNewUser = req.user!.isNewUser || false;
            const { inviteCode } = req.body as { inviteCode: string };
            const teamRepo = AppDataSource.getRepository(Team);
            const memberRepo = AppDataSource.getRepository(TeamMember);

            console.log(`[团队系统] 用户 ${userId} 尝试使用邀请码 ${inviteCode} 加入团队`);

            // 查找团队
            const team = await teamRepo.findOneBy({ inviteCode, status: 'active' });
            if (!team) {
                console.log(`[团队系统] 邀请码 ${inviteCode} 无效或团队已过期`);
                return reply.status(400).send({
                    success: false,
                    message: '邀请码无效或团队已过期'
                });
            }

            console.log(`[团队系统] 找到团队: "${team.name}" (ID: ${team.id})`);

            // 检查团队是否过期
            const now = new Date();
            if (team.endTime.getTime() < now.getTime()) {
                // 自动设置为过期状态
                team.status = 'expired';
                await teamRepo.save(team);
                
                console.log(`[团队系统] 团队 "${team.name}" 已过期`);
                return reply.status(400).send({
                    success: false,
                    message: '团队已过期'
                });
            }

            // 检查用户是否已经在团队中
            const existingMember = await memberRepo.findOneBy({ userId, teamId: team.id });
            if (existingMember) {
                return reply.status(400).send({
                    success: false,
                    message: '您已经是团队成员'
                });
            }

            // 检查用户是否在其他活跃团队中
            const otherActiveMember = await memberRepo
                .createQueryBuilder('member')
                .leftJoin('member.team', 'team')
                .where('member.userId = :userId', { userId })
                .andWhere('team.status = :status', { status: 'active' })
                .andWhere('team.endTime > :now', { now: new Date() })
                .getOne();

            if (otherActiveMember) {
                return reply.status(400).send({
                    success: false,
                    message: '您已经在其他活跃团队中'
                });
            }

            // 检查团队人数限制（最多3人）
            const currentMemberCount = await memberRepo.count({ where: { teamId: team.id } });
            if (currentMemberCount >= 3) {
                return reply.status(400).send({
                    success: false,
                    message: '团队已满员，无法加入'
                });
            }

            // 计算积分分配
            let memberPoints = 25; // 成员基础积分
            let captainBonusPoints = 0; // 队长奖励积分

            if (isNewUser) {
                memberPoints = 35; // 新用户获得额外10分
                captainBonusPoints = 10; // 队长也获得额外10分
            }

            // 如果有新用户加入，给队长加分
            if (captainBonusPoints > 0) {
                const captain = await memberRepo.findOneBy({ teamId: team.id, role: 'captain' });
                if (captain) {
                    captain.pointsEarned += captainBonusPoints;
                    await memberRepo.save(captain);
                    
                    // 给队长的积分账户增加奖励积分
                    await addPointsToUser(
                        captain.userId, 
                        captainBonusPoints, 
                        `邀请新用户加入团队「${team.name}」获得奖励`, 
                        team.id
                    );
                }
            }

            // 新成员加入团队
            const member = memberRepo.create({
                teamId: team.id,
                userId: userId,
                role: 'member',
                isNewUser,
                pointsEarned: memberPoints,
                joinedAt: now
            });
            await memberRepo.save(member);

            // 给新成员的积分账户增加积分
            const memberDescription = isNewUser 
                ? `新用户加入团队「${team.name}」获得奖励` 
                : `加入团队「${team.name}」获得奖励`;
            const newBalance = await addPointsToUser(
                userId, 
                memberPoints, 
                memberDescription, 
                team.id
            );

            // 检查团队是否满员，如果满员则自动设置为完成状态
            const updatedMemberCount = currentMemberCount + 1;
            if (updatedMemberCount >= 3) {
                team.status = 'completed';
                await teamRepo.save(team);
                console.log(`[团队系统] 团队 "${team.name}" 已满员，自动设置为完成状态`);
                
                // 创建团队记录
                const allMembers = await memberRepo.find({ where: { teamId: team.id } });
                await createTeamRecord(team, allMembers);
            }

            const remainingTime = Math.max(0, Math.floor((team.endTime.getTime() - Date.now()) / 1000));

            console.log(`[团队系统] 用户 ${userId} 成功加入团队 "${team.name}"`);
            console.log(`[团队系统] 新成员获得 ${memberPoints} 积分，当前余额: ${newBalance}，队长获得 ${captainBonusPoints} 奖励积分`);
            console.log(`[团队系统] 团队 "${team.name}" 现在有 ${updatedMemberCount}/3 名成员`);

            return reply.send({
                success: true,
                message: `成功加入团队「${team.name}」`,
                data: {
                    pointsEarned: memberPoints,
                    captainBonus: captainBonusPoints,
                    teamInfo: {
                        id: team.id,
                        name: team.name,
                        inviteCode: team.inviteCode,
                        captainId: team.captainId,
                        memberCount: updatedMemberCount,
                        maxMembers: 3,
                        totalPoints: team.totalPoints,
                        status: team.status,
                        startTime: team.startTime,
                        endTime: team.endTime,
                        remainingTime: remainingTime
                    }
                }
            });
        }
    );

        // 手动刷新邀请码
    fastify.put(
        '/teams/refresh-invite-code',
        async (req, reply) => {
            const userId = req.user!.id;
            const teamRepo = AppDataSource.getRepository(Team);
            const memberRepo = AppDataSource.getRepository(TeamMember);

            // 查找用户作为队长的团队（包括已完成和过期的）
            const member = await memberRepo
                .createQueryBuilder('member')
                .leftJoinAndSelect('member.team', 'team')
                .where('member.userId = :userId', { userId })
                .andWhere('member.role = :role', { role: 'captain' })
                .orderBy('team.endTime', 'DESC') // 按结束时间降序排列
                .getOne();

            if (!member || !member.team) {
                return reply.status(404).send({
                    success: false,
                    message: '您没有团队或不是队长'
                });
            }

            const team = member.team;
            const now = new Date();
            
            // 只有团队已完成、已过期或已经超过3小时的才能刷新创建新团队
            if (team.status === 'active' && team.endTime.getTime() > now.getTime()) {
                // 检查是否满员
                const currentMemberCount = await memberRepo.count({ where: { teamId: team.id } });
                if (currentMemberCount < 3) {
                    const remainingMinutes = Math.ceil((team.endTime.getTime() - now.getTime()) / (60 * 1000));
                    return reply.status(400).send({
                        success: false,
                        message: `团队还有 ${remainingMinutes} 分钟有效期且未满员，无法创建新团队`
                    });
                }
                // 如果满员，自动设置为完成状态
                team.status = 'completed';
                await teamRepo.save(team);
            }
            
            // 生成新的邀请码并重新设定3小时有效期
            const newInviteCode = generateInviteCode();
            const newEndTime = new Date(now.getTime() + 3 * 60 * 60 * 1000);

            // 重置团队为活跃状态
            team.status = 'active';
            team.inviteCode = newInviteCode;
            team.endTime = newEndTime;
            await teamRepo.save(team);

            console.log(`[团队系统] 队长 ${userId} 刷新了团队 "${team.name}" 的邀请码: ${newInviteCode}`);

            return reply.send({
                success: true,
                data: {
                    teamName: team.name,
                    newInviteCode,
                    newEndTime,
                    remainingTime: Math.max(0, Math.floor((newEndTime.getTime() - Date.now()) / 1000)),
                    message: '邀请码已刷新，团队有效期重新计算3小时'
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
                .orderBy('member.joinedAt', 'ASC') // 按加入时间排序，队长在前
                .getMany();

            const remainingTime = Math.max(0, Math.floor((team.endTime.getTime() - Date.now()) / 1000));
            
            // 检查团队状态，自动完成或过期
            const teamRepo = AppDataSource.getRepository(Team);
            let shouldUpdateStatus = false;
            
            if (team.status === 'active') {
                // 如果团队已过期，更新为过期状态
                if (remainingTime === 0) {
                    team.status = 'expired';
                    shouldUpdateStatus = true;
                    console.log(`[团队系统] 团队 "${team.name}" 已过期，自动设置为过期状态`);
                }
                // 如果团队满员，更新为完成状态
                else if (allMembers.length >= 3) {
                    team.status = 'completed';
                    shouldUpdateStatus = true;
                    console.log(`[团队系统] 团队 "${team.name}" 已满员，自动设置为完成状态`);
                }
                
                if (shouldUpdateStatus) {
                    await teamRepo.save(team);
                }
            }

            return reply.send({
                success: true,
                data: {
                    team: {
                        ...team,
                        memberCount: allMembers.length,
                        remainingTime
                    },
                    myRole: member.role,
                    myPoints: member.pointsEarned,
                    members: allMembers.map(m => ({
                        id: m.id,
                        userId: m.userId,
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
};