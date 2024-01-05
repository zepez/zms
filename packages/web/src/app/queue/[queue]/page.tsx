import Link from "next/link";
import { getQueueJobs } from "@packages/query";
import { DataTable } from "./table";
import { columns } from "./columns";

interface Props {
  params: {
    queue?: string;
  };
}

export default async function Page({ params }: Props) {
  const { queue = "ingest" } = params;

  const [, jobs] = await getQueueJobs({
    queue,
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
    <main>
      <div className="p-8">
        <h1 className="text-4xl pb-4">Job Queue</h1>
        <Link href="ingest">Ingest</Link>
        <Link href="transcode">Transcode</Link>
        <DataTable columns={columns} data={jobs} />
      </div>
    </main>
  );
}
