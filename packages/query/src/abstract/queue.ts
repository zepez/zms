import * as z from "zod";
import { qs } from "@packages/db";

export type GetQueueJobsOptions = {
  queue: string;
  statuses: string[];
};

export const getQueueJobs = async (opts: GetQueueJobsOptions) => {
  try {
    const parsed = z
      .object({
        queue: z.enum(["finishIngest", "transcode"]),
        statuses: z.array(
          z.enum([
            "completed",
            "failed",
            "delayed",
            "active",
            "wait",
            "waiting-children",
            "prioritized",
            "paused",
            "repeat",
          ]),
        ),
      })
      .parse(opts);

    const rawJobsData = await qs[parsed.queue].getJobs(parsed.statuses);

    const resolveJobsData = () =>
      rawJobsData.map(async (job) => {
        return {
          ...job,
          status: await job.getState(),
        };
      });

    const jobs = await Promise.all(resolveJobsData());

    return [null, jobs] as const;
  } catch (err) {
    console.error(err);
    const error =
      err instanceof Error
        ? new Error(err.message)
        : new Error("Failed to retrieve queue jobs.");
    return [error, null] as const;
  }
};

export type GetQueueJobsReturn = Awaited<ReturnType<typeof getQueueJobs>>;
