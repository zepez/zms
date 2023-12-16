import { Layout } from "~/components/video/layout";

interface Props {
  message: string;
}

export const Error = (props: Props) => {
  return (
    <Layout className="text-center">
      <div>
        <h1 className="text-6xl pb-4">Video Player Error</h1>
        <p>Message: {props.message}</p>
      </div>
    </Layout>
  );
};
