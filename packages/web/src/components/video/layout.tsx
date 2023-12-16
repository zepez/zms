import { useVideoContext } from "~/providers";
import { cn } from "~/lib";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export const Layout = (props: Props) => {
  const { layoutRef } = useVideoContext();

  return (
    <div
      ref={layoutRef}
      className={cn(
        "w-screen h-screen flex items-center justify-center bg-black",
        props.className,
      )}
    >
      {props.children}
    </div>
  );
};
