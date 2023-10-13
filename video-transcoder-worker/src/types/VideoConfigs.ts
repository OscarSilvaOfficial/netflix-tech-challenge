export type VideoConfigs = {
  originalVideoPath: string;
  resolution: string;
  fps: number;
  destinationVideoPath: string;
};

export type ManyVideosConfigs = {
  originalVideoPath: string;
  resolutions: string[];
  fps: number;
  destinationVideoPath: string;
};
