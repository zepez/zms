import path from "path";
import ffmpeg from "fluent-ffmpeg";
import * as constants from "@packages/constant";
import { AvFile } from "./av";

export class VideoFile extends AvFile {
  constructor(input: string) {
    super(input);
  }

  override async writePosterImage() {
    const success = await this.screenshot({
      name: constants.POSTER.NAME,
      progress: 0.4,
    });

    if (success) {
      await this.cropImage({
        name: constants.POSTER.NAME,
        width: constants.POSTER.DEFAULT.WIDTH,
        height: constants.POSTER.DEFAULT.HEIGHT,
        fit: "cover",
      });
    } else {
      await this.createImage({
        name: constants.POSTER.NAME,
        width: constants.POSTER.DEFAULT.WIDTH,
        height: constants.POSTER.DEFAULT.HEIGHT,
        text: this.name,
      });
    }
  }

  override async writeBackdropImage() {
    const success = await this.screenshot({
      name: constants.BACKDROP.NAME,
      progress: 0.5,
    });

    if (success) {
      await this.cropImage({
        name: constants.BACKDROP.NAME,
        width: constants.BACKDROP.WIDTH,
        height: constants.BACKDROP.HEIGHT,
        fit: "cover",
      });
    } else {
      await this.createImage({
        name: constants.BACKDROP.NAME,
        width: constants.BACKDROP.WIDTH,
        height: constants.BACKDROP.HEIGHT,
        text: this.name,
      });
    }
  }

  async screenshot(opts: { name: string; progress: number }): Promise<boolean> {
    return await new Promise((resolve) => {
      const outputFilePath = path.join(this.getOutputDirPath(), opts.name);
      const { duration } = this?.ffProbeData?.format ?? {};

      if (!duration) return resolve(false);

      ffmpeg(this.inputFilePath)
        .seekInput(Math.round(duration * opts.progress))
        .outputOptions(["-frames:v 1"])
        .output(outputFilePath)
        .on("end", () => {
          return resolve(true);
        })
        .on("error", () => {
          return resolve(false);
        })
        .run();
    });
  }
}
