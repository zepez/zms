import { getQueueJobs } from "@packages/query";

export default async function Page() {
  const [, jobs] = await getQueueJobs({
    queue: "transcode",
    statuses: [
      "completed",
      "failed",
      "delayed",
      "active",
      "wait",
      "waiting-children",
      "prioritized",
      "paused",
      "repeat",
    ],
  });

  if (!jobs) return null;

  return (
    <main className="flex flex-col gap-4">
      {jobs.map((job) => (
        <div key={job.id} className="border">
          <p>id: {job.id}</p>
          <p>status: {job.status}</p>
          <p>name: {job.name}</p>
          <p>added to queue: {job.timestamp}</p>
          <p>attempts made: {job.attemptsMade}</p>
          <p>finished: {job.finishedOn}</p>
          <p>failed reason: {job.failedReason}</p>
          <p>stacktrace: {job.stacktrace}</p>
          <p>returned: {job.returnvalue}</p>
        </div>
      ))}
    </main>
  );
}
