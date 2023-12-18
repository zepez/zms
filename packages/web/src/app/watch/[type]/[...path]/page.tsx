import { Video } from "~/components";

interface Props {
  params: { type: string; path: string[] };
}

export default function Page({ params }: Props) {
  const { type, path } = params;

  return (
    <Video.Provider
      src={`http://localhost:3000/api/stream/${type}/_${path.join(
        "/",
      )}/master.m3u8`}
    >
      <Video.Player />
    </Video.Provider>
  );
}
