import Redis from 'ioredis';
import { TlsType } from '../types/customTypes';

export const redis = new Redis({
  port: parseInt(process.env.REDIS_PORT, 10),
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PASSWORD,
  //tls: true as TlsType,
  tls: false as TlsType
});
