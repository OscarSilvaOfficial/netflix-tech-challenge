import ffmpeg from 'fluent-ffmpeg'
import * as Fs from 'fs'
import { BUCKET_VIDEO_PATH } from '../constants/paths'
import { ManyVideosConfigs, VideoConfigs } from '../types/VideoConfigs'

export const RANDOM_ID = (new Date()).valueOf().toString()

export function getVideoName(path: string) {
  return path.split('/').slice(-1)[0].split('.')[0]
}

export function createFolder(videoName: string) {
  const path = `${BUCKET_VIDEO_PATH}/converted/${videoName}`
  try {
    Fs.readdirSync(path)
  } catch (err) {
    Fs.mkdirSync(path, { recursive: true })
  }
}

export async function generateVideoWithNewResolution(configs: VideoConfigs) {
  const video = ffmpeg(configs.originalVideoPath)
  
  let fileName = '' 
  if (configs.fps) {
    fileName += 'FPS' + configs.fps + '-'
    video.FPS(configs.fps)
  }
  
  if (configs.resolution) {
    fileName += configs.resolution + '-'
    video.size(configs.resolution)
  }
  
  const newFilePath = `${fileName}${RANDOM_ID}.mp4`
  const videoName = getVideoName(newFilePath)
  const destinationFolderName = getVideoName(configs.destinationVideoPath)
  
  createFolder(destinationFolderName)

  video
    .save(BUCKET_VIDEO_PATH + `/converted/${destinationFolderName}/${newFilePath}`)
    .on('start', () => console.log(`Starting - ${videoName}`))
    .on("end", () => console.log(`Finished - ${videoName}`));
}

export function generateMabyVideoWithNewResolution(configs: ManyVideosConfigs) {
  Promise.all(
    configs.resolutions.map((resolution) => {
      generateVideoWithNewResolution({
        destinationVideoPath: configs.destinationVideoPath,
        originalVideoPath: configs.originalVideoPath,
        fps: 60,
        resolution: resolution.toString(),
      });
    })
  );
   
}