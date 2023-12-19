import Hls from "hls.js";

export type HlsRef = React.MutableRefObject<Hls | null>;

export type PlayerRef = React.RefObject<HTMLDivElement> | null;
export type ProgressBarRef = React.RefObject<HTMLDivElement> | null;

export type MediaRef<
  T extends HTMLVideoElement | HTMLAudioElement =
    | HTMLVideoElement
    | HTMLAudioElement,
> = React.RefObject<T> | null;

export interface StreamResolution {
  width: number;
  height: number;
}

export interface SetStreamLevelOptions {
  immediate: boolean;
  preferred: boolean;
}
