import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const SERVER_URL =
  process.env.NODE_ENV === 'development' ? process.env.NODE_ENV : '';

const APP_AGENT_VERSION =
  process.env.NODE_ENV === 'development' ? process.env.AGENT_VERSION : '1.0.0';

export const DEFAULT_TUNNEL_SERVER = SERVER_URL;
export const AGENT_VERSION = APP_AGENT_VERSION;
