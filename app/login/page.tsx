"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) {
      setError("All fields are required.");
      return;
    }

    const res = await signIn("credentials", {
      email: email,
      password: password,
      redirect: false,
    });
    if (res?.error) {
      setError(res.error as string);
    }
    if (res?.ok) {
      return router.push("/");
    }
  };
  return (
    <div className="flex flex-col gap-4 rounded-lg border-2 border-primary bg-secondary p-4">
      <form className="flex w-full flex-col justify-between gap-7 rounded" onSubmit={handleSubmit}>
        {error && <div className="text-red-500">{error}</div>}
        <p className="text-xl font-semibold">Log In</p>
        <div className="flex flex-col gap-2">
          <label className="w-full text-sm">Email</label>
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-lg border border-gray-400 p-2 text-sm"
            name="email"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="w-full text-sm">Password</label>
          <div className="flex w-full">
            <input
              type="password"
              placeholder="Password"
              className="w-full rounded-lg border border-gray-400 p-2 text-sm"
              name="password"
            />
          </div>
        </div>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-primary px-4 py-2 text-sm font-medium text-black"
        >
          Log In
        </button>
        <Link
          href="/signup"
          className="ease text-sm text-[#888] transition duration-150 hover:text-black"
        >
          Don&apos;t have an account?
        </Link>
      </form>
    </div>
  );
}
