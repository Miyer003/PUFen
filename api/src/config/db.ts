import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { PointsAccount } from '../entities/PointsAccount';
import { SignInConfig } from '../entities/SignInConfig';
import { SignInRecord } from '../entities/SignInRecord';
import { Team } from '../entities/Team';
import { TeamMember } from '../entities/TeamMember';
import { TeamRecord } from '../entities/TeamRecord';
import { RewardItem } from '../entities/RewardItem';
import { RewardRecord } from '../entities/RewardRecord';
import { PointsTransaction } from '../entities/PointsTransaction';
import { UserCoupon } from '../entities/UserCoupon';

export const AppDataSource = new DataSource({
    type: 'sqlite',
    database: 'points.db',
    synchronize: true, // 开发环境自动修改表结构，生产环境需要关闭
    logging: true,
    entities: [
        User,
        PointsAccount,
        SignInConfig,
        SignInRecord,
        Team,
        TeamMember,
        TeamRecord,
        RewardItem,
        RewardRecord,
        PointsTransaction,
        UserCoupon
    ],
});