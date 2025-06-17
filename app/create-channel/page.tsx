"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Errors, FormEvent, UpsertFetcherOption } from "@/app/_types";
import useSWRMutation from "swr/mutation";

async function postChannel(url: string, { arg }: UpsertFetcherOption) {
  const userToken = localStorage.getItem("gistToken");
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(arg),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      Authorization: `Bearer ${userToken}`,
    },
  });
  return await response.json();
}

export default function CreateChannel() {
  const loggedInUserJson =
    typeof window !== "undefined" && localStorage.getItem("gistUserData");
  const loggedInUser = loggedInUserJson && JSON.parse(loggedInUserJson);
  const router = useRouter();
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [errors, setErrors] = useState<Errors[]>([]);
  const { trigger, isMutating, data, error } = useSWRMutation(
    `${process.env.NEXT_PUBLIC_BACKEND_URI}/channels/?creator=${loggedInUser.username}`,
    postChannel
  );

  async function registerChannel(e: FormEvent) {
    e.preventDefault();
    try {
      const result = await trigger({ name, imageUrl });
      if (result.errors?.length) return setErrors(result.errors);
      if (result.message) {
        alert("Error: Invalid edit credentials");
        throw new Error(result.message);
      }
      router.push("/channels");
    } catch (error) {
      if (error instanceof Error) console.error(error.message);
    }
  }

  function showErrorFor(field: string) {
    return errors.find((error) => error.path === field) ? (
      <div className="mb-2 text-sm text-red-500">
        {errors.find((error) => error.path === field)?.msg}
      </div>
    ) : (
      ""
    );
  }

  return (
    <main className="sm:px-[30%] sm:py-20 min-h-screen font-[family-name:var(--font-geist-sans)]">
      {loggedInUser.status === "ADMIN" ? (
        <form
          className="[&_.text-input]:w-full [&_input]:border [&_input]:border-gray-500 [&_input]:rounded-sm [&_input]:my-1 [&_input]:px-5 [&_input]:py-2 [&_input]:text-lg [&_label]:inline-block [&_label]:text-sm [&_.text-input-label]:mt-3"
          onSubmit={registerChannel}
        >
          <div>
            <label className="text-input-label" htmlFor="name">
              Name
            </label>
            <input
              className="text-input"
              type="text"
              name="name"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            {showErrorFor("name")}
          </div>
          <div>
            <label className="text-input-label" htmlFor="imageUrl">
              URL
            </label>
            <input
              className="text-input"
              type="url"
              name="imageUrl"
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              required
            />
            {showErrorFor("imageUrl")}
          </div>
          <button
            type="submit"
            disabled={isMutating}
            className="cursor-pointer rounded-lg border border-solid border-transparent transition-colors bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 mt-3 px-4 sm:px-5"
          >
            Create channel
          </button>
          {isMutating && (
            <div className="my-3 text-sm text-yellow-300">
              Creating channel...
            </div>
          )}
          {error && (
            <div className="my-3 text-sm text-red-500">
              Error: {error.message}
            </div>
          )}
        </form>
      ) : (
        <div className="w-full pt-30 text-center text-sm text-gray-600">
          Admin pass required to create channels
        </div>
      )}
    </main>
  );
}
