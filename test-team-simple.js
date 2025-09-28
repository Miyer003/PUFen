#!/usr/bin/env node

/**
 * 团队功能演示脚本 (简化版)
 * 用于测试和演示新设计的团队邀请页面功能
 */

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 模拟团队数据
let teams = [
  {
    id: 'TEAM001',
    name: '超级战队',
    inviteCode: 'ABCD12',
    members: [
      { id: 1, name: '队长小明', points: 1200, joinDate: '2024-01-15' },
      { id: 2, name: '成员小红', points: 800, joinDate: '2024-01-16' }
    ],
    totalPoints: 2000,
    maxMembers: 6
  },
  {
    id: 'TEAM002', 
    name: '积分联盟',
    inviteCode: 'EFGH34',
    members: [
      { id: 3, name: '盟主大佬', points: 2500, joinDate: '2024-01-10' }
    ],
    totalPoints: 2500,
    maxMembers: 6
  }
];

let currentUser = {
  id: 999,
  name: '测试用户',
  points: 500,
  teamId: null
};

function displayWelcome() {
  console.clear();
  console.log('🎉 团队邀请页面功能演示');
  console.log('='.repeat(50));
  console.log('新功能特性：');
  console.log('📱 美化的团队邀请界面');
  console.log('🎨 绿色主题设计，与应用整体风格一致');  
  console.log('🔗 一键复制邀请码和分享链接');
  console.log('👥 实时团队信息显示');
  console.log('✨ 现代化卡片式布局');
  console.log('='.repeat(50));
}

function generateInviteCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function findTeamByCode(code) {
  return teams.find(team => team.inviteCode === code);
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
  console.log(`成员数：${team.members.length}/${team.maxMembers}`);
  console.log(`团队积分：${team.totalPoints}`);
  
  console.log('\n👥 成员列表：');
  team.members.forEach((member, index) => {
    const badge = index === 0 ? '👑' : '👤';
    console.log(`  ${badge} ${member.name} - ${member.points}分 (${member.joinDate}加入)`);
  });
}

function displayMainMenu() {
  const userTeam = getUserTeam();
  
  console.log('\n📋 功能菜单');
  console.log('1. 查看我的团队信息');
  console.log('2. 生成/查看我的邀请码');
  console.log('3. 模拟分享邀请链接');
  console.log('4. 加入其他团队'); 
  console.log('5. 查看所有团队');
  console.log('6. 创建新团队');
  console.log('0. 退出演示');
  
  if (userTeam) {
    displayTeamInfo(userTeam);
  } else {
    console.log('\n👤 当前状态：未加入任何团队');
    console.log('💡 提示：您可以创建团队或加入现有团队');
  }
}

function handleCreateTeam() {
  return new Promise((resolve) => {
    rl.question('请输入新团队名称: ', (teamName) => {
      if (!teamName.trim()) {
        console.log('❌ 团队名称不能为空');
        resolve();
        return;
      }

      const newTeam = {
        id: `TEAM${(teams.length + 1).toString().padStart(3, '0')}`,
        name: teamName.trim(),
        inviteCode: generateInviteCode(),
        members: [{
          id: currentUser.id,
          name: currentUser.name,
          points: currentUser.points,
          joinDate: new Date().toISOString().split('T')[0]
        }],
        totalPoints: currentUser.points,
        maxMembers: 6
      };

      teams.push(newTeam);
      currentUser.teamId = newTeam.id;

      console.log(`✅ 成功创建团队「${teamName}」！`);
      console.log(`📱 您的邀请码是：${newTeam.inviteCode}`);
      console.log('💡 现在您可以邀请朋友加入团队了！');
      
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
        console.log('❌ 邀请码无效，请检查后重试');
        resolve();
        return;
      }

      if (team.members.length >= team.maxMembers) {
        console.log('❌ 团队已满，无法加入');
        resolve();
        return;
      }

      // 加入团队
      team.members.push({
        id: currentUser.id,
        name: currentUser.name,
        points: currentUser.points,
        joinDate: new Date().toISOString().split('T')[0]
      });
      team.totalPoints += currentUser.points;
      currentUser.teamId = team.id;

      console.log(`🎉 成功加入团队「${team.name}」！`);
      console.log(`👥 团队现在有 ${team.members.length} 名成员`);
      
      resolve();
    });
  });
}

function simulateShare() {
  const userTeam = getUserTeam();
  if (!userTeam) {
    console.log('❌ 您还未加入任何团队');
    return;
  }

  console.log('📱 模拟分享功能');
  console.log('分享内容：');
  console.log('🎉 邀请你加入我的团队「' + userTeam.name + '」，一起瓜分积分！');
  console.log('邀请码：' + userTeam.inviteCode);
  console.log('快来参与吧！');
  console.log('分享链接：https://pufen.app/invite?code=' + userTeam.inviteCode);
  console.log('✅ 邀请信息已复制到剪贴板（模拟）');
}

function displayAllTeams() {
  console.log('\n🏆 所有团队列表');
  console.log('-'.repeat(60));
  
  teams.forEach((team, index) => {
    console.log(`\n${index + 1}. ${team.name}`);
    console.log(`   邀请码: ${team.inviteCode}`);
    console.log(`   成员: ${team.members.length}/${team.maxMembers}`);
    console.log(`   积分: ${team.totalPoints}`);
    console.log(`   成员: ${team.members.map(m => m.name).join(', ')}`);
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
        const myTeam = getUserTeam();
        if (myTeam) {
          console.log('📱 我的邀请码');
          console.log('团队：' + myTeam.name);
          console.log('邀请码：' + myTeam.inviteCode);
          console.log('💡 分享此码邀请好友加入团队');
        } else {
          console.log('❌ 您还未加入任何团队，请先创建或加入团队');
        }
        break;

      case '3':
        simulateShare();
        break;

      case '4':
        await handleJoinTeam();
        break;

      case '5':
        displayAllTeams();
        break;

      case '6':
        await handleCreateTeam();
        break;

      case '0':
        console.log('👋 感谢使用团队功能演示！');
        console.log('\n🎨 新的团队邀请页面已经完成美化升级：');
        console.log('✨ 采用绿色主题，与应用整体风格一致');
        console.log('📱 现代化卡片布局，用户体验更佳');
        console.log('🔗 一键分享和复制功能');
        console.log('👥 实时团队信息显示');
        console.log('\n📁 相关文件：');
        console.log('- /web/src/pages/InviteFriend.tsx (重新设计的组件)');
        console.log('- /web/src/styles/invite-friend.css (移动端样式)');
        console.log('- test-team-demo.js (功能演示脚本)');
        rl.close();
        return;

      default:
        console.log('❌ 无效选择，请输入 0-6');
    }

    // 等待用户按键继续
    await new Promise((resolve) => {
      rl.question('\n按 Enter 键继续...', resolve);
    });
    console.clear();
    displayWelcome();
  }
}

// 启动演示
console.log('正在启动团队功能演示...\n');
runDemo().catch(console.error);