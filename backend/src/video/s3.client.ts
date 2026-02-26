import { S3Client } from '@aws-sdk/client-s3';

export const s3 = new S3Client({
  endpoint: process.env.MINIO_ENDPOINT ?? 'http://localhost:9000',
  region: 'ru-cental-1',
  credentials: {
    accessKeyId: process.env.MINIO_USER ?? 'minioadmin',
    secretAccessKey: process.env.MINIO_PASSWORD ?? 'minioadmin',
  },
  forcePathStyle: true,
});

export const BUCKET = 'videos';
