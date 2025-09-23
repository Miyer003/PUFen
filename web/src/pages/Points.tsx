import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import {
  LeftOutlined,
  UnorderedListOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import { useAuthStore } from '@/store/auth';
import { usePointsStore } from '@/store/points';
import { pointsService } from '@/services/points';
import { teamService } from '@/services/team';
import { PullToRefresh, SafeArea } from '../components/mobile';
import { setPageTitle, vibrate } from '../utils/mobile';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);
  position: relative;
`;

const Header = styled.div`
  padding: 44px 20px 20px;
  color: white;
  position: relative;
  text-align: center;
`;

const BackButton = styled.div`
  position: absolute;
  left: 20px;
  top: 50px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const ActionButton = styled.div`
  position: absolute;
  right: 20px;
  top: 50px;
  color: white;
  font-size: 14px;
  cursor: pointer;
  
  .label {
    margin-left: 4px;
  }
`;

const Title = styled.h1`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
`;

const PointsSection = styled.div`
  text-align: center;
  padding: 20px;
  position: relative;
`;

const PointsPig = styled.div`
  width: 160px;
  height: 160px;
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%);
  border-radius: 50%;
  margin: 0 auto 20px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &::before {
    content: '';
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 50px;
    height: 10px;
    background: #8B4513;
    border-radius: 5px;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 30px;
    left: 35px;
    width: 25px;
    height: 20px;
    background: #ff9a9e;
    border-radius: 0 0 25px 25px;
    transform: rotate(-30deg);
  }
`;

const PointsAmount = styled.div`
  font-size: 64px;
  font-weight: bold;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const RemainderText = styled.div`
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  margin-bottom: 8px;
`;

const SignInReminder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
`;

const ContentCard = styled.div`
  background: white;
  border-radius: 16px 16px 0 0;
  margin-top: 20px;
  min-height: calc(100vh - 300px);
  padding: 20px;
`;

const SignInCalendar = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const DayItem = styled.div<{ isSignedIn?: boolean; isToday?: boolean; hasBonus?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 44px;
  
  .day-label {
    font-size: 12px;
    color: #666;
    margin-bottom: 8px;
  }
  
  .points-badge {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 600;
    position: relative;
    cursor: pointer;
    
    ${props => {
      if (props.isSignedIn) {
        return `
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          color: white;
        `;
      } else if (props.isToday) {
        return `
          background: #ff6b6b;
          color: white;
        `;
      } else {
        return `
          background: #f0f0f0;
          color: #999;
        `;
      }
    }}
    
    ${props => props.hasBonus && `
      &::after {
        content: '券';
        position: absolute;
        top: -4px;
        right: -4px;
        background: #ff4757;
        color: white;
        font-size: 8px;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    `}
  }
`;

const InviteSection = styled.div`
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  border-radius: 24px;
  padding: 16px;
  color: white;
  text-align: center;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 20px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(79, 172, 254, 0.4);
  }
`;

const RewardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 20px;
`;

const RewardItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  border-radius: 12px;
  background: #f8f9fa;
  cursor: pointer;
  
  .icon {
    width: 32px;
    height: 32px;
    background: #ff6b6b;
    border-radius: 8px;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 14px;
  }
  
  .title {
    font-size: 12px;
    color: #333;
    text-align: center;
    line-height: 1.2;
  }
  
  .desc {
    font-size: 10px;
    color: #666;
    text-align: center;
    margin-top: 2px;
  }
`;

const ExchangeSection = styled.div`
  margin-top: 20px;
  
  .section-title {
    font-size: 16px;
    font-weight: 600;
    color: #4CAF50;
    text-align: center;
    margin-bottom: 20px;
    position: relative;
    
    &::before,
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      width: 60px;
      height: 1px;
      background: #4CAF50;
    }
    
    &::before {
      left: 50px;
    }
    
    &::after {
      right: 50px;
    }
  }
`;

const CouponGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
`;

const CouponItem = styled.div`
  background: white;
  border: 2px dashed #ff6b6b;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  position: relative;
  
  .amount {
    font-size: 24px;
    font-weight: bold;
    color: #ff6b6b;
    margin-bottom: 8px;
  }
  
  .condition {
    background: #ff6b6b;
    color: white;
    font-size: 12px;
    padding: 4px 8px;
    border-radius: 12px;
    margin-bottom: 12px;
  }
  
  .title {
    font-size: 14px;
    color: #333;
    margin-bottom: 8px;
  }
  
  .points {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    color: #666;
    font-size: 12px;
    margin-bottom: 8px;
  }
  
  .exchange-btn {
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 16px;
    padding: 6px 16px;
    font-size: 12px;
    cursor: pointer;
    
    &:hover {
      background: #45a049;
    }
    
    &:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
  }
`;

