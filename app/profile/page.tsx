"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChangeEvent,
  DeleteFetcherOptions,
  Errors,
  FormEvent,
  PutUserOption,
} from "@/app/_types";
import useSWRMutation from "swr/mutation";

async function putUser(url: string, { arg }: PutUserOption) {
  const response = await fetch(url, {
    method: "PUT",
    body: JSON.stringify(arg),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      Authorization: `Bearer ${arg.userToken}`,
      // Authorization: `Bearer Test`,
    },
  });
  return await response.json();
}

async function deleteUser(url: string, { arg }: { arg: DeleteFetcherOptions }) {
  const response = await fetch(`${url}/${arg.id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${arg.userToken}` },
    // headers: { Authorization: `Bearer Test` },
  });
  return await response.json();
}

export default function Profile() {
  const userToken = localStorage.getItem("gistToken");
  const userDataJson = localStorage.getItem("gistUserData");
  const userData = userDataJson && JSON.parse(userDataJson);
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URI}/users`;

  console.log("=== userData ===");
  console.log(userData);

  const router = useRouter();
  const [firstName, setFirstName] = useState(userData.firstName);
  const [lastName, setLastName] = useState(userData.lastName);
  const [email, setEmail] = useState(userData.email);
  const [admin, setAdmin] = useState(userData.status === "ADMIN");
  const [adminCode, setAdminCode] = useState("");
  const [errors, setErrors] = useState<Errors[]>([]);
  const { trigger, isMutating, data, error } = useSWRMutation(
    `${url}/${userData.username}`,
    putUser
  );
  const { trigger: removeUser, isMutating: isDeleting } = useSWRMutation(
    url,
    deleteUser
  );

  async function updateUser(e: FormEvent) {
    e.preventDefault();
    try {
      const result = await trigger({
        firstName,
        lastName,
        email,
        admin,
        adminCode,
        userToken,
      });
      console.log("=== updateUser result ===");
      console.log(result);
      console.log("=== updateUser useSWRMutation data  ===");
      console.log(data);

      if (result.errors?.length) return setErrors(result.errors);
      if (result.message) {
        alert("Error: Invalid edit credentials");
        throw new Error(result.message);
      }

      localStorage.setItem("gistUserData", JSON.stringify(result));
      router.push("/");
    } catch (error) {
      console.log("=== updateUser error ===");
      console.log(error);
      if (error instanceof Error) console.error(error.message);
    }
  }

  function updateAdminCode(e: ChangeEvent) {
    errors.length && setErrors([]);
    setAdminCode(e.target.value);
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

  async function deleteAccount(id: string) {
    try {
      if (confirm("Delete your account permanently?")) {
        const result = await removeUser({ id, userToken });
        console.log("=== deleteAccount ===");
        console.log(result);

        if (result.message) {
          alert("Error: Invalid delete credentials");
          throw new Error(result.message);
        }

        localStorage.removeItem("gistToken");
        localStorage.removeItem("streamToken");
        localStorage.removeItem("gistUserData");
        router.push("/");
      }
    } catch (error) {
      if (error instanceof Error) console.error(error.message);
    }
  }

  return (
    <main className="sm:px-[30%] sm:py-20 min-h-screen font-[family-name:var(--font-geist-sans)]">
      <form
        className="[&_.text-input]:w-full [&_input]:border [&_input]:border-gray-500 [&_input]:rounded-sm [&_input]:my-1 [&_input]:px-5 [&_input]:py-2 [&_input]:text-lg [&_label]:inline-block [&_label]:text-sm [&_.text-input-label]:mt-3"
        onSubmit={updateUser}
      >
        <div>
          <label className="text-input-label" htmlFor="firstName">
            First name
          </label>
          <input
            className="text-input"
            type="text"
            name="firstName"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          {showErrorFor("firstName")}
        </div>
        <div>
          <label className="text-input-label" htmlFor="lastName">
            Last name
          </label>
          <input
            className="text-input"
            type="text"
            name="lastName"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          {showErrorFor("lastName")}
        </div>
        <div>
          <label className="text-input-label" htmlFor="email">
            Email
          </label>
          <input
            className="text-input"
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {showErrorFor("email")}
        </div>
        <div className="mt-3 flex items-center gap-3">
          <label htmlFor="adminCheckbox">Admin?</label>
          <input
            className="w-[initial]"
            type="checkbox"
            id="adminCheckbox"
            checked={admin}
            onChange={() => setAdmin(!admin)}
          />
        </div>
        {admin ? (
          <div>
            <label className="text-input-label" htmlFor="adminCode">
              Enter your passcode:
            </label>
            <input
              className="text-input"
              type="password"
              name="adminCode"
              id="adminCode"
              value={adminCode}
              onChange={updateAdminCode}
              required
            />
            {showErrorFor("adminCode")}
          </div>
        ) : (
          ""
        )}
        <button
          type="submit"
          disabled={isMutating}
          className="cursor-pointer rounded-lg border border-solid border-transparent transition-colors bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 mt-3 px-4 sm:px-5"
        >
          Update
        </button>
      </form>
      {userData.status !== "ADMIN" && (
        <>
          <hr className="my-5 text-gray-600" />
          <p className="text-sm text-red-500">Danger Zone</p>
          <button
            type="button"
            disabled={isDeleting}
            onClick={() => deleteAccount(userData.username)}
            className="cursor-pointer rounded-lg border border-solid border-transparent transition-colors bg-foreground text-background hover:bg-red-500 dark:hover:bg-red-500 font-medium text-sm sm:text-base h-10 sm:h-12 mt-3 px-4 sm:px-5"
          >
            Delete Account
          </button>
        </>
      )}
      {isMutating && (
        <div className="my-3 text-sm text-yellow-300">Updating profile...</div>
      )}
      {error && (
        <div className="my-3 text-sm text-red-500">Error: {error.message}</div>
      )}
    </main>
  );
}
