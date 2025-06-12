"use client";
import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import { loggedInUser } from "@/app/_types";
import Link from "next/link";

export default function Home() {
  const [userToken, setUserToken] = useState("");
  const [userData, setUserData] = useState<loggedInUser>({
    id: 0,
    username: "",
    status: "",
  });

  async function logoutUser() {
    const client = new StreamChat(process.env.NEXT_PUBLIC_STREAM_API_KEY!);
    await client.disconnectUser();
    console.log(`Connection for user "${userData.username}" has been closed`);
    localStorage.removeItem("gistToken");
    localStorage.removeItem("streamToken");
    localStorage.removeItem("gistUserData");
    setUserToken("");
  }

  useEffect(() => {
    let userToken = localStorage.getItem("gistToken");
    let userDataJson = localStorage.getItem("gistUserData");
    userToken === "undefined" && (userToken = "");
    userDataJson === "undefined" && (userDataJson = "");
    const userData: loggedInUser = userDataJson && JSON.parse(userDataJson);
    userToken && setUserToken(userToken);
    userData && setUserData(userData);
  }, []);

  return (
    <main className="sm:mx-auto sm:w-130 sm:py-20 min-h-screen font-[family-name:var(--font-geist-sans)]">
      <div>
        <Link
          className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 mb-3 px-4 sm:px-5 sm:w-auto"
          href={userToken ? "/chat-room" : "/sign-up"}
        >
          {userToken ? "Join the latest chat" : "Sign up"}
        </Link>
        {!userToken && (
          <Link
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 mb-3 px-4 sm:px-5 sm:w-auto"
            href="/login"
          >
            Login
          </Link>
        )}
        {userToken && userData.status === "ADMIN" && (
          <>
            <Link
              className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 mb-3 px-4 sm:px-5 sm:w-auto"
              href="/users"
            >
              Users
            </Link>
            <Link
              className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 mb-3 px-4 sm:px-5 sm:w-auto"
              href="/create-channel"
            >
              Create Channel
            </Link>
          </>
        )}
        {userToken && (
          <>
            <Link
              className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 mb-3 px-4 sm:px-5 sm:w-auto"
              href="/channels"
            >
              Channels
            </Link>
            <button
              type="button"
              className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-full"
              onClick={logoutUser}
            >
              Log out
            </button>
          </>
        )}
      </div>
    </main>
  );
}
