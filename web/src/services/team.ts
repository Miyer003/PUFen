import { apiClient } from './api';
import {
  Team,
  TeamMember,
  CreateTeamRequest,
  ApiResponse,
  PaginatedResponse,
} from '@/types';

export const teamService = {
  // 创建团队
  async createTeam(data: CreateTeamRequest): Promise<ApiResponse<{
    team: Team;
    member: TeamMember;
    pointsEarned: number;
  }>> {
    return apiClient.post('/teams', data);
  },

  // 加入团队
  async joinTeam(teamId: string): Promise<ApiResponse<{
    pointsEarned: number;
    teamInfo: Team;
    memberInfo: TeamMember;
  }>> {
    return apiClient.post(`/teams/${teamId}/join`);
  },

  // 获取我的团队记录
  async getMyTeams(params?: {
    page?: number;
    limit?: number;
    status?: 'active' | 'completed' | 'expired';
  }): Promise<PaginatedResponse<TeamMember & { team: Team }>> {
    return apiClient.get('/teams/my', { params });
  },

  // 获取团队详情
  async getTeamDetail(teamId: string): Promise<ApiResponse<{
    team: Team;
    members: (TeamMember & { user: { username: string; phone: string } })[];
  }>> {
    return apiClient.get(`/teams/${teamId}`);
  },

  // 获取可加入的团队列表
  async getAvailableTeams(params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Team & { memberCount: number; captainName: string }>> {
    return apiClient.get('/teams/available', { params });
  },
};