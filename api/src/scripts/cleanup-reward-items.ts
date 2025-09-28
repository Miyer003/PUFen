import { AppDataSource } from '../config/db';
import { RewardItem } from '../entities/RewardItem';

async function cleanupRewardItems() {
    try {
        await AppDataSource.initialize();
        console.log('数据库连接成功');

        const rewardItemRepo = AppDataSource.getRepository(RewardItem);

        // 删除所有没有 userId 的旧奖励物品
        const result = await rewardItemRepo.delete({ userId: null });
        console.log(`删除了 ${result.affected || 0} 个旧的奖励物品`);

        console.log('奖励物品清理完成');
        process.exit(0);
    } catch (error) {
        console.error('清理失败:', error);
        process.exit(1);
    }
}

cleanupRewardItems();