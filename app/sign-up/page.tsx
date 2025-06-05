"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChangeEvent, Errors, FormEvent, PostUserOption } from "@/app/_types";
import useSWRMutation from "swr/mutation";

async function postUser(url: string, { arg }: PostUserOption) {
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(arg),
    headers: { "Content-type": "application/json; charset=UTF-8" },
  });
  return await response.json();
}

export default function SignUp() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [admin, setAdmin] = useState(false);
  const [adminCode, setAdminCode] = useState("");
  const [errors, setErrors] = useState<Errors[]>([]);
  const { trigger, isMutating, data, error } = useSWRMutation(
    `${process.env.NEXT_PUBLIC_BACKEND_URI}/users`,
    postUser
  );

  async function registerUser(e: FormEvent) {
    e.preventDefault();
    try {
      const result = await trigger({
        firstName,
        lastName,
        username,
        email,
        password,
        admin,
        adminCode,
      });
      console.log("=== registerUser result ===");
      console.log(result);
      console.log("=== registerUser useSWRMutation data  ===");
      console.log(data);
      result.errors?.length ? setErrors(result.errors) : router.push("/login");
    } catch (error) {
      console.log("=== registerUser error ===");
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

  return (
    <main className="sm:px-[30%] sm:py-20 min-h-screen font-[family-name:var(--font-geist-sans)]">
      <form
        className="[&_.text-input]:w-full [&_input]:border [&_input]:border-gray-500 [&_input]:rounded-sm [&_input]:my-1 [&_input]:px-5 [&_input]:py-2 [&_input]:text-lg [&_label]:inline-block [&_label]:text-sm [&_.text-input-label]:mt-3"
        onSubmit={registerUser}
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
          <label className="text-input-label" htmlFor="username">
            Username
          </label>
          <input
            className="text-input"
            type="text"
            name="username"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          {showErrorFor("username")}
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
        <div>
          <label className="text-input-label" htmlFor="password">
            Password
          </label>
          <input
            className="text-input"
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {showErrorFor("password")}
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
          Sign up
        </button>
        {isMutating && (
          <div className="my-3 text-sm text-yellow-300">
            Registration in progress...
          </div>
        )}
        {error && (
          <div className="my-3 text-sm text-red-500">
            Error: {error.message}
          </div>
        )}
      </form>
    </main>
  );
}
