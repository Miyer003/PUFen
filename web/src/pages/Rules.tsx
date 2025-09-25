import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { LeftOutlined } from '@ant-design/icons';
import { SafeArea } from '../components/mobile';
import { setPageTitle } from '../utils/mobile';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);
`;

const Header = styled.div`
  padding: 44px 20px 20px;
  color: white;
  position: relative;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const BackButton = styled.button`
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

const Title = styled.h1`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: white;
  flex: 1;
`;

const ContentCard = styled.div`
  background: white;
  border-radius: 16px 16px 0 0;
  margin-top: 20px;
  min-height: calc(100vh - 120px);
  padding: 24px;
`;

const RuleSection = styled.div`
  margin-bottom: 32px;
  
  .section-title {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .section-content {
    background: #f8f9fa;
    border-radius: 12px;
    padding: 16px;
    line-height: 1.6;
    color: #666;
  }
`;

const PointsTable = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 16px;
  margin: 16px 0;
  
  .table-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #e0e0e0;
    
    &:last-child {
      border-bottom: none;
    }
    
    .day {
      font-weight: 500;
      color: #333;
    }
    
    .points {
      color: #4CAF50;
      font-weight: 600;
    }
  }
`;

const CouponGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin: 16px 0;
`;

const CouponItem = styled.div`
  background: white;
  border: 2px dashed #4CAF50;
  border-radius: 12px;
  padding: 12px;
  text-align: center;
  
  .amount {
    font-size: 18px;
    font-weight: bold;
    color: #4CAF50;
    margin-bottom: 4px;
  }
  
  .condition {
    font-size: 12px;
    color: #666;
    margin-bottom: 4px;
  }
  
  .points {
    font-size: 12px;
    color: #4CAF50;
    font-weight: 500;
  }
`;

const HighlightBox = styled.div`
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  border-radius: 12px;
  padding: 16px;
  margin: 16px 0;
  text-align: center;
  
  .title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 8px;
  }
  
  .content {
    font-size: 14px;
    opacity: 0.9;
  }
`;

const Rules: React.FC = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    setPageTitle('积分规则');
  }, []);

  return (
    <SafeArea>
      <Container>
        <Header>
          <BackButton onClick={() => navigate(-1)}>
            <LeftOutlined />
          </BackButton>
          
          <Title>积分规则</Title>
          
          <div style={{ width: '36px' }} />
        </Header>

        <ContentCard>
          <RuleSection>
            <div className="section-title">
              🐷 关于PU分积分系统
            </div>
            <div className="section-content">
              PU分是一个有趣的积分签到系统，以可爱的小猪存钱罐为主题。通过每日签到获取积分，积分可以兑换各种优惠券，让您的购物更加实惠！
            </div>
          </RuleSection>

          <RuleSection>
            <div className="section-title">
              📅 每日签到规则
            </div>
            <div className="section-content">
              每天都可以进行签到获取积分，不同的星期获得的积分倍数不同：
            </div>
            
            <PointsTable>
              <div className="table-row">
                <span className="day">周一</span>
                <span className="points">10积分 (基础)</span>
              </div>
              <div className="table-row">
                <span className="day">周二-周五</span>
                <span className="points">10或15积分 (随机)</span>
              </div>
              <div className="table-row">
                <span className="day">周六</span>
                <span className="points">6积分 (休息日)</span>
              </div>
              <div className="table-row">
                <span className="day">周日</span>
                <span className="points">20积分 (双倍奖励)</span>
              </div>
            </PointsTable>
          </RuleSection>

          <RuleSection>
            <div className="section-title">
              🎁 连续签到奖励
            </div>
            <div className="section-content">
              连续签到3-5天（随机）后，您将获得额外的优惠券奖励！奖励包括各种满减优惠券，让您的积分收益翻倍。
            </div>
            
            <HighlightBox>
              <div className="title">💝 惊喜礼包</div>
              <div className="content">坚持签到，获得连续签到奖励优惠券</div>
            </HighlightBox>
          </RuleSection>

          <RuleSection>
            <div className="section-title">
              🎫 积分兑换商城
            </div>
            <div className="section-content">
              使用积分兑换各种优惠券，兑换所需积分合理，让每一分积分都有价值：
            </div>
            
            <CouponGrid>
              <CouponItem>
                <div className="amount">¥4优惠券</div>
                <div className="condition">满29元可用</div>
                <div className="points">需要5积分</div>
              </CouponItem>
              
              <CouponItem>
                <div className="amount">¥6优惠券</div>
                <div className="condition">满39元可用</div>
                <div className="points">需要10积分</div>
              </CouponItem>
              
              <CouponItem>
                <div className="amount">¥8优惠券</div>
                <div className="condition">满59元可用</div>
                <div className="points">需要15积分</div>
              </CouponItem>
              
              <CouponItem>
                <div className="amount">¥12优惠券</div>
                <div className="condition">满89元可用</div>
                <div className="points">需要20积分</div>
              </CouponItem>
              
              <CouponItem>
                <div className="amount">¥15优惠券</div>
                <div className="condition">满119元可用</div>
                <div className="points">需要25积分</div>
              </CouponItem>
              
              <CouponItem>
                <div className="amount">¥20优惠券</div>
                <div className="condition">满149元可用</div>
                <div className="points">需要30积分</div>
              </CouponItem>
            </CouponGrid>
          </RuleSection>

          <RuleSection>
            <div className="section-title">
              👥 团队瓜分
            </div>
            <div className="section-content">
              邀请好友加入您的团队，团队成员签到时，您也能获得额外积分奖励。团队越大，收益越多！
            </div>
            
            <HighlightBox>
              <div className="title">🤝 邀请好友</div>
              <div className="content">创建团队，邀请好友一起签到，共享积分收益</div>
            </HighlightBox>
          </RuleSection>

          <RuleSection>
            <div className="section-title">
              ⚠️ 重要提醒
            </div>
            <div className="section-content">
              • 每天只能签到一次<br/>
              • 错过的签到可以使用积分补签<br/>
              • 积分有效期为获得后一年<br/>
              • 优惠券使用需符合对应的满减条件<br/>
              • 团队积分瓜分需要团队成员都完成签到
            </div>
          </RuleSection>

          <div style={{ textAlign: 'center', padding: '20px 0', color: '#999', fontSize: '14px' }}>
            🐷 让每一天的签到都充满乐趣！
          </div>
        </ContentCard>
      </Container>
    </SafeArea>
  );
};

export default Rules;