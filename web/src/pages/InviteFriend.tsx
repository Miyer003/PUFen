import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { message } from 'antd';
import { LeftOutlined, ShareAltOutlined, TeamOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { SafeArea } from '../components/mobile';
import { setPageTitle, share } from '../utils/mobile';

const InviteContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 20px 20px 0;
  
  .back-btn {
    font-size: 20px;
    margin-right: 15px;
    cursor: pointer;
  }
  
  .title {
    font-size: 18px;
    font-weight: bold;
  }
`;

const Content = styled.div`
  padding: 30px 20px;
`;

const TeamCard = styled.div`
  background: rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  margin-bottom: 30px;
  backdrop-filter: blur(10px);
  
  .team-icon {
    font-size: 60px;
    margin-bottom: 20px;
    opacity: 0.8;
  }
  
  .team-name {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  
  .team-desc {
    font-size: 16px;
    opacity: 0.9;
    line-height: 1.5;
  }
`;

const InviteSection = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 25px;
  
  .section-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    
    .icon {
      margin-right: 8px;
    }
  }
  
  .invite-code {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    padding: 15px;
    text-align: center;
    margin: 15px 0;
    
    .code {
      font-size: 24px;
      font-weight: bold;
      letter-spacing: 2px;
      font-family: monospace;
    }
    
    .tip {
      font-size: 14px;
      opacity: 0.8;
      margin-top: 8px;
    }
  }
`;

const ActionButton = styled.button`
  width: 100%;
  padding: 15px;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 15px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  .icon {
    margin-right: 8px;
  }
`;

const InputSection = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 25px;
  
  .section-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 15px;
  }
  
  .input-group {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
    
    input {
      flex: 1;
      padding: 12px 15px;
      border: none;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.9);
      font-size: 16px;
      
      &::placeholder {
        color: #999;
      }
    }
    
    button {
      padding: 12px 20px;
      background: #4CAF50;
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: bold;
      cursor: pointer;
      
      &:hover {
        background: #45a049;
      }
      
      &:disabled {
        background: #ccc;
        cursor: not-allowed;
      }
    }
  }
  
  .tip {
    font-size: 14px;
    opacity: 0.8;
    text-align: center;
  }
`;

export default function InviteFriend() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [inviteCode, setInviteCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [hasTeam, setHasTeam] = useState(false);
  const [teamInfo, setTeamInfo] = useState({
    name: '我的团队',
    memberCount: 1,
    totalPoints: 0
  });

  useEffect(() => {
    setPageTitle('邀请好友');
    
    // 检查URL参数中的邀请码
    const code = searchParams.get('code');
    if (code) {
      setInputCode(code);
      handleJoinTeam(code);
    }
    
    // 生成或获取用户的邀请码
    generateInviteCode();
  }, [searchParams]);

  const generateInviteCode = () => {
    // 生成一个简单的邀请码
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setInviteCode(code);
    setHasTeam(true); // 假设用户有团队
  };

  const handleJoinTeam = async (code: string) => {
    try {
      if (!code.trim()) {
        message.error('请输入邀请码');
        return;
      }
      
      // 模拟加入团队的逻辑
      console.log('加入团队，邀请码：', code);
      message.success(`成功加入团队！邀请码：${code}`);
      
      // 更新团队信息
      setTeamInfo({
        name: '新团队',
        memberCount: 2,
        totalPoints: 50
      });
      
      setInputCode('');
    } catch (error) {
      console.error('加入团队失败:', error);
      message.error('加入团队失败，请检查邀请码是否正确');
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
    <InviteContainer>
      <SafeArea>
        <Header>
          <LeftOutlined 
            className="back-btn" 
            onClick={() => navigate(-1)} 
          />
          <span className="title">邀请好友</span>
        </Header>

        <Content>
          <TeamCard>
            <TeamOutlined className="team-icon" />
            <div className="team-name">{teamInfo.name}</div>
            <div className="team-desc">
              当前成员：{teamInfo.memberCount}/6 人<br />
              团队积分：{teamInfo.totalPoints} 分
            </div>
          </TeamCard>

          {hasTeam && (
            <InviteSection>
              <div className="section-title">
                <ShareAltOutlined className="icon" />
                我的邀请码
              </div>
              <div className="invite-code">
                <div className="code">{inviteCode}</div>
                <div className="tip">分享此码邀请好友加入团队</div>
              </div>
              <ActionButton onClick={handleShare}>
                <ShareAltOutlined className="icon" />
                分享邀请链接
              </ActionButton>
              <ActionButton onClick={handleCopyCode}>
                复制邀请码
              </ActionButton>
            </InviteSection>
          )}

          <InputSection>
            <div className="section-title">加入其他团队</div>
            <div className="input-group">
              <input
                type="text"
                placeholder="输入邀请码"
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
            <div className="tip">
              输入好友的邀请码即可加入他们的团队
            </div>
          </InputSection>
        </Content>
      </SafeArea>
    </InviteContainer>
  );
}