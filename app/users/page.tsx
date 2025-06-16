"use client";
import { useRouter } from "next/navigation";
import { DeleteFetcherOptions, GetFetcherOptions, User } from "@/app/_types";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

async function getUsers({ url, userToken }: GetFetcherOptions) {
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${userToken}` },
  });
  return await response.json();
}

async function deleteUser(url: string, { arg }: { arg: DeleteFetcherOptions }) {
  const response = await fetch(`${url}/${arg.id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${arg.userToken}` },
  });
  return await response.json();
}

export default function Users() {
  const router = useRouter();
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URI}/users`;
  const userToken =
    typeof window !== "undefined" && localStorage.getItem("gistToken");
  const loggedInUserJson =
    typeof window !== "undefined" && localStorage.getItem("gistUserData");
  const loggedInUser = loggedInUserJson && JSON.parse(loggedInUserJson);

  const { data, error, isLoading } = useSWR(
    { url: `${url}/?status=${loggedInUser.status}`, userToken },
    getUsers
  );
  const { trigger, isMutating } = useSWRMutation(url, deleteUser);

  async function removeUser(id: string) {
    try {
      if (confirm("Delete user permanently?")) {
        await trigger({ id, userToken });
        window.location.reload();
      }
    } catch (error) {
      if (error instanceof Error) console.error(error.message);
    }
  }

  function createUserCards(users: User[]) {
    const userDataJson = localStorage.getItem("gistUserData");
    const userData = userDataJson && JSON.parse(userDataJson);
    return users.map((user) => {
      return (
        <div
          key={user.id}
          className="border border-gray-400 rounded-sm p-5 mb-4"
        >
          <div className="text-xs text-gray-500">
            <span>@{user.username}</span> <span>{user.status}</span>
          </div>
          <h3 className="text-2xl font-bold mb-3">
            {user.firstName} {user.lastName}
          </h3>
          {userData.username === user.username ? (
            ""
          ) : (
            <button
              disabled={isMutating}
              type="button"
              className="cursor-pointer rounded-lg border border-solid border-transparent transition-colors bg-foreground text-background hover:bg-red-500 dark:hover:bg-red-500 font-medium text-sm sm:text-base h-10 sm:h-12 mt-3 px-4 sm:px-5"
              onClick={() => removeUser(user.username)}
            >
              Delete
            </button>
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
      ) : error ? (
        <div className="w-full pt-30 text-center text-sm text-red-500">
          Error: {error.message}
        </div>
      ) : data.length ? (
        createUserCards(data)
      ) : (
        <div className="w-full pt-30 text-center text-sm text-gray-600">
          Admin pass required to manage users
        </div>
      )}
    </main>
  );
}
