import * as Hound from 'hound'
import { BUCKET_VIDEO_PATH } from './constants/paths';
import { generateMabyVideoWithNewResolution } from './utils/video'

const resolutions = ['2560x1440', '2048x1080', '1920x1080', '1280x720', '640x480']

const watcher = Hound.watch(`${BUCKET_VIDEO_PATH}/originals`, {ignored: /^\./, persistent: true});

watcher
  .on('create', (path: string) => {
    const file = path.split('/').slice(-1)[0]
    const nameReplaced = file.split('.')[0]
    generateMabyVideoWithNewResolution({
      resolutions,
      fps: 60,
      destinationVideoPath: `${BUCKET_VIDEO_PATH}/converted/${nameReplaced}`,
      originalVideoPath: `${BUCKET_VIDEO_PATH}/originals/${file}`,
    })
  })


