import {
  Controller,
  Get,
  Param,
  Post,
  Headers,
  Res,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';

import { VideoService } from './video.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { type Response } from 'express';

@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('video', {
      storage: memoryStorage(),
      limits: { fieldSize: 500 * 1024 * 1024 },
    }),
  )
  async uploadVideo(@UploadedFile() file: Express.Multer.File) {
    return this.videoService.saveVideo(file);
  }

  @Get()
  async getVideosList() {
    return this.videoService.getVideoList();
  }

  @Get(':filename')
  async streamVideo(
    @Param('filename') filename: string,
    @Headers('range') range: string,
    @Res() res: Response,
  ) {
    const { stream, headers, status } = await this.videoService.streamVideo(
      filename,
      range,
    );
    res.writeHead(status, headers);
    stream.pipe(res);
  }
}
