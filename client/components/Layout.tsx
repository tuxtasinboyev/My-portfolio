import React, { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useTranslation } from "./LanguageProvider";
import Background3D from "./Background3D";
import Cursor from "./Cursor";

const nav = [
  { href: "/", key: "nav_home" },
  { href: "/portfolio", key: "nav_projects" },
  { href: "/contact", key: "nav_contact" },
];

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { t, lang, setLang } = useTranslation();
  const [theme, setTheme] = React.useState<string>(
    () => localStorage.getItem("theme") || "light",
  );

  React.useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="min-h-dvh relative overflow-hidden bg-background text-foreground">
      <Background3D />
      <Cursor />

      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="font-extrabold tracking-tight">
            {t("name")}
          </Link>
          <div className="flex items-center gap-3">
            <nav className="hidden md:flex items-center gap-1">
              {nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground",
                    (location.pathname === item.href ||
                      window.location.hash === item.href) &&
                      "text-foreground",
                  )}
                >
                  {t(item.key)}
                </a>
              ))}
            </nav>

            <select
              aria-label="Language"
              value={lang}
              onChange={(e) => setLang(e.target.value as any)}
              className="rounded-md border bg-background/50 px-2 py-1 text-sm"
            >
              <option value="uz">UZ</option>
              <option value="ru">RU</option>
              <option value="en">EN</option>
            </select>

            <button
              aria-label="Toggle theme"
              onClick={() => setTheme((s) => (s === "dark" ? "light" : "dark"))}
              className="ml-2 rounded-md border px-2 py-1 text-sm"
            >
              {theme === "dark" ? "Light" : "Dark"}
            </button>
          </div>
        </div>
      </header>

      <div className="pb-20">{children}</div>

      <footer className="border-t py-10">
        <div className="container flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
          <p>© 2025 {t("name")}</p>
          <div className="flex items-center gap-4">
            <a href={`mailto:${t("email")}`} className="hover:text-foreground">
              {t("email")}
            </a>
            <a
              href={`tel:${t("phone").replace(/ /g, "")}`}
              className="hover:text-foreground"
            >
              {t("phone")}
            </a>
            <a
              href="https://github.com/tuxtasinboyev"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground"
            >
              {t("github")}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
