import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../interfaces/interface';

// Navigation prop types
export type RootStackNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

// Route prop types
export type ServiceDetailsRouteProp = RouteProp<
  RootStackParamList,
  'Service Details'
>;
export type BookedEventsRouteProp = RouteProp<
  RootStackParamList,
  'BookedEvents'
>;
export type UpcomingEventsRouteProp = RouteProp<
  RootStackParamList,
  'UpcomingEvents'
>;
export type PastEventsRouteProp = RouteProp<RootStackParamList, 'PastEvents'>;
export type TabsRouteProp = RouteProp<RootStackParamList, 'Tabs'>;

// Navigation hook types
export interface UseNavigationReturn {
  navigate: (name: keyof RootStackParamList, params?: any) => void;
  goBack: () => void;
  canGoBack: () => boolean;
}

export interface UseRouteReturn<T extends keyof RootStackParamList> {
  params: RootStackParamList[T];
  name: T;
}

// Screen prop types
export interface ScreenProps<
  T extends keyof RootStackParamList = keyof RootStackParamList,
> {
  navigation: RootStackNavigationProp;
  route: RouteProp<RootStackParamList, T>;
}

// Tab navigation types
export type TabParamList = {
  Home: undefined;
  Events: undefined;
  'Create Service': undefined;
  Cart: undefined;
  Profile: undefined;
};

export type TabNavigationProp = NativeStackNavigationProp<TabParamList>;