const Points: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { pointsAccount, weeklyConfig, signInStatus } = usePointsStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
    setPageTitle('积分小猪');
  }, []);

  const loadData = async () => {
    if (loading) return; // 防止重复加载
    
    try {
      setLoading(true);
      
      // 并行加载数据
      const [accountRes, configRes, statusRes] = await Promise.all([
        pointsService.getPointsAccount(),
        pointsService.getWeeklyConfig(),
        pointsService.getSignInStatus(),
      ]);

      if (accountRes.success && accountRes.data) {
        usePointsStore.getState().setPointsAccount(accountRes.data);
      }

      if (configRes.success && configRes.data) {
        usePointsStore.getState().setWeeklyConfig(configRes.data);
      }

      if (statusRes.success && statusRes.data) {
        usePointsStore.getState().setSignInStatus(statusRes.data);
      }
    } catch (error) {
      message.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (dayIndex?: number) => {
    if (signInStatus?.todaySignedIn && dayIndex === undefined) {
      message.info('今日已签到');
      return;
    }

    try {
      setLoading(true);
      
      if (dayIndex !== undefined) {
        // 补签逻辑
        const date = new Date();
        date.setDate(date.getDate() - (6 - dayIndex));
        
        const response = await pointsService.makeUpSignIn({
          date: date.toISOString().split('T')[0],
          method: 'points'
        });
        
        if (response.success) {
          vibrate(150); // 补签振动反馈
          message.success(`补签成功！获得${response.data.pointsEarned}积分`);
          loadData();
        }
      } else {
        // 正常签到
        const response = await pointsService.signIn();
        
        if (response.success) {
          vibrate([100, 50, 100]); // 成功振动反馈
          message.success(`签到成功！获得${response.data.pointsEarned}积分`);
          if (response.data.hasBonus) {
            vibrate([150, 50, 150, 50, 150]); // 奖励振动反馈
            message.success(`连续签到奖励：${response.data.bonusCoupon}`);
          }
          loadData();
        }
      }
    } catch (error: any) {
      message.error(error?.message || '签到失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async () => {
    try {
      const teamName = `${user?.username}的团队`;
      const response = await teamService.createTeam({ name: teamName });
      
      if (response.success && response.data) {
        message.success(`团队创建成功！获得${response.data.pointsEarned}积分`);
        loadData();
      }
    } catch (error: any) {
      message.error(error?.message || '创建团队失败');
    }
  };

  const renderDayItem = (dayIndex: number) => {
    const dayLabels = ['第1天', '今天', '第3天', '第4天', '第5天', '第6天', '第7天'];
    const today = new Date().getDay();
    const adjustedToday = today === 0 ? 6 : today - 1; // 调整为周一为0
    
    const isToday = dayIndex === adjustedToday;
    const isSignedIn = signInStatus?.weeklyRecords?.some(record => {
      const recordDate = new Date(record.signInDate);
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() - (adjustedToday - dayIndex));
      return recordDate.toDateString() === targetDate.toDateString();
    });
    
    const multiplier = weeklyConfig ? Object.values(weeklyConfig)[dayIndex + 4] : 1; // day1Multiplier starts at index 4
    const points = Math.round((weeklyConfig?.basePoints || 10) * (multiplier as number));
    const hasBonus = weeklyConfig?.bonusDay === dayIndex + 1;

    return (
      <DayItem
        key={dayIndex}
        isToday={isToday}
        isSignedIn={isSignedIn}
        hasBonus={hasBonus}
        onClick={() => !isSignedIn && handleSignIn(dayIndex)}
      >
        <div className="day-label">{dayLabels[dayIndex]}</div>
        <div className="points-badge">
          {isSignedIn ? '✓' : `+${points}`}
        </div>
      </DayItem>
    );
  };

  return (
    <SafeArea>
      <PullToRefresh onRefresh={loadData}>
        <Container>
          <Header>
            <BackButton onClick={() => navigate(-1)}>
              <LeftOutlined />
            </BackButton>
            
            <Title>我的积分</Title>
            
            <ActionButton onClick={() => navigate('/records')}>
              <UnorderedListOutlined />
              <span className="label">记录 | 规则</span>
            </ActionButton>
          </Header>

          <PointsSection>
            <PointsPig>
              <PointsAmount>{pointsAccount?.balance || 0}</PointsAmount>
            </PointsPig>
            
            <RemainderText>再签1天可获惊喜礼包</RemainderText>
            
            <SignInReminder>
              <QuestionCircleOutlined />
              <span>签到提醒</span>
            </SignInReminder>
          </PointsSection>

      <ContentCard>
        <SignInCalendar>
          {Array.from({ length: 7 }, (_, i) => renderDayItem(i))}
        </SignInCalendar>

        <InviteSection onClick={handleCreateTeam}>
          邀请好友瓜分100积分
        </InviteSection>

        <RewardGrid>
          <RewardItem onClick={() => navigate('/exchange')}>
            <div className="icon">¥40</div>
            <div className="title">40元免费领</div>
            <div className="desc">满59元可用</div>
          </RewardItem>
          
          <RewardItem>
            <div className="icon">拼</div>
            <div className="title">0.1元抢鸡蛋</div>
            <div className="desc">2人团免运费</div>
          </RewardItem>
          
          <RewardItem>
            <div className="icon">¥10</div>
            <div className="title">领:10元大额...</div>
            <div className="desc">只需1人助力</div>
          </RewardItem>
          
          <RewardItem>
            <div className="icon">福</div>
            <div className="title">福利中心</div>
            <div className="desc">日日有福利</div>
          </RewardItem>
        </RewardGrid>

        {/* 开发环境显示演示链接 */}
        {(typeof import.meta !== 'undefined' && import.meta.env?.DEV) && (
          <InviteSection onClick={() => navigate('/demo')} style={{ marginBottom: 20, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            📱 移动端功能演示 (开发版)
          </InviteSection>
        )}

        <ExchangeSection>
          <div className="section-title">积分兑换区</div>
          
          <CouponGrid>
            <CouponItem>
              <div className="amount">¥3</div>
              <div className="condition">满59元可用</div>
              <div className="title">59减3优惠券</div>
              <div className="points">
                <span>🪙 29</span>
              </div>
              <button className="exchange-btn">兑换</button>
            </CouponItem>
            
            <CouponItem>
              <div className="amount">¥10</div>
              <div className="condition">满189元可用</div>
              <div className="title">189减10优惠券</div>
              <div className="points">
                <span>🪙 5</span>
              </div>
              <button className="exchange-btn">兑换</button>
            </CouponItem>
          </CouponGrid>
        </ExchangeSection>
      </ContentCard>
    </Container>
    </PullToRefresh>
    </SafeArea>
  );
};

export default Points;