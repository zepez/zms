import { AlertCircle } from "lucide-react";

interface Props {
  message: string;
}

export const Error = ({ message }: Props) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <AlertCircle size={140} />
      <h1 className="text-5xl pt-4">Video Error</h1>
      <p className="text-xl">{message}</p>
    </div>
  );
};
