import {
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable, NotFoundException } from '@nestjs/common';
import { s3, BUCKET } from './s3.client';
import { Upload } from '@aws-sdk/lib-storage';
import { Readable } from 'stream';
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

  async streamVideo(
    fileName: string,
    range: string,
  ): Promise<{
    stream: Readable;
    headers: Record<string, string | number>;
    status: 200 | 206;
  }> {
    const { fileSize } = await this.getFileInfo(fileName);

    if (range) {
      const [startStr, endStr] = range.replace('bytes=', '').split('-');
      const start = parseInt(startStr, 10);
      const end = endStr ? parseInt(endStr, 10) : fileSize - 1;

      const command = new GetObjectCommand({
        Bucket: BUCKET,
        Key: fileName,
        Range: `bytes=${start}-${end}`,
      });

      const { Body } = await this.s3.send(command);

      return {
        stream: Body as Readable,
        headers: {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': end - start + 1,
          'Content-Type': 'video/mp4',
        },
        status: 206,
      };
    }

    const command = new GetObjectCommand({ Bucket: BUCKET, Key: fileName });
    const { Body } = await this.s3.send(command);

    return {
      stream: Body as Readable,
      headers: {
        'Content-Length': fileSize,
        'Accept-Ranges': 'bytes',
        'Content-Type': 'video/mp4',
      },
      status: 200,
    };
  }

  async getVideoList(): Promise<string[]> {
    const command = new ListObjectsV2Command({ Bucket: BUCKET });
    const { Contents } = await this.s3.send(command);
    return (Contents ?? []).map((item) => item.Key ?? '').filter(Boolean);
  }
}
