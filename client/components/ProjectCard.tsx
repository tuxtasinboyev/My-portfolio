import React from "react";
import { useTranslation } from "./LanguageProvider";

export default function ProjectCard({
  title,
  desc,
  tags,
  href,
}: {
  title: string;
  desc: string;
  tags: string[];
  href: string;
}) {
  const { t } = useTranslation();
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group block rounded-xl border bg-card p-5 shadow-sm transition hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-semibold group-hover:text-primary">
          {title}
        </h3>
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary ring-1 ring-inset ring-primary/20">
          {t("github_badge")}
        </span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-muted px-2.5 py-1 text-[11px] text-muted-foreground ring-1 ring-inset ring-border"
          >
            {tag}
          </span>
        ))}
      </div>
    </a>
  );
}
