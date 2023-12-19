import { RefreshCcw } from "lucide-react";

interface Props {
  message: string;
}

export const Loading = ({ message }: Props) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <RefreshCcw size={140} className="animate-spin" />
      <h1 className="text-5xl pt-4">{message}</h1>
    </div>
  );
};
