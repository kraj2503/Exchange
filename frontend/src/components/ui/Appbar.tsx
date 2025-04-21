"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./button";
import {  useRouter } from "next/navigation";
export const Appbar = () => {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="bg-gray-800 h-14 text-white w-full p-2 overflow-hidden">
      <div className="flex justify-around">
        <div className="inline-flex items-center justify-center font-semibold hover:cursor-pointer " onClick={()=>{
          router.push('/')
        }}>
          Exchange
        </div>
        <div className="flex -ml-20">
          <div className={SFLM}>
            <Button variant={"ghost"} onClick={()=>{
              router.push('/trade/ETH_INR')
            }}> Spot</Button>
          </div>
          <div className={SFLM}>
            <Button variant={"ghost"}>Futures</Button>
          </div>
          <div className={SFLM}>
            <Button variant={"ghost"}>Lend</Button>
          </div>
          <div className={SFLM}>
            <Button variant={"ghost"}>More</Button>{" "}
          </div>
        </div>
        <div className="">
          {session ? (
            <div>
              <Button variant={"signUp"} onClick={() => signOut()}>
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex">
              <div className="mx-3">
                <Button onClick={() => signIn()} size={"sm"} variant={"signIn"}>
                  Sign In
                </Button>
              </div>
              <div>
                <Button size={"sm"} variant={"signUp"}>
                  Sign Up
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SFLM = "";
