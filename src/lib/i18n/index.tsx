"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import en from "./locales/en.json";
import ta from "./locales/ta.json";
import hi from "./locales/hi.json";
import te from "./locales/te.json";
import ml from "./locales/ml.json";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const translations: Record<string, any> = {
  en,
  ta,
  hi,
  te,
  ml,
};

interface I18nContextType {
  currentLanguage: string;
  changeLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("i18n_lang");
      if (saved && translations[saved]) {
        return saved;
      }
    }
    return "en";
  });

  // Load saved language on mount (fallback/sync check)
  useEffect(() => {
    const saved = localStorage.getItem("i18n_lang");
    if (saved && translations[saved] && saved !== currentLanguage) {
      setCurrentLanguage(saved);
    }
  }, [currentLanguage]);

  // Update HTML lang attribute dynamically
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = currentLanguage;
    }
  }, [currentLanguage]);

  const changeLanguage = (lang: string) => {
    if (translations[lang]) {
      setCurrentLanguage(lang);
      localStorage.setItem("i18n_lang", lang);
    }
  };

  const t = (key: string): string => {
    const activeLocaleData = translations[currentLanguage] || translations["en"];
    return getTranslationValue(activeLocaleData, key);
  };

  return (
    <I18nContext.Provider value={{ currentLanguage, changeLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useTranslation must be used within an I18nProvider");
  }
  return context;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getTranslationValue(obj: any, path: string): string {
  const parts = path.split(".");
  let current = obj;
  for (const part of parts) {
    if (current && typeof current === "object" && part in current) {
      current = current[part];
    } else {
      return path; // Fallback to path key itself
    }
  }
  return typeof current === "string" ? current : path;
}
