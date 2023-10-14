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

export function getVideoBitrate({ resolution, fps }: VideoConfigs) {
  if ('640x480' === resolution && fps === 30) return 2500
  if ('1280x720' === resolution && fps === 30) return 5000
  if ('1920x1080' === resolution && fps === 30) return 8000
  if ('640x480' === resolution && fps === 60) return 4000
  if ('1280x720' === resolution && fps === 60) return 7500
  if ('1920x1080' === resolution && fps === 60) return 12000
  throw new Error('Invalid parameters')
}

export function generateVideoWithNewResolution(configs: VideoConfigs) {
  const video = ffmpeg(configs.originalVideoPath)

  const videoBitrate = getVideoBitrate(configs)
  video.videoBitrate(videoBitrate)
  video.FPS(configs.fps)
  video.size(configs.resolution)
  
  const fileName = `FPS${configs.fps}-${configs.resolution}`
  const newFilePath = `${fileName}.mp4`
  const videoName = getVideoName(newFilePath)
  const destinationFolderName = getVideoName(configs.destinationVideoPath)
  
  createFolder(destinationFolderName)

  video
    .save(BUCKET_VIDEO_PATH + `/converted/${destinationFolderName}/${newFilePath}`)
    .on('start', () => console.log(`Starting - ${videoName}`))
    .on("end", () => console.log(`Finished - ${videoName}`));
}

export function generateMabyVideoWithNewResolution(configs: ManyVideosConfigs) {
  configs.resolutions.map((resolution) => {
    generateVideoWithNewResolution({
      destinationVideoPath: configs.destinationVideoPath,
      originalVideoPath: configs.originalVideoPath,
      fps: 60,
      resolution: resolution.toString(),
    });
  })
}