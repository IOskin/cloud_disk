import ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

export const compressVideo = (input: Buffer): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const tmpInput = path.join(os.tmpdir(), `input_${Date.now()}.mp4`);
    const tmpOutput = path.join(os.tmpdir(), `output_${Date.now()}.mp4`);

    fs.writeFileSync(tmpInput, input);

    ffmpeg(tmpInput)
      .videoCodec('libx264')
      // .addOption('-crf', '28')
      // .addOption('-preset', 'slow')
      .size('50%')
      .format('mp4')
      .on('end', () => {
        const result = fs.readFileSync(tmpOutput);
        fs.unlinkSync(tmpInput);
        fs.unlinkSync(tmpOutput);
        resolve(result);
      })
      .on('error', (err) => {
        fs.unlinkSync(tmpInput);
        if (fs.existsSync(tmpOutput)) fs.unlinkSync(tmpOutput);
        reject(err);
      })
      .save(tmpOutput);
  });
};
