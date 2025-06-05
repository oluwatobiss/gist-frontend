"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Errors, FormEvent, PostUserAuthOption } from "@/app/_types";
import useSWRMutation from "swr/mutation";

async function postUserAuthData(url: string, { arg }: PostUserAuthOption) {
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(arg),
    headers: { "Content-type": "application/json; charset=UTF-8" },
  });
  return await response.json();
}

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors[]>([]);
  const { trigger, isMutating, error } = useSWRMutation(
    `${process.env.NEXT_PUBLIC_BACKEND_URI}/auths`,
    postUserAuthData
  );

  async function authenticateUser(e: FormEvent) {
    e.preventDefault();
    try {
      const result = await trigger({ email, password });

      console.log("=== authenticateUser ===");
      console.log(result);

      localStorage.setItem("gistToken", result.token);
      localStorage.setItem("streamToken", result.streamToken);
      localStorage.setItem("gistUserData", JSON.stringify(result.payload));
      result.errors?.length ? setErrors(result.errors) : router.push("/");
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
      <form
        className="[&_input]:w-full [&_input]:border [&_input]:border-gray-500 [&_input]:rounded-sm [&_input]:my-1 [&_input]:px-5 [&_input]:py-2 [&_input]:text-lg [&_label]:inline-block [&_label]:text-sm [&_label]:mt-3"
        onSubmit={authenticateUser}
      >
        <div>
          <label htmlFor="email">Email</label>
          <input
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
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {showErrorFor("password")}
        </div>
        <button
          type="submit"
          disabled={isMutating}
          className="cursor-pointer rounded-lg border border-solid border-transparent transition-colors bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 mt-3 px-4 sm:px-5"
        >
          Log in
        </button>
        {isMutating && (
          <div className="my-3 text-sm text-yellow-300">
            Authentication in progress...
          </div>
        )}
        {error && (
          <div className="my-3 text-sm text-red-500">
            Error: {error.message}
          </div>
        )}
      </form>
      <div className="mt-3 text-sm">
        <span>Don't have an account? </span>
        <a className="text-blue-300 hover:text-blue-500" href="/sign-up">
          Sign up
        </a>
      </div>
    </main>
  );
}
