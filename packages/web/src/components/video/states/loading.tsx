interface Props {
  message: string;
}

export const Loading = ({ message }: Props) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="loading w-64 h-64" />
      <h1 className="text-5xl pt-4">{message}</h1>
    </div>
  );
};
