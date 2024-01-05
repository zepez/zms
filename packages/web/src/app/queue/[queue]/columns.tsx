"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ChevronRight, ChevronDown } from "lucide-react";
import type { GetQueueJobsReturn } from "@packages/query";

const TimestampCell = ({ getValue }: { getValue: () => unknown }) => {
  const value = getValue() as number | string | undefined;
  const date = value ? new Date(value) : null;
  const string = date ? date.toLocaleString() : "N/A";

  return <span>{string}</span>;
};

export const columns: ColumnDef<NonNullable<GetQueueJobsReturn[1]>[0]>[] = [
  {
    id: "expander",
    header: () => null,
    cell: ({ row }) => (
      <span>{row.getIsExpanded() ? <ChevronDown /> : <ChevronRight />}</span>
    ),
    enableColumnFilter: false,
  },
  {
    accessorKey: "type",
    header: "Job Type",
    enableColumnFilter: false,
  },
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ getValue }) => {
      const value = getValue() as string | undefined;
      const name = value ? value.split(":").splice(1, 2).join(": ") : null;

      return <span>{name}</span>;
    },
  },
  {
    accessorKey: "timestamp",
    header: "Added to Queue",
    cell: TimestampCell,
    enableColumnFilter: false,
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];
