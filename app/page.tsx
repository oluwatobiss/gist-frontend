"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { StreamChat } from "stream-chat";
import { LoggedInUser } from "@/app/_types";
import useSWRMutation from "swr/mutation";
import Link from "next/link";

async function getUser(url: string, { arg }: { arg: { userToken: string } }) {
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${arg.userToken}` },
  });
  return await response.json();
}

export default function Home() {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URI}/users`;
  const router = useRouter();
  const [userToken, setUserToken] = useState("");
  const [userData, setUserData] = useState<LoggedInUser>({
    id: 0,
    username: "",
    status: "",
  });
  const { trigger } = useSWRMutation(`${url}/${userData.id}`, getUser);

  async function editProfile() {
    try {
      const result = await trigger({ userToken });
      console.log("=== editProfile result ===");
      console.log(result);
      localStorage.setItem("gistUserToEdit", JSON.stringify(result));
      router.push("/profile");
    } catch (error) {
      console.log("=== editProfile error ===");
      console.log(error);
      if (error instanceof Error) console.error(error.message);
    }
  }

  async function logoutUser() {
    const client = new StreamChat(process.env.NEXT_PUBLIC_STREAM_API_KEY!);
    await client.disconnectUser();
    console.log(`Connection for user "${userData.username}" has been closed`);
    localStorage.removeItem("gistToken");
    localStorage.removeItem("streamToken");
    localStorage.removeItem("gistUserData");
    localStorage.removeItem("gistUserToEdit");
    setUserToken("");
  }

  useEffect(() => {
    let userToken = localStorage.getItem("gistToken");
    let userDataJson = localStorage.getItem("gistUserData");
    userToken === "undefined" && (userToken = "");
    userDataJson === "undefined" && (userDataJson = "");
    const userData: LoggedInUser = userDataJson && JSON.parse(userDataJson);
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
              className="rounded-full w-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-full"
              onClick={editProfile}
            >
              Edit Profile
            </button>
            <button
              type="button"
              className="rounded-full w-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-full"
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
