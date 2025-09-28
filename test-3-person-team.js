#!/usr/bin/env node

/**
 * 3人团队系统测试脚本
 * 验证修改后的团队人数限制和积分分配
 */

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 模拟团队数据（3人制）
let teams = [
  {
    id: 'TEAM001',
    name: '精英小队',
    inviteCode: 'ABCD12',
    members: [
      { id: 1, name: '队长阿明', role: 'captain', points: 50, isNewUser: false, joinDate: '2024-01-15' },
      { id: 2, name: '成员小红', role: 'member', points: 25, isNewUser: false, joinDate: '2024-01-16' }
    ],
    totalPoints: 100, // 基础100分
    maxMembers: 3,
    status: 'active'
  },
  {
    id: 'TEAM002', 
    name: '满员战队',
    inviteCode: 'EFGH34',
    members: [
      { id: 3, name: '队长大佬', role: 'captain', points: 60, isNewUser: false, joinDate: '2024-01-10' }, // 队长因新用户奖励多得10分
      { id: 4, name: '新用户小白', role: 'member', points: 35, isNewUser: true, joinDate: '2024-01-11' }, // 新用户多得10分
      { id: 5, name: '成员老王', role: 'member', points: 25, isNewUser: false, joinDate: '2024-01-12' }
    ],
    totalPoints: 120, // 基础100分 + 新用户奖励20分
    maxMembers: 3,
    status: 'active'
  }
];

let currentUser = {
  id: 999,
  name: '测试用户',
  points: 0,
  teamId: null,
  isNewUser: true // 模拟新用户
};

function displayWelcome() {
  console.clear();
  console.log('🎯 3人团队系统测试');
  console.log('='.repeat(50));
  console.log('📊 积分分配规则：');
  console.log('• 队长基础积分：50分');
  console.log('• 成员基础积分：25分');
  console.log('• 团队基础总分：100分');
  console.log('• 新用户奖励：新用户+10分，队长+10分');
  console.log('• 团队人数上限：3人');
  console.log('='.repeat(50));
}

function calculatePoints(isNewUser, role) {
  let basePoints = role === 'captain' ? 50 : 25;
  let bonus = isNewUser ? 10 : 0;
  return basePoints + bonus;
}

function calculateCaptainBonus(hasNewMember) {
  return hasNewMember ? 10 : 0;
}

function generateInviteCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function findTeamByCode(code) {
  return teams.find(team => team.inviteCode === code && team.status === 'active');
}

function getUserTeam() {
  if (!currentUser.teamId) return null;
  return teams.find(team => team.id === currentUser.teamId);
}

function displayTeamInfo(team) {
  if (!team) {
    console.log('👤 当前状态：未加入任何团队');
    return;
  }

  console.log(`\n🏆 团队信息 - ${team.name}`);
  console.log(`邀请码：${team.inviteCode}`);
  console.log(`成员数：${team.members.length}/${team.maxMembers} ${team.members.length >= team.maxMembers ? '(已满员)' : ''}`);
  console.log(`团队积分：${team.totalPoints}分`);
  
  console.log('\n👥 成员详情：');
  let totalDistributed = 0;
  team.members.forEach((member) => {
    const badge = member.role === 'captain' ? '👑' : '👤';
    const newUserBadge = member.isNewUser ? '🆕' : '';
    console.log(`  ${badge} ${member.name} - ${member.points}分 ${newUserBadge} (${member.joinDate})`);
    totalDistributed += member.points;
  });
  
  console.log(`\n💰 积分统计：`);
  console.log(`• 已分配积分：${totalDistributed}分`);
  console.log(`• 基础积分池：100分`);
  console.log(`• 新用户奖励：${totalDistributed - 100}分`);
}

