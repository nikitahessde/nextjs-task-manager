"use client";

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

const LanguageSwitcher = () => {
  const t = useTranslations("settings");
  const [language, setLanguage] = useState("en");
  const router = useRouter();

  useEffect(() => {
    const savedLanguage = Cookies.get("language");
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleLanguageChange = (selectedLanguage: string) => {
    setLanguage(selectedLanguage);
    Cookies.set("language", selectedLanguage);
    router.refresh();
  };

  return (
    <div className="flex w-full flex-col gap-4 rounded-lg border-2 border-primary bg-secondary p-4">
      <p className="text-xl font-semibold">{t("language")}</p>
      <div className="flex gap-4">
        <button
          className={`block rounded-lg px-4 py-2 text-sm text-gray-700 ${language === "en" ? "bg-black text-white" : "border border-black"}`}
          onClick={() => handleLanguageChange("en")}
        >
          {t("english")}
        </button>
        <button
          className={`block rounded-lg px-4 py-2 text-sm text-gray-700 ${language === "lv" ? "bg-black text-white" : "border border-black"}`}
          onClick={() => handleLanguageChange("lv")}
        >
          {t("latvian")}
        </button>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
