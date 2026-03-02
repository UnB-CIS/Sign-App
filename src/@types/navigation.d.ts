import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type AppStackParamList = {
  MainTabs: NavigatorScreenParams<AppTabParamList>;
  Notifications: undefined;
  ModuleDetail: { moduleId: string };
  SignTeaching: { lessonId: string; moduleId: string };
  SignRecording: { lessonId: string; questionId: string };
  LessonComplete: { lessonId: string; moduleId: string; score: number; xpEarned: number };
  EditProfile: undefined;
  ChangePassword: undefined;
  BugReport: undefined;
};

export type AppTabParamList = {
  Home: undefined;
  Pesquisar: undefined;
  NewPost: undefined;
  Eventos: undefined;
  Perfil: undefined;
};

export type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;
export type RegisterScreenProps = NativeStackScreenProps<AuthStackParamList, 'Register'>;
export type HomeScreenProps = BottomTabScreenProps<AppTabParamList, 'Home'>;

export type AuthScreenProps<T extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, T>;

export type AppStackScreenProps<T extends keyof AppStackParamList> =
  NativeStackScreenProps<AppStackParamList, T>;

export type AppTabScreenProps<T extends keyof AppTabParamList> =
  BottomTabScreenProps<AppTabParamList, T>;
