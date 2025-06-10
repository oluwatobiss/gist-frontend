"use client";
import { useRouter } from "next/navigation";
import { DeleteFetcherOptions, GetFetcherOptions, Channel } from "@/app/_types";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

async function getChannels({ url, userToken }: GetFetcherOptions) {
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${userToken}` },
  });
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
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URI}/channels`;
  const userToken =
    typeof window !== "undefined" && localStorage.getItem("gistToken");
  const loggedInUserJson =
    typeof window !== "undefined" && localStorage.getItem("gistUserData");
  const loggedInUser = loggedInUserJson && JSON.parse(loggedInUserJson);

  const { data, error, isLoading } = useSWR(
    { url: `${url}/?status=${loggedInUser.status}`, userToken },
    getChannels
  );
  const { trigger, isMutating } = useSWRMutation(url, deleteChannel);

  console.log("=== Channel Data from GET request ===");
  console.log(data);

  async function removeChannel(id: number) {
    try {
      if (confirm("Delete channel permanently?")) {
        const result = await trigger({ id, userToken });

        console.log("=== Deleted channel's data ===");
        console.log(result);

        router.refresh();
      }
    } catch (error) {
      if (error instanceof Error) console.error(error.message);
    }
  }

  async function editChannel(channel: Channel) {
    console.log("=== editChannel function ===");
    console.log(channel);

    localStorage.setItem("gistChannelToEdit", JSON.stringify(channel));
    router.push("/edit-channel");
  }

  function createChannelCards(channels: Channel[]) {
    return channels.map((channel) => {
      return (
        <div
          key={channel.id}
          className="border border-gray-400 rounded-sm p-5 mb-4"
        >
          <div className="text-xs text-gray-500 mb-2">
            <span>created by</span> <span>@{channel.creatorId}</span>
          </div>
          <h3 className="text-2xl font-bold mb-3">{channel.name}</h3>
          <button
            disabled={isMutating}
            type="button"
            className="cursor-pointer rounded-lg border border-solid border-black/[.08] dark:border-white/[.145] transition-colors hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 mr-3 mb-3 px-4 sm:px-5 sm:w-auto"
            onClick={() => removeChannel(channel.id)}
          >
            {isMutating ? "Deleting channel..." : "Delete"}
          </button>
          <button
            type="button"
            className="cursor-pointer rounded-lg border border-solid border-transparent transition-colors bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 mt-3 px-4 sm:px-5"
            onClick={() =>
              editChannel(
                data.filter((item: Channel) => channel.id !== item.id)
              )
            }
          >
            Edit
          </button>
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
      ) : error ? (
        <div className="my-3 text-sm text-red-500">Error: {error.message}</div>
      ) : data.length ? (
        createChannelCards(data)
      ) : (
        <div className="w-full pt-30 text-center text-sm text-gray-600">
          {Array.isArray(data) && !data.length
            ? "No channels available"
            : "Admin pass required to manage channels"}
        </div>
      )}
    </main>
  );
}
