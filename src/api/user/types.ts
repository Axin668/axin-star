/**
 * 登录用户信息
 */
export interface UserInfo {
  userId: number;
  nickname: string;
  avatar: string;
  roles: string[];
  perms: string[];
}
