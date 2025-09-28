#!/usr/bin/env node

/**
 * 验证张三密码的测试脚本
 */

import bcrypt from 'bcrypt';

const password = '123456';
const hashedPassword = '$2b$10$U29ZKcD0yhIoaqxvDnwAROFhBb6RG/hTcjsHnU6FY0Cbr9KS4ZWxi';

async function verifyPassword() {
  try {
    console.log('🔍 验证张三账号密码...');
    console.log(`📱 手机号：13800138000`);
    console.log(`🔑 输入密码：${password}`);
    console.log(`🔐 数据库哈希：${hashedPassword}`);
    
    const isValid = await bcrypt.compare(password, hashedPassword);
    
    if (isValid) {
      console.log('✅ 密码验证成功！密码 "123456" 是正确的');
    } else {
      console.log('❌ 密码验证失败！密码 "123456" 不正确');
      console.log('💡 可能的原因：');
      console.log('   1. 注册时使用了不同的密码');
      console.log('   2. 密码哈希过程中出现问题');
      console.log('   3. 数据库中的哈希值被损坏');
    }

    // 生成新的密码哈希用于对比
    console.log('\n🔄 生成新的 "123456" 密码哈希用于对比：');
    const newHash = await bcrypt.hash('123456', 10);
    console.log(`新哈希：${newHash}`);
    
    const newVerify = await bcrypt.compare('123456', newHash);
    console.log(`新哈希验证：${newVerify ? '✅ 成功' : '❌ 失败'}`);

  } catch (error) {
    console.error('❌ 验证过程出错：', error);
  }
}

verifyPassword();