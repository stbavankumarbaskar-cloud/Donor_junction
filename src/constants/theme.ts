import { Platform } from 'react-native';
import Constants from 'expo-constants';

export const COLORS = {
  PRIMARY: '#DA0037',
  SECONDARY: '#111111',
  BACKGROUND: '#FFFFFF',
  GRAY: '#999999',
  LIGHT_GRAY: '#f8f8f8',
  SUCCESS: '#27500A',
  INFO: '#0C447C'
};

const getHostIp = () => {
  if (Platform.OS === 'web') return 'localhost';
  
  // Extract host IP dynamically from Expo server URL if available
  const hostUri = Constants.expoConfig?.hostUri || (Constants as any).manifest?.debuggerHost || (Constants as any).manifest2?.extra?.expoGo?.debuggerHost;
  if (hostUri) {
    const ip = hostUri.split(':')[0];
    if (ip && ip !== 'localhost' && ip !== '127.0.0.1') {
      return ip;
    }
  }
  
  // Fallback to current LAN IP
  return '192.168.1.56';
};

const activeIp = getHostIp();
const usePhpCliServer = true;

export const API_URL = usePhpCliServer
  ? (Platform.OS === 'web' ? 'http://localhost:8000' : `http://${activeIp}:8000`)
  : (Platform.OS === 'web' ? 'http://localhost/Donor_junction/backend' : `http://${activeIp}/Donor_junction/backend`);
