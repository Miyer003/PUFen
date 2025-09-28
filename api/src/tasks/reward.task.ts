import { rebuildRewardItem } from '../services/reward-list.service';
import cron, { schedule } from 'node-cron';

export function startRewardListTask(): void {
    // 每周一 00:00 重建
    cron.schedule('0 0 * * 1', async () => {
        try {
            const first = await rebuildRewardItem();
            console.log('[Cron] 6 张券已重新生成，首条 ID：', first.id);
        } catch (err) {
            console.log('[Cron] 可兑换优惠券列表生成失败', err);
        }
    
    }, {
        // scheduled: true,
        timezone: 'Asia/Shanghai',
    });
}