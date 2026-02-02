import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";

const SUPPORTED_LOCALES = ["en", "es"] as const;
type Locale = (typeof SUPPORTED_LOCALES)[number];

function isSupported(locale: string): locale is Locale {
  return SUPPORTED_LOCALES.includes(locale as Locale);
}

function getLocaleFromAcceptLanguage(header: string): Locale {
  const preferred = header
    .split(",")
    .map((part) => part.split(";")[0].trim().substring(0, 2).toLowerCase());
  for (const lang of preferred) {
    if (isSupported(lang)) return lang;
  }
  return "es";
}

export default getRequestConfig(async () => {
  const cookieStore = cookies();
  const headerStore = headers();

  const cookieLocale = cookieStore.get("locale")?.value;
  let locale: Locale = "es";

  if (cookieLocale && isSupported(cookieLocale)) {
    locale = cookieLocale;
  } else {
    const acceptLang = headerStore.get("accept-language") ?? "";
    locale = getLocaleFromAcceptLanguage(acceptLang);
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
