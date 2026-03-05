import {
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable, NotFoundException } from '@nestjs/common';
import { s3, BUCKET } from './s3.client';
import { Upload } from '@aws-sdk/lib-storage';
// import { Readable } from 'stream';
import { compressVideo } from './video.utils';

@Injectable()
export class VideoService {
  private readonly s3: S3Client = s3;

  async saveVideo(file: Express.Multer.File): Promise<{ filename: string }> {
    const filename = Date.now() + '.mp4';
    const compressed = await compressVideo(file.buffer);
    const upload = new Upload({
      client: this.s3,
      params: {
        Bucket: BUCKET,
        Key: filename,
        Body: compressed,
        ContentType: file.mimetype,
      },
    });

    await upload.done();
    return { filename };
  }

  async getFileInfo(filename: string): Promise<{ fileSize: number }> {
    try {
      const command = new HeadObjectCommand({ Bucket: BUCKET, Key: filename });
      const { ContentLength } = await this.s3.send(command);
      return { fileSize: ContentLength ?? 0 };
    } catch {
      throw new NotFoundException('Видео не найдено');
    }
  }

  async getPresignedUrl(filename: string): Promise<{ url: string }> {
    const command = new GetObjectCommand({ Bucket: BUCKET, Key: filename });
    const url = await getSignedUrl(this.s3, command, {
      expiresIn: 3600,
    });
    return { url };
  }
  async getVideoList(): Promise<string[]> {
    const command = new ListObjectsV2Command({ Bucket: BUCKET });
    const { Contents } = await this.s3.send(command);
    return (Contents ?? []).map((item) => item.Key ?? '').filter(Boolean);
  }
}
