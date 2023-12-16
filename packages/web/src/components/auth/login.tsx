"use client";
import Image from "next/image";
import { signIn } from "next-auth/react";

export const Login = () => {
  return (
    
    <div className="flex flex-col justify-center items-center p-[250px]">
     <h1 >Sign in</h1>
      <button
        className="p-5 bg-white text-black rounded duration-700 hover:shadow-[0_35px_60px_-15px_rgba(255,255,255,0.7)]"
        onClick={() => signIn("github")}
      >
        <Image src='/icon.png' alt='Github button' width={30} height={30}/>
      </button>
    </div>
  );  
};
