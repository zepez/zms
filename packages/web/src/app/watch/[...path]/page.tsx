import { Video } from "~/components";

interface Props {
  params: { type: string; path: string[] };
}

export default function Page({ params }: Props) {
  const { path } = params;

  return (
    <Video.Provider src={`/api/stream/${path.join("/")}/playlist.m3u8`}>
      <Video.Player />
    </Video.Provider>
  );
}
