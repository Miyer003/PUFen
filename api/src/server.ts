import 'reflect-metadata';
import app from './app';
import { startSigninConfigTask } from './tasks/signin.task';
import { AppDataSource } from './config/db';
import { buildWeekConfig } from './services/signin-config.service';
import { startRewardListTask } from './tasks/reward.task';
import { CouponExpiryTask } from './tasks/coupon-expiry.task';

const PORT = Number(process.env.PORT) || 5000;

const start = async () => {
    try {
        await AppDataSource.initialize();
        console.log('数据库连接成功'); 
        await buildWeekConfig(); 
    } catch (err) {
        console.log('数据库连接失败', err);
        process.exit(1);
    }
};
start();
startSigninConfigTask();
startRewardListTask();
CouponExpiryTask.start();

app.listen({ port: PORT }, (err, address) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
    console.log(`🚀 服务端启动成功: ${address}`);
  });