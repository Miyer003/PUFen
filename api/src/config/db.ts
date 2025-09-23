import { DataSource } from 'typeorm';
import { User } from '../entities/User.js';
import { PointsAccount } from '../entities/PointsAccount';
// import { SignInConfig } from '../entities/SignInConfig';
// import { SignInRecord } from '../entities/SignInRecord';
// import { Team } from '../entities/Team';
// import { TeamMember } from '../entities/TeamMember';
// import { RewardItem } from '../entities/RewardItem';
// import { RewardRecord } from '../entities/RewardRecord';
// import { PointsTransaction } from '../entities/PointsTransaction';

export const AppDataSource = new DataSource({
    type: 'sqlite',
    database: 'points.db',
    synchronize: true, // 开发环境自动修改表结构，生产环境需要关闭
    logging: true,
    entities: [
        User,
        PointsAccount,
        // SignInConfig,
        // SignInRecord,
        // Team,
        // TeamMember,
        // RewardItem,
        // RewardRecord,
        // PointsTransaction
    ],
});