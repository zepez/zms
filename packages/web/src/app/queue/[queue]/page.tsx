import Link from "next/link";
import { getQueueJobs } from "@packages/query";
import { Button } from "~/components/ui/button";
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
    <main className="p-8">
      <div className="p-4 flex justify-between">
        <h1 className="text-4xl pb-4">Job Queue</h1>
        <nav>
          <Button variant="ghost" asChild>
            <Link href="ingest">Ingest</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="transcode">Transcode</Link>
          </Button>
        </nav>
      </div>
      <DataTable columns={columns} data={jobs} />
    </main>
  );
}
