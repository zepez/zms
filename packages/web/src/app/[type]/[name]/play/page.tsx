import { Video } from "~/components";

interface Props {
  params: { type: string; name: string };
}

export default function Page({ params }: Props) {
  const { type, name } = params;

  return (
    <main>
      <Video.Player
        src={`http://localhost:3000/api/stream/${type}/_${name}/master.m3u8`}
      />
    </main>
  );
}
