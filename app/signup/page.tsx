"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { register } from "@/actions/register";
export default function Register() {
  const [error, setError] = useState<string>();
  const router = useRouter();
  const ref = useRef<HTMLFormElement>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;

    if (!email || !password || !name) {
      setError("All fields are required.");
      return;
    }

    const r = await register({
        email,
        password,
        name    
      });
      ref.current?.reset();
      if(r?.error){
        setError(r.error);
        return;
      } else {
        return router.push("/login");
      }}
      
      return(
        <div className="border-2 border-primary bg-secondary rounded-lg p-4 flex flex-col gap-4">
          <form ref={ref}
            onSubmit={handleSubmit}
            className="w-full flex flex-col justify-between gap-7 rounded">
            {error && <div className="text-red-500">{error}</div>}
            <p className="text-xl font-semibold">Register</p>
            <div className="flex flex-col gap-2">
                <label className="w-full text-sm">Full Name</label>
                <input
                  type="text"
                  placeholder="Full Name"
                  className="border border-gray-400 p-2 rounded-lg w-full text-sm"
                  name="name"
                />
            </div>
            <div className="flex flex-col gap-2">
                <label className="w-full text-sm">Email</label>
                <input
                  type="email"
                  placeholder="Email"
                  className="border border-gray-400 p-2 rounded-lg w-full text-sm"
                  name="email"
                />
            </div>
            <div className="flex flex-col gap-2">
                <label className="w-full text-sm">Password</label>
                <div className="flex w-full">
                  <input
                    type="password"
                    placeholder="Password"
                    className="border border-gray-400 p-2 rounded-lg w-full text-sm"
                    name="password"
                  />
                </div>
            </div>
            <button type="submit" className="inline-flex justify-center rounded-md border border-primary py-2 px-4 text-sm font-medium text-black">Sign up</button>
            <Link
              href="/login"
              className="text-sm text-[#888] transition duration-150 ease hover:text-black">
              Already have an account?
            </Link>
          </form>
        </div>
        )
};

