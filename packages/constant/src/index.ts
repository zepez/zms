// Transcoding:
export const TRANSCODE_SEGMENT_DURATION = 3;

// Queues:
export enum QUEUE_NAMES {
  TRANSCODE = "transcode-queue",
  INGEST = "ingest-queue",
}

export const POSTER = {
  NAME: "poster.jpg",
  DEFAULT: {
    WIDTH: 1080,
    HEIGHT: 1920,
  },
  AUDIO: {
    WIDTH: 500,
    HEIGHT: 500,
  },
};

export const BACKDROP = {
  NAME: "backdrop.jpg",
  WIDTH: 1920,
  HEIGHT: 1080,
};
