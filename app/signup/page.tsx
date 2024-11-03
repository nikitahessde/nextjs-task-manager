"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { register as registerAction } from "@/actions/register";
import { useForm } from "react-hook-form";
import { UserRole } from "@/models/User";
import { useTranslations } from "next-intl";

type RegistrationFormData = {
  email: string;
  password: string;
  name: string;
  roles: UserRole[];
  confirmPassword: string;
};

export default function Register() {
  const t = useTranslations("signup");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm<RegistrationFormData>({
    criteriaMode: "all",
  });
  const router = useRouter();

  const onSubmit = async (data: RegistrationFormData) => {
    const { email, password, name, roles } = data;

    const r = await registerAction({ email, password, name, roles });
    reset();
    if (r?.error) {
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
        <p className="text-xl font-semibold">{t("register")}</p>
        <div className="flex flex-col gap-2">
          <label className="w-full text-sm">{t("full-name")}</label>
          <input
            type="text"
            placeholder={t("full-name")}
            className="w-full rounded-lg border border-gray-400 p-2 text-sm"
            {...register("name", { required: true })}
          />
          {errors.name && <span className="text-xs text-red-500">{t("field-is-required")}</span>}
        </div>
        <div className="flex flex-col gap-2">
          <label className="w-full text-sm">{t("email")}</label>
          <input
            type="email"
            placeholder={t("email")}
            className="w-full rounded-lg border border-gray-400 p-2 text-sm"
            {...register("email", { required: true })}
          />
          {errors.email && <span className="text-xs text-red-500">{t("field-is-required")}</span>}
        </div>
        <div className="flex flex-col gap-2">
          <label className="w-full text-sm">{t("role")}</label>
          <div className="flex flex-wrap gap-2">
            {Object.values(UserRole).map((role) => (
              <label key={role} className="flex items-center">
                <input
                  type="checkbox"
                  value={role}
                  className="mr-2"
                  {...register("roles", { required: true })}
                />
                <span>{role}</span>
              </label>
            ))}
          </div>
          {errors.roles && <span className="text-xs text-red-500">{t("field-is-required")}</span>}
        </div>
        <div className="flex flex-col gap-2">
          <label className="w-full text-sm">{t("password")}</label>
          <div className="flex w-full">
            <input
              type="password"
              placeholder={t("password")}
              className="w-full rounded-lg border border-gray-400 p-2 text-sm"
              {...register("password", { required: true })}
            />
          </div>
          {errors.password && (
            <span className="text-xs text-red-500">{t("field-is-required")}</span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label className="w-full text-sm">{t("confirm-password")}</label>
          <div className="flex w-full">
            <input
              type="password"
              placeholder={t("confirm-password")}
              className="w-full rounded-lg border border-gray-400 p-2 text-sm"
              {...register("confirmPassword", {
                required: true,
                validate: (value) => value === getValues("password") || "Passwords do not match",
              })}
            />
          </div>
          {errors.confirmPassword && (
            <span className="text-xs text-red-500">{t("empty-field-password-match")}</span>
          )}
        </div>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-primary px-4 py-2 text-sm font-medium text-black"
        >
          {t("signup")}
        </button>
        <Link
          href="/login"
          className="ease text-sm text-[#888] transition duration-150 hover:text-black"
        >
          {t("already-have-account")}
        </Link>
      </form>
    </div>
  );
}
