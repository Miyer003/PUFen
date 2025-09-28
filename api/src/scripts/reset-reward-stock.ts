// 重置奖励商品库存的脚本
import { AppDataSource } from '../config/db.js';
import { RewardItem } from '../entities/RewardItem.js';
import { RewardStageService } from '../services/reward-stage.service.js';

async function resetRewardStock() {
  await AppDataSource.initialize();
  
  try {
    console.log('=== 重置奖励商品库存 ===\n');
    
    const rewardItemRepo = AppDataSource.getRepository(RewardItem);
    
    // 重置第一阶段商品库存
    const stage1Items = await rewardItemRepo.find({ where: { stage: 1 } });
    console.log('第一阶段商品：');
    for (const item of stage1Items) {
      console.log(`- ${item.name}: 当前库存 ${item.stock}`);
      // 重置为1，以便测试
      await rewardItemRepo.update({ id: item.id }, { stock: 1 });
      console.log(`  重置为: 1`);
    }
    
    // 重置第二阶段商品库存
    const stage2Items = await rewardItemRepo.find({ where: { stage: 2 } });
    console.log('\n第二阶段商品：');
    for (const item of stage2Items) {
      console.log(`- ${item.name}: 当前库存 ${item.stock}`);
      // 重置为2，增加一些库存
      await rewardItemRepo.update({ id: item.id }, { stock: 2 });
      console.log(`  重置为: 2`);
    }
    
    console.log('\n=== 库存重置完成 ===');
    
    // 检查阶段状态
    console.log('\n=== 阶段状态检查 ===');
    const stageStats = await RewardStageService.getStageStats();
    console.log('阶段统计:', JSON.stringify(stageStats, null, 2));
    
    const userStages = await RewardStageService.getUserAvailableStages();
    console.log('用户可访问阶段:', JSON.stringify(userStages, null, 2));
    
  } catch (error) {
    console.error('重置库存失败:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

resetRewardStock().catch(console.error);