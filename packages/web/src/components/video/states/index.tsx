import { useVideoContext } from "~/components/video/context";
import { Loading } from "./loading";
import { Error } from "./error";

export const States = () => {
  const { streamLoading, streamError } = useVideoContext();

  const states = [
    { state: streamError, component: <Error message={streamError} /> },
    { state: streamLoading, component: <Loading message="Loading" /> },
  ];

  for (const state of states) {
    if (state.state) return state.component;
  }

  return null;
};
