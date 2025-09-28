import { rebuildRewardItem } from '../services/reward-list.service';
import cron, { schedule } from 'node-cron';

export function startRewardListTask(): void {
    // 暂时禁用定时任务，因为奖励列表现在是按用户独立的
    // 每周一 00:00 重建
    // cron.schedule('0 0 * * 1', async () => {
    //     try {
    //         // 需要为所有用户重建奖励列表
    //         console.log('[Cron] 奖励列表定时任务已禁用');
    //     } catch (err) {
    //         console.log('[Cron] 可兑换优惠券列表生成失败', err);
    //     }
    
    // }, {
    //     // scheduled: true,
    //     timezone: 'Asia/Shanghai',
    // });
    console.log('[Task] 奖励列表定时任务已禁用（用户独立奖励列表）');
}