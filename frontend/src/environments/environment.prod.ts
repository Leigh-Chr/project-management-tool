import { Environment } from './environment.interface';

export const environment: Environment = {
  production: true,
  apiUrl: 'https://pmt-backend-production.up.railway.app/api',
  logLevel: 'error',
  featureFlag: true,
};
