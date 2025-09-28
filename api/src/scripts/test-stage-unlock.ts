// 将第一阶段商品库存设为0，测试第二阶段解锁
import { AppDataSource } from '../config/db.js';
import { RewardItem } from '../entities/RewardItem.js';

async function setStage1StockToZero() {
  await AppDataSource.initialize();
  
  try {
    console.log('=== 设置第一阶段商品库存为0 ===\n');
    
    const rewardRepo = AppDataSource.getRepository(RewardItem);
    
    // 1. 显示当前库存状态
    console.log('1. 当前库存状态:');
    const allItems = await rewardRepo.find({
      order: { stage: 'ASC', pointsCost: 'ASC' }
    });
    
    console.table(allItems.map(item => ({
      name: item.name,
      stage: item.stage,
      stock: item.stock,
      pointsCost: item.pointsCost
    })));
    
    // 2. 将第一阶段商品库存设为0
    console.log('\n2. 将第一阶段商品库存设为0...');
    const stage1Items = allItems.filter(item => item.stage === 1);
    
    for (const item of stage1Items) {
      await rewardRepo.update(item.id, { stock: 0 });
      console.log(`已设置 "${item.name}" 库存为0`);
    }
    
    // 3. 显示更新后的库存状态
    console.log('\n3. 更新后的库存状态:');
    const updatedItems = await rewardRepo.find({
      order: { stage: 'ASC', pointsCost: 'ASC' }
    });
    
    console.table(updatedItems.map(item => ({
      name: item.name,
      stage: item.stage,
      stock: item.stock,
      pointsCost: item.pointsCost,
      status: item.stock > 0 ? '有库存' : '无库存'
    })));
    
    // 4. 统计信息
    const stage1Count = updatedItems.filter(item => item.stage === 1).length;
    const stage1ZeroStock = updatedItems.filter(item => item.stage === 1 && item.stock === 0).length;
    const stage2Count = updatedItems.filter(item => item.stage === 2).length;
    const stage2HasStock = updatedItems.filter(item => item.stage === 2 && item.stock > 0).length;
    
    console.log('\n4. 统计信息:');
    console.log(`第一阶段商品总数: ${stage1Count}`);
    console.log(`第一阶段无库存商品: ${stage1ZeroStock}`);
    console.log(`第二阶段商品总数: ${stage2Count}`);
    console.log(`第二阶段有库存商品: ${stage2HasStock}`);
    
    const stage1AllSoldOut = stage1Count > 0 && stage1ZeroStock === stage1Count;
    console.log(`第一阶段是否全部售完: ${stage1AllSoldOut ? '是' : '否'}`);
    
    if (stage1AllSoldOut) {
      console.log('\n✅ 第一阶段商品已全部售完，第二阶段应该解锁！');
    } else {
      console.log('\n⚠️ 第一阶段仍有商品未售完');
    }
    
    console.log('\n=== 操作完成 ===');
    console.log('现在可以测试前端页面，第二阶段商品应该从灰色锁定变为可兑换状态');
    
  } catch (error) {
    console.error('设置库存失败:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

setStage1StockToZero().catch(console.error);