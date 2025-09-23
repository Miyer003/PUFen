import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, Empty, message } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import dayjs from 'dayjs';
import { pointsService } from '@/services/points';
import { teamService } from '@/services/team';
import { rewardService } from '@/services/reward';

const Container = styled.div`
  min-height: 100vh;
  background: #f5f5f5;
`;

const Header = styled.div`
  background: white;
  padding: 44px 20px 20px;
  position: relative;
  text-align: center;
  border-bottom: 1px solid #eee;
`;

const BackButton = styled.div`
  position: absolute;
  left: 20px;
  top: 50px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #333;
`;

const Title = styled.h1`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: #333;
`;

const Content = styled.div`
  padding: 0;
`;

const StyledTabs = styled(Tabs)`
  background: white;
  
  .ant-tabs-nav {
    margin: 0;
    padding: 0 20px;
  }
  
  .ant-tabs-tab {
    color: #666;
    font-weight: 500;
    
    &.ant-tabs-tab-active {
      color: #4CAF50;
    }
  }
  
  .ant-tabs-ink-bar {
    background: #4CAF50;
  }
  
  .ant-tabs-content-holder {
    padding: 0;
  }
`;

const TabContent = styled.div`
  padding: 20px;
  min-height: calc(100vh - 200px);
`;

const DateFilter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 20px;
  color: #666;
  font-size: 14px;
`;

const RecordItem = styled.div`
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  
  .record-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }
  
  .record-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
  }
  
  .points-change {
    font-size: 16px;
    font-weight: 600;
    
    &.positive {
      color: #4CAF50;
    }
    
    &.negative {
      color: #f44336;
    }
  }
  
  .record-details {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    color: #666;
  }
  
  .record-time {
    font-size: 12px;
    color: #999;
  }
  
  .record-balance {
    font-size: 12px;
    color: #999;
  }
`;

const LoadMoreButton = styled.div`
  text-align: center;
  padding: 20px;
  color: #666;
  cursor: pointer;
  
  &:hover {
    color: #4CAF50;
  }
`;

const Records: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('points');
  const [pointsRecords, setPointsRecords] = useState<any[]>([]);
  const [teamRecords, setTeamRecords] = useState<any[]>([]);
  const [exchangeRecords, setExchangeRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    if (loading) return; // 防止重复加载
    
    try {
      setLoading(true);
      
      switch (activeTab) {
        case 'points':
          const pointsRes = await pointsService.getPointsTransactions({
            page: 1,
            limit: 20,
            type: 'earn'
          });
          if (pointsRes.success && pointsRes.data) {
            setPointsRecords(pointsRes.data.records);
          }
          break;
          
        case 'team':
          const teamRes = await teamService.getMyTeams({
            page: 1,
            limit: 20
          });
          if (teamRes.success && teamRes.data) {
            setTeamRecords(teamRes.data.records);
          }
          break;
          
        case 'exchange':
          const exchangeRes = await rewardService.getExchangeRecords({
            page: 1,
            limit: 20
          });
          if (exchangeRes.success && exchangeRes.data) {
            setExchangeRecords(exchangeRes.data.records);
          }
          break;
      }
    } catch (error) {
      message.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  const renderPointsRecord = (record: any) => (
    <RecordItem key={record.id}>
      <div className="record-header">
        <div className="record-title">{record.description}</div>
        <div className={`points-change ${record.amount > 0 ? 'positive' : 'negative'}`}>
          {record.amount > 0 ? '+' : ''}{record.amount}积分
        </div>
      </div>
      <div className="record-details">
        <div className="record-time">
          {dayjs(record.createdAt).format('MM/DD HH:mm')}
        </div>
        <div className="record-balance">
          剩余{record.balanceAfter}
        </div>
      </div>
    </RecordItem>
  );

  const renderTeamRecord = (record: any) => (
    <RecordItem key={record.id}>
      <div className="record-header">
        <div className="record-title">积分瓜分</div>
        <div className="points-change positive">
          +{record.pointsEarned}积分
        </div>
      </div>
      <div className="record-details">
        <div className="record-time">
          {dayjs(record.joinedAt).format('MM/DD HH:mm')}
        </div>
        <div className="record-balance">
          剩余{record.pointsEarned}
        </div>
      </div>
    </RecordItem>
  );

  const renderExchangeRecord = (record: any) => (
    <RecordItem key={record.id}>
      <div className="record-header">
        <div className="record-title">{record.rewardItem?.name}</div>
        <div className="points-change negative">
          -{record.pointsCost}积分
        </div>
      </div>
      <div className="record-details">
        <div className="record-time">
          {dayjs(record.createdAt).format('MM/DD HH:mm')}
        </div>
        <div className="record-balance">
          {record.status === 'completed' ? '已完成' : '待处理'}
        </div>
      </div>
    </RecordItem>
  );

  const tabItems = [
    {
      key: 'points',
      label: '积分记录',
      children: (
        <TabContent>
          <DateFilter>
            <span>2025/09 ▼</span>
          </DateFilter>
          
          {pointsRecords.length > 0 ? (
            <>
              {pointsRecords.map(renderPointsRecord)}
              <LoadMoreButton>上拉加载更多</LoadMoreButton>
            </>
          ) : (
            <Empty description="暂无积分记录" />
          )}
        </TabContent>
      ),
    },
    {
      key: 'team',
      label: '组队记录',
      children: (
        <TabContent>
          {teamRecords.length > 0 ? (
            <>
              {teamRecords.map(renderTeamRecord)}
              <LoadMoreButton>上拉加载更多</LoadMoreButton>
            </>
          ) : (
            <Empty description="暂无组队记录" />
          )}
        </TabContent>
      ),
    },
    {
      key: 'exchange',
      label: '兑换记录',
      children: (
        <TabContent>
          {exchangeRecords.length > 0 ? (
            <>
              {exchangeRecords.map(renderExchangeRecord)}
              <LoadMoreButton>上拉加载更多</LoadMoreButton>
            </>
          ) : (
            <Empty description="暂无兑换记录" />
          )}
        </TabContent>
      ),
    },
  ];

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          <LeftOutlined />
        </BackButton>
        <Title>记录</Title>
      </Header>

      <Content>
        <StyledTabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
        />
      </Content>
    </Container>
  );
};

export default Records;