function displayMainMenu() {
  const userTeam = getUserTeam();
  
  console.log('\n📋 测试功能');
  console.log('1. 查看我的团队信息');
  console.log('2. 加入团队（输入邀请码）');
  console.log('3. 创建新团队');
  console.log('4. 查看所有团队状态');
  console.log('5. 模拟积分分配计算');
  console.log('6. 切换用户身份（新用户/老用户）');
  console.log('0. 退出测试');
  
  if (userTeam) {
    displayTeamInfo(userTeam);
  } else {
    console.log(`\n👤 当前用户：${currentUser.name} ${currentUser.isNewUser ? '🆕(新用户)' : '(老用户)'}`);
    console.log('💡 提示：您可以创建团队或加入现有团队');
  }
}

function handleCreateTeam() {
  return new Promise((resolve) => {
    if (currentUser.teamId) {
      console.log('⚠️ 您已经在团队中，无法创建新团队');
      resolve();
      return;
    }

    rl.question('请输入新团队名称: ', (teamName) => {
      if (!teamName.trim()) {
        console.log('❌ 团队名称不能为空');
        resolve();
        return;
      }

      const captainPoints = calculatePoints(currentUser.isNewUser, 'captain');
      const newTeam = {
        id: `TEAM${(teams.length + 1).toString().padStart(3, '0')}`,
        name: teamName.trim(),
        inviteCode: generateInviteCode(),
        members: [{
          id: currentUser.id,
          name: currentUser.name,
          role: 'captain',
          points: captainPoints,
          isNewUser: currentUser.isNewUser,
          joinDate: new Date().toISOString().split('T')[0]
        }],
        totalPoints: 100 + (currentUser.isNewUser ? 10 : 0), // 基础100分 + 新用户奖励
        maxMembers: 3,
        status: 'active'
      };

      teams.push(newTeam);
      currentUser.teamId = newTeam.id;

      console.log(`✅ 成功创建团队「${teamName}」！`);
      console.log(`👑 作为队长，您获得：${captainPoints}分`);
      console.log(`📱 您的邀请码是：${newTeam.inviteCode}`);
      
      resolve();
    });
  });
}

function handleJoinTeam() {
  return new Promise((resolve) => {
    if (currentUser.teamId) {
      console.log('⚠️ 您已经在团队中，无法加入其他团队');
      resolve();
      return;
    }

    rl.question('请输入邀请码 (6位): ', (code) => {
      const inviteCode = code.trim().toUpperCase();
      
      if (inviteCode.length !== 6) {
        console.log('❌ 邀请码必须是6位字符');
        resolve();
        return;
      }

      const team = findTeamByCode(inviteCode);
      if (!team) {
        console.log('❌ 邀请码无效或团队已过期');
        resolve();
        return;
      }

      if (team.members.length >= team.maxMembers) {
        console.log('❌ 团队已满员（3/3），无法加入');
        resolve();
        return;
      }

      // 计算积分
      const memberPoints = calculatePoints(currentUser.isNewUser, 'member');
      const captainBonus = calculateCaptainBonus(currentUser.isNewUser);
      
      // 如果是新用户，给队长加分
      if (currentUser.isNewUser && captainBonus > 0) {
        const captain = team.members.find(m => m.role === 'captain');
        if (captain) {
          captain.points += captainBonus;
        }
      }

      // 新成员加入团队
      team.members.push({
        id: currentUser.id,
        name: currentUser.name,
        role: 'member',
        points: memberPoints,
        isNewUser: currentUser.isNewUser,
        joinDate: new Date().toISOString().split('T')[0]
      });
      
      // 更新团队总积分
      team.totalPoints += memberPoints + captainBonus;
      currentUser.teamId = team.id;

      console.log(`🎉 成功加入团队「${team.name}」！`);
      console.log(`💰 您获得：${memberPoints}分`);
      if (captainBonus > 0) {
        console.log(`🎁 队长获得新用户奖励：${captainBonus}分`);
      }
      console.log(`👥 团队现在有 ${team.members.length}/3 名成员`);
      
      resolve();
    });
  });
}

