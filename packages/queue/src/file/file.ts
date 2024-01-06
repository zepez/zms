import crypto from "crypto";
import * as fs from "fs/promises";
import path from "path";
import type { Stats } from "fs";
import Jimp from "jimp";
import { getDataPath, ensurePath } from "@packages/common";

export abstract class File {
  inputFilePath: string;
  name: string;
  stats: Stats | null = null;
  initialized: boolean = false;

  constructor(input: string) {
    this.inputFilePath = input;
    this.name = path.basename(input);
  }

  async init() {
    if (this.initialized) return this;

    await this.probe();
    this.collectMetadata();

    this.initialized = true;
    return this;
  }

  abstract collectMetadata(): void;
  abstract getMetadata(): Record<string, unknown>;
  abstract writePosterImage(): Promise<void>;
  abstract writeBackdropImage(): Promise<void>;

  getOutputDirPath() {
    const hash = this.getHash();
    return path.join(getDataPath("/store"), hash);
  }

  getOutputFilePath() {
    return path.join(getDataPath("/archive"), this.name);
  }

  async probe() {
    this.stats = await fs.stat(this.inputFilePath);
  }

  getHash() {
    const meta = JSON.stringify(this.getMetadata());

    return crypto.createHash("md5").update(meta).digest("hex");
  }

  async writeMetadata() {
    const outputDirPath = this.getOutputDirPath();
    ensurePath(outputDirPath);

    const metaPath = path.join(outputDirPath, "metadata.json");
    const metaData = JSON.stringify(
      { hash: this.getHash(), ...this.getMetadata(), stats: this.stats },
      null,
      2,
    );

    await fs.writeFile(metaPath, metaData);
  }

  async createImage(opts: {
    name: string;
    text: string;
    width: number;
    height: number;
  }) {
    await new Promise(async (resolve) => {
      const outputFilePath = path.join(this.getOutputDirPath(), opts.name);
      const image = new Jimp(opts.width, opts.height, "#000000");
      const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
      image.print(
        font,
        0,
        0,
        {
          text: opts.text,
          alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
          alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
        },
        opts.width,
        opts.height,
      );
      image.write(outputFilePath, () => {
        return resolve(true);
      });
    });
  }

  async cropImage(opts: {
    name: string;
    width: number;
    height: number;
    fit: "contain" | "cover";
  }) {
    // can not use path as input and output
    const target = path.join(this.getOutputDirPath(), opts.name);
    const renamed = path.join(this.getOutputDirPath(), "original." + opts.name);
    await fs.rename(target, renamed);

    //crop
    const image = await Jimp.read(renamed);
    if (opts.fit === "cover") image.cover(opts.width, opts.height);
    if (opts.fit === "contain") image.contain(opts.width, opts.height);

    // save
    await image.writeAsync(target);

    // remove original
    await fs.unlink(renamed);
  }
}
