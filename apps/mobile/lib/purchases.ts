import { Platform } from 'react-native';
import Purchases from 'react-native-purchases';
import { config } from './config';

export function configurePurchases() {
  const key = Platform.OS === 'ios' ? config.revenueCatIosKey : config.revenueCatAndroidKey;
  if (key) Purchases.configure({ apiKey: key });
}
