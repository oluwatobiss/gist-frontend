"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Channel,
  DeleteFetcherOptions,
  GetFetcherOptions,
  SubscriptionOption,
} from "@/app/_types";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

async function getChannels({ url, userToken }: GetFetcherOptions) {
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${userToken}` },
  });
  return await response.json();
}

async function postUserToChannel(url: string, { arg }: SubscriptionOption) {
  const response = await fetch(
    `${url}/${arg.channelId}/users/${arg.username}`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${arg.userToken}` },
    }
  );
  return await response.json();
}

async function deleteUserFromChannel(url: string, { arg }: SubscriptionOption) {
  const response = await fetch(
    `${url}/${arg.channelId}/users/${arg.username}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${arg.userToken}` },
    }
  );
  return await response.json();
}

async function deleteChannel(
  url: string,
  { arg }: { arg: DeleteFetcherOptions }
) {
  const response = await fetch(`${url}/${arg.id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${arg.userToken}` },
  });
  return await response.json();
}

export default function Channels() {
  const router = useRouter();
  const members = useState<string[]>([]);
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URI}/channels`;
  const userToken =
    typeof window !== "undefined" && localStorage.getItem("gistToken");
  const loggedInUserJson =
    typeof window !== "undefined" && localStorage.getItem("gistUserData");
  const loggedInUser = loggedInUserJson && JSON.parse(loggedInUserJson);

  const { data, error, isLoading, mutate } = useSWR(
    { url, userToken },
    getChannels
  );
  const { trigger, isMutating } = useSWRMutation(url, deleteChannel);
  const { trigger: subscribe } = useSWRMutation(url, postUserToChannel);
  const { trigger: unsubscribe } = useSWRMutation(url, deleteUserFromChannel);

  async function removeChannel(id: string) {
    try {
      if (confirm("Delete channel permanently?")) {
        const result = await trigger({ id, userToken });
        if (result.message) {
          alert("Error: Invalid delete credentials");
          throw new Error(result.message);
        }
        window.location.reload();
      }
    } catch (error) {
      if (error instanceof Error) console.error(error.message);
    }
  }

  async function subscribeToChannel(channelId: string) {
    try {
      const result = await subscribe({
        channelId,
        username: loggedInUser.username,
        userToken,
      });
      if (result.message) {
        alert("Error: Invalid subscription credentials");
        throw new Error(result.message);
      }
      mutate();
      // Use state setter function to re-render component
      members[1](result);
    } catch (error) {
      if (error instanceof Error) console.error(error.message);
    }
  }

  async function unsubscribeFromChannel(
    channelId: string,
    channelName: string
  ) {
    try {
      if (confirm(`Unsubscribe from the ${channelName} channel?`)) {
        const result = await unsubscribe({
          channelId,
          username: loggedInUser.username,
          userToken,
        });
        if (result.message) {
          alert("Error: Invalid unsubscription credentials");
          throw new Error(result.message);
        }
        mutate();
        members[1](result);
      }
    } catch (error) {
      if (error instanceof Error) console.error(error.message);
    }
  }

  async function editChannel(channel: Channel) {
    localStorage.setItem("gistChannelToEdit", JSON.stringify(channel));
    router.push("/edit-channel");
  }

  function channelCards(channels: Channel[]) {
    return channels.map((channel) => {
      return (
        <div
          key={channel.id}
          className="border border-gray-400 rounded-sm p-5 mb-4"
        >
          {userToken && loggedInUser.status === "ADMIN" && (
            <div className="text-xs text-gray-500 mb-2">
              <span>created by</span> <span>@{channel.creatorId}</span>
            </div>
          )}
          <h3 className="text-2xl font-bold mb-3">{channel.name}</h3>
          {channel.members.includes(loggedInUser.username) ? (
            <button
              type="button"
              className="cursor-pointer rounded-lg border border-solid border-black/[.08] dark:border-white/[.145] transition-colors hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 mr-3 mb-3 px-4 sm:px-5 sm:w-auto"
              onClick={() =>
                unsubscribeFromChannel(channel.streamId, channel.name)
              }
            >
              Unsubscribe
            </button>
          ) : (
            <button
              type="button"
              className="cursor-pointer rounded-lg border border-solid border-transparent transition-colors bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 mr-3 mt-3 px-4 sm:px-5"
              onClick={() => subscribeToChannel(channel.streamId)}
            >
              Subscribe
            </button>
          )}
          {userToken && loggedInUser.status === "ADMIN" && (
            <>
              <button
                disabled={isMutating}
                type="button"
                className="cursor-pointer rounded-lg border border-solid border-black/[.08] dark:border-white/[.145] transition-colors hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 mr-3 mb-3 px-4 sm:px-5 sm:w-auto"
                onClick={() => removeChannel(channel.streamId)}
              >
                Delete
              </button>
              <button
                type="button"
                className="cursor-pointer rounded-lg border border-solid border-transparent transition-colors bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 mt-3 px-4 sm:px-5"
                onClick={() =>
                  editChannel(
                    data.find((item: Channel) => channel.id === item.id)
                  )
                }
              >
                Edit
              </button>
            </>
          )}
        </div>
      );
    });
  }

  return (
    <main className="sm:px-[30%] sm:py-20 min-h-screen font-[family-name:var(--font-geist-sans)]">
      {isLoading ? (
        <div className="w-full pt-30 text-center text-sm text-yellow-300">
          Loading...
        </div>
      ) : error || !Array.isArray(data) ? (
        <div className="w-full pt-30 text-center text-sm text-red-500">
          Error: {error?.message || data.message}
        </div>
      ) : data.length ? (
        channelCards(data)
      ) : (
        <div className="w-full pt-30 text-center text-sm text-gray-600">
          No channels available
        </div>
      )}
    </main>
  );
}
