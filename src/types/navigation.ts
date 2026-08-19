import { User, Post } from './index';

export type RootStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  Login: undefined;
  OTP: { mobile: string; otp?: string; user?: User };
  Register: { mobile: string };
  MainTabs: { screen?: keyof MainTabParamList; user?: User; params?: any };
  Map: { user?: User };
  Chat: { user?: User; donor?: string };
  Tips: undefined;
  ChatRoom: {
    hospitalName?: string;
    partnerMobile?: string;
    partnerType?: string;
    threadId?: string;
    online?: boolean;
    user?: User;
    mobile?: string;
  };
  Certificates: { API_URL?: string };
  Posts: { refreshTrigger?: number };
  EditProfile: { user?: User; API_URL?: string };
  LocationSettings: undefined;
  Notifications: undefined;
  MyPosts: { refreshTrigger?: number };
  Campaigns: undefined;
  AddCertificate: { API_URL?: string };
  Confirmation: { date: string; time: string; location: string };
  Schedule: { post: Post };
  CreatePost: { fromScreen?: string };
};

export type MainTabParamList = {
  Blog: undefined;
  Home: { user?: User };
  Settings: { user?: User; API_URL?: string };
};
