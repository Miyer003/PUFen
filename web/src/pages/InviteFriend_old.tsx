import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { message } from 'antd';
import { LeftOutlined, ShareAltOutlined, TeamOutlined, CopyOutlined, UserAddOutlined, ReloadOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { SafeArea } from '../components/mobile';
import { setPageTitle, share } from '../utils/mobile';
import { teamService } from '../services/team';

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
`;

const ContentCard = styled.div`
  background: white;
  border-radius: 20px 20px 0 0;
  margin-top: 20px;
  padding: 30px 20px;
  flex: 1;
`;

const TeamInfoCard = styled.div`
  background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);
  border-radius: 16px;
  padding: 24px;
  color: white;
  text-align: center;
  margin-bottom: 24px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
    animation: shimmer 3s ease-in-out infinite;
  }
  
  @keyframes shimmer {
    0%, 100% { transform: scale(0.8); opacity: 0.5; }
    50% { transform: scale(1.2); opacity: 0.8; }
  }
  
  .team-icon {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.9;
  }
  
  .team-name {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 8px;
  }
  
  .team-stats {
    font-size: 14px;
    opacity: 0.9;
    line-height: 1.5;
  }
  
  .refresh-button {
    position: absolute;
    top: 16px;
    right: 16px;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    cursor: pointer;
    font-size: 18px;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: rotate(180deg);
    }
  }
  
  .refresh-warning {
    font-size: 12px;
    opacity: 0.8;
    margin-top: 8px;
    color: rgba(255, 255, 255, 0.9);
  }
`;

const ActionSection = styled.div`
  background: #f8fffe;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #e8f5e8;
  
  .section-title {
    font-size: 16px;
    font-weight: 600;
    color: #2c5530;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const InviteCodeBox = styled.div`
  background: white;
  border: 2px dashed #4CAF50;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  margin-bottom: 16px;
  
  .code-label {
    font-size: 12px;
    color: #666;
    margin-bottom: 8px;
  }
  
  .invite-code {
    font-size: 28px;
    font-weight: bold;
    color: #4CAF50;
    font-family: 'Courier New', monospace;
    letter-spacing: 3px;
    margin-bottom: 8px;
  }
  
  .code-tip {
    font-size: 12px;
    color: #999;
  }
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  width: 100%;
  padding: 14px 20px;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 12px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  ${props => props.variant === 'primary' ? `
    background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
    }
  ` : `
    background: white;
    color: #4CAF50;
    border: 2px solid #4CAF50;
    
    &:hover {
      background: #f8fffe;
      transform: translateY(-1px);
    }
  `}
  
  &:active {
    transform: translateY(0);
  }
`;

const InputSection = styled.div`
  background: #f8fffe;
  border-radius: 16px;
  padding: 20px;
  border: 1px solid #e8f5e8;
  
  .section-title {
    font-size: 16px;
    font-weight: 600;
    color: #2c5530;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .input-group {
    display: flex;
    gap: 12px;
    margin-bottom: 12px;
    
    input {
      flex: 1;
      padding: 14px 16px;
      border: 2px solid #e8f5e8;
      border-radius: 12px;
      background: white;
      font-size: 16px;
      color: #333;
      font-weight: 600;
      letter-spacing: 1px;
      text-align: center;
      text-transform: uppercase;
      
      &::placeholder {
        color: #bbb;
        font-weight: normal;
        letter-spacing: normal;
        text-transform: none;
      }
      
      &:focus {
        outline: none;
        border-color: #4CAF50;
        box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
      }
    }
    
    button {
      padding: 14px 20px;
      background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
      color: white;
      border: none;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      
      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
      }
      
      &:disabled {
        background: #ccc;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
      }
    }
  }
  
  .input-tip {
    font-size: 13px;
    color: #666;
    text-align: center;
    line-height: 1.4;
  }
