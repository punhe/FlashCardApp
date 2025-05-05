import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  CreateSet: undefined;
  SetDetails: { setId: string };
  EditSet: { setId: string };
  CreateCard: { setId: string };
  EditCard: { cardId: string; setId: string };
  StudyMode: { setId: string };
  Stats: { setId: string };
  Share: { setId: string };
  ImportSet: { shareCode: string };
};

export type MainTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  Profile: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
}; 