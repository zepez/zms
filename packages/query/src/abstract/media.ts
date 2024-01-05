import * as validate from "@packages/validation";
import { insertMediaPrepared } from "../prepared";

export type InsertMediaOptions = validate.Media;

export const insertMedia = async (opts: InsertMediaOptions) => {
  try {
    const parsed = validate.media.parse(opts);

    const result = await insertMediaPrepared.execute({ ...parsed });

    return [null, result] as const;
  } catch (err) {
    console.error(err);
    const error =
      err instanceof Error
        ? new Error(err.message)
        : new Error("Failed to insert media.");
    return [error, null] as const;
  }
};

export type InsertMediaReturn = Awaited<ReturnType<typeof insertMedia>>;
