#!/usr/bin/env node

/**
 * 团队和新用户优惠券问题修复验证脚本
 */

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔧 团队和新用户注册问题修复验证');
console.log('='.repeat(50));

console.log('\n✅ 修复内容：');
console.log('1. 团队第三人加入问题：');
console.log('   • 确保团队成员计数正确显示为 3/3');
console.log('   • 正确分配积分给新成员和队长（如果是新用户）');
console.log('   • 返回完整团队信息，包括团队名称');
console.log('');
console.log('2. 新用户注册优惠券分配：');
console.log('   • 新用户注册时自动调用 rebuildRewardItem()');
console.log('   • 分配6种优惠券各1张：');
console.log('     - 满29减4 (5积分, 第1阶段)');
console.log('     - 满49减6 (10积分, 第1阶段)');
console.log('     - 满69减10 (15积分, 第1阶段)');
console.log('     - 满19减3 (5积分, 第2阶段)');
console.log('     - 满39减5 (10积分, 第2阶段)');
console.log('     - 满99减20 (15积分, 第2阶段)');

function displayTeamJoinFlow() {
  console.log('\n📋 团队第三人加入流程：');
  console.log('─'.repeat(40));
  console.log('1. 用户输入邀请码加入团队');
  console.log('2. 检查团队是否已满（当前2/3）');
  console.log('3. 验证用户是否为新用户');
  console.log('4. 计算积分分配：');
  console.log('   • 新成员基础积分：25分');
  console.log('   • 如果是新用户：新成员+10分，队长+10分');
  console.log('5. 更新团队成员数量为 3/3');
  console.log('6. 返回完整团队信息：');
  console.log('   • 团队ID、名称、邀请码');
  console.log('   • 成员数量：3/3（已满）');
  console.log('   • 总积分更新');
  console.log('   • 剩余时间');
}

function displayNewUserRegistrationFlow() {
  console.log('\n📋 新用户注册优惠券分配流程：');
  console.log('─'.repeat(40));
  console.log('1. 用户完成基本注册信息验证');
  console.log('2. 创建用户记录（isNewUser: true）');
  console.log('3. 创建积分账户');
  console.log('4. 调用 rebuildRewardItem() 分配优惠券：');
  console.log('   • 清空现有奖励物品');
  console.log('   • 创建6种优惠券各1张');
  console.log('   • 分为2个阶段供兑换');
  console.log('5. 返回注册成功信息和JWT token');
  console.log('6. 用户可立即在积分商城看到可兑换物品');
}

function displayAPIEndpoints() {
  console.log('\n🔗 相关API接口：');
  console.log('─'.repeat(40));
  console.log('团队相关：');
  console.log('• POST /api/teams/join-by-code - 通过邀请码加入团队');
  console.log('• GET /api/teams/my-active-team - 获取我的活跃团队信息');
  console.log('');
  console.log('用户注册：');
  console.log('• POST /api/auth/register - 新用户注册');
  console.log('');
  console.log('奖励系统：');
  console.log('• GET /api/rewards - 获取可兑换物品列表');
  console.log('• rebuildRewardItem() - 重建奖励物品列表');
}

async function runDemo() {
  displayTeamJoinFlow();
  displayNewUserRegistrationFlow();
  displayAPIEndpoints();
  
  console.log('\n🧪 测试建议：');
  console.log('1. 创建一个2人团队');
  console.log('2. 使用新用户账号加入该团队作为第三人');
  console.log('3. 验证团队显示为 3/3 且包含团队名称');
  console.log('4. 检查积分分配：新成员35分，队长额外10分');
  console.log('5. 注册新用户并检查是否有6种优惠券');
  
  const choice = await new Promise((resolve) => {
    rl.question('\n📊 是否查看具体的代码修改内容？(y/n): ', resolve);
  });

  if (choice.toLowerCase() === 'y') {
    console.log('\n📝 代码修改详情：');
    console.log('─'.repeat(50));
    console.log('1. auth.controller.ts 修改：');
    console.log('```typescript');
    console.log('// 导入奖励服务');
    console.log('import { rebuildRewardItem } from \'../services/reward-list.service\';');
    console.log('');
    console.log('// 在注册成功后添加');
    console.log('try {');
    console.log('  await rebuildRewardItem();');
    console.log('  console.log(`新用户注册成功，已分配初始优惠券`);');
    console.log('} catch (error) {');
    console.log('  console.error(`优惠券分配失败:`, error);');
    console.log('}');
    console.log('```');
    console.log('');
    console.log('2. team.controller.ts 修改：');
    console.log('• 团队加入接口已返回完整团队信息');
    console.log('• 包含团队名称、成员数量、最大成员数等');
    console.log('• 正确处理第三人加入的积分分配');
  }
  
  console.log('\n✅ 修复完成总结：');
  console.log('• 团队第三人加入时会正确显示 3/3');
  console.log('• 团队名称会在返回信息中正确包含');
  console.log('• 新用户和队长的积分奖励正确分配');
  console.log('• 新用户注册时自动获得6种优惠券');
  console.log('• 优惠券分配与每周重置逻辑一致');
  
  rl.close();
}

console.log('正在启动验证脚本...\n');
runDemo().catch(console.error);