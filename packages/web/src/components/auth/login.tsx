"use client";

import { signIn } from "next-auth/react";

export const Login = () => {
  return (
    <>
      <button onClick={() => signIn("github")}>Sign in with GitHub</button>
    </>
  );
};
