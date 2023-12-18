import { useVideoContext } from "~/components/video/context";
import { cn } from "~/lib";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export const Layout = (props: Props) => {
  const { playerRef } = useVideoContext();

  return (
    <div
      ref={playerRef}
      className={cn(
        "w-screen h-screen flex items-center justify-center bg-black",
        props.className,
      )}
    >
      {props.children}
    </div>
  );
};
