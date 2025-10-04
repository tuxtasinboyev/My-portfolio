import { useTranslation } from "@/components/LanguageProvider";
import ProjectCard from "@/components/ProjectCard";

export default function Portfolio() {
  const { t } = useTranslation();
  return (
    <main className="container py-20">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold">{t("projects")}</h1>
          <p className="mt-3 text-muted-foreground">
            {t("portfolio_placeholder")}
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          <ProjectCard
            title={t("project_edora_title")}
            desc={t("project_edora_desc")}
            tags={["Node.js", "NestJS", "PostgreSQL"]}
            href="https://github.com/tuxtasinboyev"
          />
          <ProjectCard
            title={t("project_botify_title")}
            desc={t("project_botify_desc")}
            tags={["Node.js", "NestJS", "PostgreSQL", "Telegram Bot"]}
            href="https://github.com/tuxtasinboyev"
          />
          <ProjectCard
            title={t("project_telegram_title")}
            desc={t("project_telegram_desc")}
            tags={["WebSockets", "NestJS", "Next.js", "TypeScript"]}
            href="https://github.com/tuxtasinboyev"
          />
          <ProjectCard
            title={t("project_freelancer_title")}
            desc={t("project_freelancer_desc")}
            tags={["React", "NestJS", "PostgreSQL", "Payme"]}
            href="https://github.com/tuxtasinboyev"
          />
        </div>
      </div>
    </main>
  );
}
