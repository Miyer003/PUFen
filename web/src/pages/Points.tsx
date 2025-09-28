import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import {
  UnorderedListOutlined,
  QuestionCircleOutlined,
  UserOutlined,
  GiftOutlined,
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
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 16px;
`;

const UserButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  cursor: pointer;
  font-size: 16px;
  border-radius: 50%;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  cursor: pointer;
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 12px;
  min-width: 44px;
  
  .label {
    margin-left: 2px;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const Title = styled.h1`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  cursor: pointer;
  user-select: none;
  
  &:active {
    opacity: 0.7;
  }
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

const DayItem = styled.div<{ isSignedIn?: boolean; isToday?: boolean; hasBonus?: boolean; isFuture?: boolean }>`
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
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 600;
    position: relative;
    cursor: ${props => (props.isFuture || (props.isToday && props.isSignedIn)) ? 'default' : 'pointer'};
    transition: all 0.2s ease;
    
    .check-icon {
      font-size: 18px;
      line-height: 1;
    }
    
    .points-text {
      font-size: 9px;
      line-height: 1;
      margin-top: 2px;
      opacity: 0.8;
    }
    
    ${props => {
      if (props.isSignedIn) {
        return `
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          color: white;
          box-shadow: 0 2px 8px rgba(79, 172, 254, 0.3);
          border: 2px solid #fff;
        `;
      } else if (props.isToday && !props.isSignedIn) {
        return `
          background: linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%);
          color: white;
          box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
          border: 2px solid #fff;
          animation: pulse 2s infinite;
          &:hover {
            transform: scale(1.05);
          }
          
          @keyframes pulse {
            0% {
              box-shadow: 0 0 0 0 rgba(255, 107, 107, 0.4);
            }
            70% {
              box-shadow: 0 0 0 8px rgba(255, 107, 107, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(255, 107, 107, 0);
            }
          }
        `;
      } else if (props.isFuture) {
        return `
          background: #f5f5f5;
          color: #ccc;
          border: 2px dashed #ddd;
          cursor: not-allowed;
        `;
      } else {
        return `
          background: #f0f0f0;
          color: #999;
          border: 2px dashed #ddd;
        `;
      }
    }}
    
    ${props => props.hasBonus && `
      &::after {
        content: '🎁';
        position: absolute;
        top: -6px;
        right: -6px;
        background: #ff4757;
        font-size: 8px;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid white;
      }
    `}
  }
  
  .future-text {
    font-size: 10px;
    color: #ccc;
    margin-top: 4px;
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
    setPageTitle('PUFen');
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

  const handleSignIn = async () => {
    if (signInStatus?.todaySignedIn) {
      message.info('今日已签到');
      return;
    }

    try {
      setLoading(true);
      
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
    const dayLabels = ['第1天', '第2天', '第3天', '第4天', '第5天', '第6天', '第7天'];
    
    if (!signInStatus?.weekStatus) {
      return null;
    }
    
    const dayStatus = signInStatus.weekStatus[dayIndex];
    if (!dayStatus) return null;
    
    const isToday = dayStatus.isToday;
    const isSignedIn = dayStatus.signed;
    const points = dayStatus.points;
    
    // 判断是否是未来日期
    const today = new Date();
    const dayDate = new Date(dayStatus.date);
    const isFuture = dayDate > today;
    
    // 从配置中获取当天的积分倍数
    const multiplierKey = `day${dayIndex + 1}Multiplier` as keyof typeof weeklyConfig;
    const multiplier = (weeklyConfig?.[multiplierKey] as unknown as number) || 1;
    const expectedPoints = Math.round((weeklyConfig?.basePoints || 10) * multiplier);
    
    const hasBonus = weeklyConfig?.bonusDay === (dayIndex + 1);

    const handleClick = () => {
      if (isFuture) {
        message.info('未来日期无法签到');
        return;
      }
      if (isToday && !isSignedIn) {
        handleSignIn();
      } else if (isToday && isSignedIn) {
        message.info('今日已签到');
      }
    };

    return (
      <DayItem
        key={dayIndex}
        isToday={isToday}
        isSignedIn={isSignedIn}
        hasBonus={hasBonus}
        isFuture={isFuture}
        onClick={handleClick}
      >
        <div className="day-label">{dayLabels[dayIndex]}</div>
        <div className="points-badge">
          {isSignedIn ? (
            <>
              <div className="check-icon">✓</div>
              <div className="points-text">+{points}</div>
            </>
          ) : isFuture ? (
            <div style={{fontSize: '11px', color: '#ccc'}}>+{expectedPoints}</div>
          ) : (
            <div style={{fontSize: '11px', fontWeight: 'bold'}}>+{expectedPoints}</div>
          )}
        </div>
        {isFuture && <div className="future-text">未来</div>}
      </DayItem>
    );
  };

  // 计算礼包提示信息
  const getBonusReminder = () => {
    if (!weeklyConfig || !signInStatus) {
      return '签到可获取积分奖励';
    }
    
    const bonusDay = weeklyConfig.bonusDay;
    const continuousDays = signInStatus.continuousDays;
    
    // 修复逻辑：直接使用后端返回的连续天数
    if (continuousDays >= bonusDay) {
      return `已获得${weeklyConfig.bonusCoupon}奖励！`;
    }
    
    const daysLeft = bonusDay - continuousDays;
    return `再签${daysLeft}天可获${weeklyConfig.bonusCoupon}`;
  };

  const handleTitleLongPress = () => {
    navigate('/profile');
  };

  return (
    <SafeArea>
      <PullToRefresh onRefresh={loadData}>
        <Container>
          <Header>
            <HeaderTop>
              <UserButton onClick={() => navigate('/profile')}>
                <UserOutlined />
              </UserButton>
              
              <Title 
                onTouchStart={() => {
                  let pressTimer = setTimeout(() => {
                    vibrate(100);
                    handleTitleLongPress();
                  }, 800);
                  
                  const clearTimer = () => {
                    clearTimeout(pressTimer);
                    document.removeEventListener('touchend', clearTimer);
                    document.removeEventListener('touchmove', clearTimer);
                  };
                  
                  document.addEventListener('touchend', clearTimer);
                  document.addEventListener('touchmove', clearTimer);
                }}
              >
                我的积分
              </Title>
              
              <ActionButtons>
                <ActionButton onClick={() => navigate('/records')}>
                  <UnorderedListOutlined />
                  <span className="label">记录</span>
                </ActionButton>
                
                <ActionButton onClick={() => navigate('/coupons')}>
                  <GiftOutlined />
                  <span className="label">券</span>
                </ActionButton>
                
                <ActionButton onClick={() => navigate('/rules')}>
                  <QuestionCircleOutlined />
                  <span className="label">规则</span>
                </ActionButton>
              </ActionButtons>
            </HeaderTop>
          </Header>

          <PointsSection>
            <PointsPig>
              <PointsAmount>{pointsAccount?.balance || 0}</PointsAmount>
            </PointsPig>
            
            <RemainderText>{getBonusReminder()}</RemainderText>
            
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
          <RewardItem onClick={() => navigate('/demo')} style={{ gridColumn: 'span 4' }}>
            <div className="icon" style={{ background: '#667eea' }}>📱</div>
            <div className="title">移动端功能演示</div>
            <div className="desc">H5特性展示</div>
          </RewardItem>
        </RewardGrid>

        <ExchangeSection>
          <div className="section-title">积分兑换区</div>
          
          <CouponGrid>
            <CouponItem>
              <div className="amount">¥4</div>
              <div className="condition">满29元可用</div>
              <div className="title">满29减4优惠券</div>
              <div className="points">
                <span>🪙 5积分</span>
              </div>
              <button className="exchange-btn">兑换</button>
            </CouponItem>
            
            <CouponItem>
              <div className="amount">¥6</div>
              <div className="condition">满39元可用</div>
              <div className="title">满39减6优惠券</div>
              <div className="points">
                <span>🪙 10积分</span>
              </div>
              <button className="exchange-btn">兑换</button>
            </CouponItem>
            
            <CouponItem>
              <div className="amount">¥8</div>
              <div className="condition">满59元可用</div>
              <div className="title">满59减8优惠券</div>
              <div className="points">
                <span>🪙 15积分</span>
              </div>
              <button className="exchange-btn">兑换</button>
            </CouponItem>
            
            <CouponItem>
              <div className="amount">¥12</div>
              <div className="condition">满89元可用</div>
              <div className="title">满89减12优惠券</div>
              <div className="points">
                <span>🪙 20积分</span>
              </div>
              <button className="exchange-btn">兑换</button>
            </CouponItem>
            
            <CouponItem>
              <div className="amount">¥15</div>
              <div className="condition">满119元可用</div>
              <div className="title">满119减15优惠券</div>
              <div className="points">
                <span>🪙 25积分</span>
              </div>
              <button className="exchange-btn">兑换</button>
            </CouponItem>
            
            <CouponItem>
              <div className="amount">¥20</div>
              <div className="condition">满149元可用</div>
              <div className="title">满149减20优惠券</div>
              <div className="points">
                <span>🪙 30积分</span>
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