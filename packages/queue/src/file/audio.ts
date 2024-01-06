import path from "path";
import ffmpeg from "fluent-ffmpeg";
import * as constants from "@packages/constant";
import { AvFile } from "./av";

export class AudioFile extends AvFile {
  constructor(input: string) {
    super(input);
  }

  override async writePosterImage() {
    const success = await this.screenshot({
      name: constants.POSTER.NAME,
    });

    if (success) {
      await this.cropImage({
        name: constants.POSTER.NAME,
        width: constants.POSTER.AUDIO.WIDTH,
        height: constants.POSTER.AUDIO.HEIGHT,
        fit: "contain",
      });
    } else {
      await this.createImage({
        name: constants.POSTER.NAME,
        width: constants.POSTER.AUDIO.WIDTH,
        height: constants.POSTER.AUDIO.HEIGHT,
        text: this.name,
      });
    }
  }

  override async writeBackdropImage() {
    const success = await this.screenshot({
      name: constants.BACKDROP.NAME,
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

  async screenshot(opts: { name: string }): Promise<boolean> {
    return await new Promise((resolve) => {
      const outputFilePath = path.join(this.getOutputDirPath(), opts.name);
      const imageStream = this.getAVStream("image");

      if (!imageStream) return resolve(false);

      ffmpeg(this.inputFilePath)
        .outputOptions([`-map 0:${imageStream.index}`, `-vframes 1`])
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