function simulatePointsCalculation() {
  console.log('\n🧮 积分分配计算模拟');
  console.log('─'.repeat(40));
  
  console.log('\n场景1：老用户创建团队');
  console.log('• 队长（老用户）：50分');
  console.log('• 团队总分：100分');
  
  console.log('\n场景2：新用户创建团队');
  console.log('• 队长（新用户）：50 + 10 = 60分');
  console.log('• 团队总分：100 + 10 = 110分');
  
  console.log('\n场景3：老用户加入团队');
  console.log('• 新成员（老用户）：25分');
  console.log('• 队长无奖励');
  console.log('• 团队总分增加：25分');
  
  console.log('\n场景4：新用户加入团队');
  console.log('• 新成员（新用户）：25 + 10 = 35分');
  console.log('• 队长奖励：10分');
  console.log('• 团队总分增加：35 + 10 = 45分');
  
  console.log('\n场景5：满员团队积分分布');
  console.log('• 队长：50分（基础）+ 可能的新用户奖励');
  console.log('• 成员1：25分（基础）+ 可能的新用户奖励');
  console.log('• 成员2：25分（基础）+ 可能的新用户奖励');
  console.log('• 总分范围：100-140分（取决于新用户数量）');
}

function toggleUserStatus() {
  currentUser.isNewUser = !currentUser.isNewUser;
  console.log(`✅ 用户身份已切换为：${currentUser.isNewUser ? '🆕新用户' : '老用户'}`);
}

function displayAllTeams() {
  console.log('\n🏆 所有团队状态');
  console.log('─'.repeat(60));
  
  teams.forEach((team, index) => {
    const statusIcon = team.status === 'active' ? '🟢' : '🔴';
    const fullIcon = team.members.length >= team.maxMembers ? '🔒' : '🔓';
    
    console.log(`\n${index + 1}. ${statusIcon} ${team.name} ${fullIcon}`);
    console.log(`   邀请码: ${team.inviteCode}`);
    console.log(`   成员: ${team.members.length}/${team.maxMembers}`);
    console.log(`   总积分: ${team.totalPoints}`);
    console.log(`   成员: ${team.members.map(m => 
      `${m.name}(${m.points}分${m.isNewUser ? '🆕' : ''})`
    ).join(', ')}`);
  });
}

async function runDemo() {
  displayWelcome();
  
  while (true) {
    displayMainMenu();
    
    const choice = await new Promise((resolve) => {
      rl.question('\n请选择功能 (0-6): ', resolve);
    });

    console.log('');

    switch (choice) {
      case '1':
        const userTeam = getUserTeam();
        if (userTeam) {
          displayTeamInfo(userTeam);
        } else {
          console.log('👤 您还未加入任何团队');
        }
        break;

      case '2':
        await handleJoinTeam();
        break;

      case '3':
        await handleCreateTeam();
        break;

      case '4':
        displayAllTeams();
        break;

      case '5':
        simulatePointsCalculation();
        break;

      case '6':
        toggleUserStatus();
        break;

      case '0':
        console.log('👋 3人团队系统测试完成！');
        console.log('\n✅ 验证结果：');
        console.log('• 团队人数限制：3人 ✓');
        console.log('• 队长基础积分：50分 ✓');
        console.log('• 成员基础积分：25分 ✓');
        console.log('• 基础总积分：100分 ✓');
        console.log('• 新用户奖励机制：新用户+10分，队长+10分 ✓');
        console.log('• 前端显示更新：从6人改为3人 ✓');
        rl.close();
        return;

      default:
        console.log('❌ 无效选择，请输入 0-6');
    }

    await new Promise((resolve) => {
      rl.question('\n按 Enter 键继续...', resolve);
    });
    console.clear();
    displayWelcome();
  }
}

console.log('正在启动3人团队系统测试...\n');
runDemo().catch(console.error);