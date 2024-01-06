import { VideoFile, AudioFile } from "../file";

export const determine = (file: VideoFile | AudioFile) => {
  switch (file.constructor) {
    case VideoFile:
      return video.filter((preset) => {
        const [, presetHeight = 0] = preset.resolution.split("x").map(Number);
        const videoHeight = file.video.video_height || 0;

        return presetHeight <= videoHeight;
      });
    case AudioFile:
      return audio;
    default: {
      throw new Error("Unsupported file type");
    }
  }
};

export const video = [
  {
    name: "144p",
    resolution: "256x144",
    bandwidth: 400000,
    immediate: true,
  },
  {
    name: "360p",
    resolution: "640x360",
    bandwidth: 800000,
    immediate: false,
  },
  {
    name: "480p",
    resolution: "854x480",
    bandwidth: 1200000,
    immediate: false,
  },
  {
    name: "720p",
    resolution: "1280x720",
    bandwidth: 2800000,
    immediate: false,
  },
  {
    name: "1080p",
    resolution: "1920x1080",
    bandwidth: 5000000,
    immediate: false,
  },
  {
    name: "2160p",
    resolution: "3840x2160",
    bandwidth: 14000000,
    immediate: false,
  },
];

export const audio = [
  {
    name: "320kbps",
    resolution: null,
    bandwidth: 320000,
    immediate: true,
  },
];
