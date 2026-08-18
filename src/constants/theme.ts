import { Platform } from 'react-native';

export const COLORS = {
  PRIMARY: '#DA0037',
  SECONDARY: '#111111',
  BACKGROUND: '#FFFFFF',
  GRAY: '#999999',
  LIGHT_GRAY: '#f8f8f8',
  SUCCESS: '#27500A',
  INFO: '#0C447C'
};

const activeIp = '192.168.1.36';
const usePhpCliServer = true;

export const API_URL = usePhpCliServer
  ? (Platform.OS === 'web' ? 'http://localhost:8000' : `http://${activeIp}:8000`)
  : (Platform.OS === 'web' ? 'http://localhost/Donor_junction/backend' : `http://${activeIp}/Donor_junction/backend`);
