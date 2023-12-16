import { cn } from "~/lib";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export const Layout = (props: Props) => {
  return (
    <div
      className={cn(
        "w-screen h-screen flex items-center justify-center bg-black",
        props.className,
      )}
    >
      {props.children}
    </div>
  );
};