`;

export default function InviteFriend() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [inviteCode, setInviteCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [hasTeam, setHasTeam] = useState(false);
  const [loading, setLoading] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [teamInfo, setTeamInfo] = useState({
    name: '我的团队',
    memberCount: 1,
    totalPoints: 50,
    remainingTime: 0,
    members: [] as any[]
  });

  // 加载团队信息
  const loadTeamInfo = async () => {
    try {
      setLoading(true);
      const response = await teamService.getMyActiveTeam();
      
      if (response.success && response.data) {
        const { team, members } = response.data;
        setTeamInfo({
          name: team.name,
          memberCount: team.memberCount,
          totalPoints: members.reduce((sum, member) => sum + member.pointsEarned, 0),
          remainingTime: team.remainingTime,
          members: members
        });
        setInviteCode(team.inviteCode);
        setHasTeam(true);
      } else {
        setHasTeam(false);
      }
    } catch (error) {
      console.error('加载团队信息失败:', error);
      setHasTeam(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPageTitle('邀请好友');
    
    // 检查URL参数中的邀请码
    const code = searchParams.get('code');
    if (code) {
      setInputCode(code);
      handleJoinTeam(code);
    }
    
    // 加载用户的团队信息
    loadTeamInfo();
  }, [searchParams]);

  const handleRefreshInviteCode = async () => {
    try {
      setLoading(true);
      const response = await teamService.refreshInviteCode();
      
      if (response.success && response.data) {
        setInviteCode(response.data.newInviteCode);
        message.success('邀请码已刷新，团队有效期重新计时3小时！');
        // 重新加载团队信息以获取最新状态
        await loadTeamInfo();
      } else {
        message.error(response.message || '刷新失败');
      }
    } catch (error) {
      console.error('刷新邀请码失败:', error);
      message.error('刷新失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 创建团队
  const handleCreateTeam = async () => {
    if (!teamName.trim()) {
      message.error('请输入团队名称');
      return;
    }
    
    try {
      setLoading(true);
      const response = await teamService.createTeam({ name: teamName.trim() });
      
      if (response.success && response.data) {
        message.success(`团队「${response.data.team.name}」创建成功！您获得了 ${response.data.pointsEarned} 分！`);
        // 重新加载团队信息
        await loadTeamInfo();
        setTeamName('');
      } else {
        message.error(response.message || '创建失败');
      }
    } catch (error) {
      console.error('创建团队失败:', error);
      message.error('创建失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinTeam = async (code: string) => {
    if (!code.trim()) {
      message.error('请输入邀请码');
      return;
    }
    
    try {
      setLoading(true);
      const response = await teamService.joinTeamByCode(code);
      
      if (response.success && response.data) {
        message.success(`成功加入团队！您获得了 ${response.data.pointsEarned} 分！`);
        // 重新加载团队信息
        await loadTeamInfo();
        setInputCode('');
      } else {
        message.error(response.message || '加入失败');
      }
    } catch (error) {
      console.error('加入团队失败:', error);
      message.error('加入失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      const shareText = `🎉 邀请你加入我的团队「${teamInfo.name}」，一起瓜分积分！\n\n邀请码：${inviteCode}\n\n快来参与吧！`;
      
      await share({
        title: '团队邀请',
        text: shareText,
        url: `${window.location.origin}/invite?code=${inviteCode}`
      });
    } catch (err) {
      console.error('分享失败:', err);
      // 如果分享API不可用，复制到剪贴板
      try {
        await navigator.clipboard.writeText(`${window.location.origin}/invite?code=${inviteCode}`);
        message.success('邀请链接已复制到剪贴板');
      } catch (clipErr) {
        console.error('复制失败:', clipErr);
        message.error('分享失败');
      }
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
      message.success('邀请码已复制');
    } catch (err) {
      console.error('复制失败:', err);
      message.error('复制失败');
    }
  };

  return (
    <Container>
      <SafeArea>
        <Header>
          <BackButton onClick={() => navigate(-1)}>
            <LeftOutlined />
          </BackButton>
          <Title>邀请好友</Title>
          <div style={{ width: '36px' }} />
        </Header>

        <ContentCard>
          {!hasTeam ? (
            // 没有团队时显示创建团队选项
            <ActionSection>
              <div className="section-title">
                <TeamOutlined />
                创建我的团队
              </div>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="输入团队名称"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  maxLength={20}
                />
                <button 
                  onClick={handleCreateTeam}
                  disabled={!teamName.trim() || loading}
                >
                  创建
                </button>
              </div>
            </ActionSection>
          ) : (
            // 有团队时显示团队信息
            <>
              <TeamInfoCard>
                <button className="refresh-button" onClick={handleRefreshInviteCode}>
                  <ReloadOutlined />
                </button>
                <TeamOutlined className="team-icon" />
                <div className="team-name">{teamInfo.name}</div>
                <div className="team-stats">
                  当前成员：{teamInfo.memberCount}/3 人<br />
                  团队积分：{teamInfo.totalPoints} 分
                </div>
              </TeamInfoCard>

              <ActionSection>
                <div className="section-title">
                  <ShareAltOutlined />
                  分享我的邀请码
                </div>
                <InviteCodeBox>
                  <div className="code-label">我的邀请码</div>
                  <div className="invite-code">{inviteCode}</div>
                  <div className="code-tip">分享此码邀请好友加入团队</div>
                </InviteCodeBox>
                <ActionButton variant="primary" onClick={handleShare}>
                  <ShareAltOutlined />
                  分享邀请链接
                </ActionButton>
                <ActionButton variant="secondary" onClick={handleCopyCode}>
                  <CopyOutlined />
                  复制邀请码
                </ActionButton>
              </ActionSection>
            </>
          )}

          <InputSection>
            <div className="section-title">
              <UserAddOutlined />
              加入其他团队
            </div>
            <div className="input-group">
              <input
                type="text"
                placeholder="输入 6 位邀请码"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                maxLength={6}
              />
              <button 
                onClick={() => handleJoinTeam(inputCode)}
                disabled={!inputCode.trim()}
              >
                加入
              </button>
            </div>
            <div className="input-tip">
              输入好友的邀请码即可加入他们的团队<br />
              每个人只能加入一个团队
            </div>
          </InputSection>
        </ContentCard>
      </SafeArea>
    </Container>
  );
}