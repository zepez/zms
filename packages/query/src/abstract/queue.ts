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
        queue: z.enum(["ingest", "transcode"]),
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
          type: parsed.queue,
          id: job.id,
          name: job.name,
          timestamp: job.timestamp,
          attemptsMade: job.attemptsMade,
          finishedOn: job.finishedOn,
          failedReason: job.failedReason,
          stacktrace: job.stacktrace,
          returnedValue: job.returnvalue,
          status: await job.getState(),
          data: job.data,
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
