import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  UploadedFile,
  Param,
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

  @Get(':filename/url')
  async getVideoUrl(@Param('filename') filename: string) {
    return this.videoService.getPresignedUrl(filename);
  }
}
