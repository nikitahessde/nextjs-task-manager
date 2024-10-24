"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { register as registerAction } from "@/actions/register";
import { useForm } from "react-hook-form";

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm({
    criteriaMode: "all",
  });
  const router = useRouter();

  const onSubmit = async (data: any) => {
    const { email, password, name, role } = data;

    const r = await registerAction({ email, password, name, role });
    reset();
    if (r?.error) {
      return;
    } else {
      return router.push("/login");
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg border-2 border-primary bg-secondary p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col justify-between gap-7 rounded"
      >
        <p className="text-xl font-semibold">Register</p>
        <div className="flex flex-col gap-2">
          <label className="w-full text-sm">Full Name</label>
          <input
            type="text"
            placeholder="Full Name"
            className="w-full rounded-lg border border-gray-400 p-2 text-sm"
            {...register("name", { required: true })}
          />
          {errors.name && <span className="text-xs text-red-500">This field is required</span>}
        </div>
        <div className="flex flex-col gap-2">
          <label className="w-full text-sm">Email</label>
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-lg border border-gray-400 p-2 text-sm"
            {...register("email", { required: true })}
          />
          {errors.email && <span className="text-xs text-red-500">This field is required</span>}
        </div>
        <div className="flex flex-col gap-2">
          <label className="w-full text-sm">Role</label>
          <select
            className="w-full rounded-lg border border-gray-400 p-2 text-sm"
            {...register("role", { required: true })}
          >
            <option value="admin">Admin</option>
            <option value="developer">Software Developer</option>
            <option value="manager">Manager</option>
          </select>
          {errors.role && <span className="text-xs text-red-500">This field is required</span>}
        </div>
        <div className="flex flex-col gap-2">
          <label className="w-full text-sm">Password</label>
          <div className="flex w-full">
            <input
              type="password"
              placeholder="Password"
              className="w-full rounded-lg border border-gray-400 p-2 text-sm"
              {...register("password", { required: true })}
            />
          </div>
          {errors.password && <span className="text-xs text-red-500">This field is required</span>}
        </div>
        <div className="flex flex-col gap-2">
          <label className="w-full text-sm">Confirm Password</label>
          <div className="flex w-full">
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full rounded-lg border border-gray-400 p-2 text-sm"
              {...register("confirmPassword", {
                required: true,
                validate: (value) => value === getValues("password") || "Passwords do not match",
              })}
            />
          </div>
          {errors.confirmPassword && (
            <span className="text-xs text-red-500">Field is empty or passwords do not match</span>
          )}
        </div>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-primary px-4 py-2 text-sm font-medium text-black"
        >
          Sign up
        </button>
        <Link
          href="/login"
          className="ease text-sm text-[#888] transition duration-150 hover:text-black"
        >
          Already have an account?
        </Link>
      </form>
    </div>
  );
}
