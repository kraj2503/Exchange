"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./button";
import { useRouter } from "next/navigation";

export const Appbar = () => {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="fixed w-full bg-gray-900 bg-opacity-90 backdrop-blur-md z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div 
            className="flex items-center hover:cursor-pointer"
            onClick={() => router.push("/")}
          >
            <div className="text-blue-500 font-bold text-2xl mr-2">⟁</div>
            <span className="font-bold text-xl">Tradosphere</span>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex space-x-8">
            <Button
              variant={"ghost"}
              className="text-gray-300 hover:text-blue-400 transition"
              onClick={() => router.push("/trade/ETH_INR")}
            >
              Spot
            </Button>
            <Button
              variant={"ghost"}
              className="text-gray-300 hover:text-blue-400 transition"
            >
              Futures
            </Button>
            <Button
              variant={"ghost"}
              className="text-gray-300 hover:text-blue-400 transition"
            >
              Lend
            </Button>
            <Button
              variant={"ghost"}
              className="text-gray-300 hover:text-blue-400 transition"
            >
              More
            </Button>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {session ? (
              <Button 
                variant={"signUp"}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition" 
                onClick={() => signOut()}
              >
                Sign Out
              </Button>
            ) : (
              <>
                <Button 
                  variant={"signIn"}
                  className="text-gray-300 hover:text-blue-400 transition"
                  onClick={() => signIn()}
                >
                  Log In
                </Button>
                <Button 
                  variant={"signUp"}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition"
                >
                  Sign Up Free
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};  