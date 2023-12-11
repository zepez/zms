import { Layout as Layouts } from "~/components";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <Layouts.Base>{children}</Layouts.Base>;
}
