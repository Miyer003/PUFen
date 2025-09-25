import cron, { schedule } from 'node-cron';
import { buildWeekConfig } from '../services/signin-config.service';

export function startSigninConfigTask(): void {
    cron.schedule('0 0 * * 1', async () => {
        try {
            const cfg = await buildWeekConfig();
            console.log('[Cron] 新签到配置已生成', cfg.id);
        } catch (err) {
            console.error('[Cron] 签到配置生成失败', err);
        }
    }, {
        // scheduled: true,
        timezone: 'Asia/Shanghai',
    });
}