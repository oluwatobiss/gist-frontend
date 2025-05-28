"use client";
import { useState } from "react";
import { Errors, FormEvent } from "@/app/_types";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors[]>([]);

  async function authenticateUser(e: FormEvent) {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URI}/auths`,
        {
          method: "POST",
          body: JSON.stringify({ email, password }),
          headers: { "Content-type": "application/json; charset=UTF-8" },
        }
      );
      const userData = await response.json();
      localStorage.setItem("gistToken", userData.token);
      localStorage.setItem("gistUserData", JSON.stringify(userData.payload));
      userData.errors?.length
        ? setErrors(userData.errors)
        : (window.location.href = "/");
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
    <main className="sm:px-100 sm:py-20 min-h-screen font-[family-name:var(--font-geist-sans)]">
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
          className="cursor-pointer hover:bg-gray-200 hover:text-black mt-3 px-7 py-2 border border-gray-400 border-solid rounded-sm"
        >
          Log in
        </button>
      </form>
    </main>
  );
}
