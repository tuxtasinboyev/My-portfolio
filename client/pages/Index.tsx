import { Button } from "@/components/ui/button";
import { useTranslation } from "@/components/LanguageProvider";
import { useState } from "react";
import { motion } from "framer-motion";
import ProjectCard from "@/components/ProjectCard";

export default function Index() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio inquiry from ${form.name}`);
    const body = encodeURIComponent(
      form.message + "\n\n" + t("contact_label") + " " + form.email,
    );
    window.location.href = `mailto:${t("email")}?subject=${subject}&body=${body}`;
  };

  const createPdfBlob = (text: string) => {
    const lines = text.split("\n");
    const encoder = new TextEncoder();

    // Build content stream
    const contentLines: string[] = [];
    contentLines.push("BT");
    contentLines.push("/F1 12 Tf");
    contentLines.push("50 740 Td");
    for (let i = 0; i < lines.length; i++) {
      const escaped = lines[i]
        .replace(/\\\\/g, "\\\\\\\\")
        .replace(/\(/g, "\\(")
        .replace(/\)/g, "\\)");
      contentLines.push(`(${escaped}) Tj`);
      if (i < lines.length - 1) contentLines.push("0 -14 Td");
    }
    contentLines.push("ET");
    const content = contentLines.join("\n");

    // Objects
    const objs: string[] = [];

    objs.push("%PDF-1.1\n");

    objs.push("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");
    objs.push("2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n");
    // page obj will reference content length later
    // font
    objs.push(
      "4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n",
    );

    // content stream placeholder
    // we will build 3 and 5
    // 3 = page
    // 5 = content stream

    // prepare content stream bytes
    const contentStream = `stream\n${content}\nendstream\n`;

    const contentBytes = encoder.encode(contentStream);
    const length = contentBytes.length;

    const contentObj = `5 0 obj\n<< /Length ${length} >>\n${contentStream}endobj\n`;

    const pageObj = `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n`;

    // assemble all in order: header + 1 + 2 + 4 + 3 + 5
    const parts = [] as Uint8Array[];
    parts.push(encoder.encode("%PDF-1.1\n"));
    const objsStr = [
      "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
      "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n",
      "4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n",
      pageObj,
      `5 0 obj\n<< /Length ${length} >>\nstream\n${content}\nendstream\nendobj\n`,
    ];

    // calculate xref offsets
    let offset = 0;
    const buffers: Uint8Array[] = [];
    const add = (s: string | Uint8Array) => {
      let b: Uint8Array;
      if (typeof s === "string") b = encoder.encode(s);
      else b = s;
      buffers.push(b);
      offset += b.length;
      return offset - b.length;
    };

    // header
    add("%PDF-1.1\n");
    const offsets: number[] = [];
    for (const o of objsStr) {
      offsets.push(add(o));
    }

    const xrefStart = offset;
    let xref = "xref\n0 " + (offsets.length + 1) + "\n0000000000 65535 f \n";
    for (const off of offsets) {
      xref += String(off).padStart(10, "0") + " 00000 n \n";
    }

    const trailer = `trailer\n<< /Size ${offsets.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;

    const finalParts = [
      ...buffers.map((b) => b),
      encoder.encode(xref),
      encoder.encode(trailer),
    ];
    const totalLen = finalParts.reduce((s, b) => s + b.length, 0);
    const out = new Uint8Array(totalLen);
    let pos = 0;
    for (const p of finalParts) {
      out.set(p, pos);
      pos += p.length;
    }

    return new Blob([out], { type: "application/pdf" });
  };

  const downloadResume = () => {
    const resume = `Omadbek Tuxtasinboyev\nFull Stack Developer\nEmail: ${t("email")}\nPhone: ${t("phone")}\n\nProfile:\nI am a full-stack web developer with experience in HTML, CSS, JavaScript, React, and Node.js.\n\nEmployment History:\nFull Stack Web Developer, Freelancer - Fergana (May 2025 – Present)\n\nProjects:\n- Edora (LMS)\n- Botify.uz\n- Telegram-clone\n\nSkills:\nReact, TypeScript, Node.js, NestJS, PostgreSQL, MySQL, MongoDB, WebSockets, GraphQL, TailwindCSS`;
    const blob = createPdfBlob(resume);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Omadbek_Tuxtasinboyev_resume.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.main
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-b from-background to-muted/40"
    >
      {/* Hero */}
      <section className="container py-20 md:py-28">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
              {t("hero_badge")}
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              {t("name")}
            </h1>
            <p className="text-lg text-muted-foreground">{t("subtitle")}</p>

            <div className="flex flex-wrap gap-3">
              <a href="#contact">
                <Button size="lg">{t("contact")}</Button>
              </a>
              <a href="/portfolio">
                <Button size="lg" variant="outline">
                  {t("projects")}
                </Button>
              </a>
              <a
                href="https://github.com/tuxtasinboyev"
                target="_blank"
                rel="noreferrer"
              >
                <Button size="lg" variant="ghost">
                  {t("github")}
                </Button>
              </a>
              <Button size="lg" variant="link" onClick={() => downloadResume()}>
                {t("download_resume")}
              </Button>
            </div>

            <div className="flex flex-wrap gap-6 pt-2 text-sm text-muted-foreground">
              <a
                href={`tel:${t("phone").replace(/ /g, "")}`}
                className="hover:text-foreground"
              >
                {t("phone")}
              </a>
              <a
                href={`mailto:${t("email")}`}
                className="hover:text-foreground"
              >
                {t("email")}
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent blur-2xl" />
            <div className="rounded-2xl border bg-card p-6 shadow-xl">
              <div className="grid gap-4 sm:grid-cols-2">
                <Feature
                  label={t("feature_frontend")}
                  items={["React", "TypeScript", "TailwindCSS", "HTML/CSS"]}
                />
                <Feature
                  label={t("feature_backend")}
                  items={["Node.js", "NestJS", "Express", "Microservices"]}
                />
                <Feature
                  label={t("feature_db")}
                  items={["PostgreSQL", "MySQL", "MongoDB"]}
                />
                <Feature
                  label={t("feature_realtime")}
                  items={["WebSockets", "GraphQL", "Payme", "Telegram (clone)"]}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="container py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-1">
            <h2 className="text-2xl font-bold">{t("about_title")}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{t("profile")}</p>
          </div>
          <div className="md:col-span-2 space-y-4 text-muted-foreground">
            <p>{t("about_p1")}</p>
            <p>{t("about_p2")}</p>
          </div>
        </div>
      </section>

      {/* Experience & Projects */}
      <section className="container py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{t("experience_title")}</h2>
            <div className="rounded-xl border bg-card p-4">
              <div className="flex items-center justify-between">
                <p className="font-medium">{t("freelancer_place")}</p>
                <span className="text-xs text-muted-foreground">
                  {t("period_current")}
                </span>
              </div>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                <li>HTML, CSS, JS, React, TypeScript</li>
                <li>Node.js, NestJS, Microservices, WebSockets</li>
                <li>PostgreSQL, MySQL, MongoDB</li>
              </ul>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold">{t("projects_title")}</h2>
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
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="container py-12">
        <div className="rounded-2xl border bg-gradient-to-br from-primary/10 via-background to-background p-8">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h3 className="text-2xl font-bold">{t("contact_title")}</h3>
              <p className="mt-2 max-w-prose text-muted-foreground">
                {t("contact_description")}
              </p>
            </div>
            <form onSubmit={onSubmit} className="w-full max-w-md">
              <div className="grid gap-2 sm:grid-cols-2">
                <input
                  placeholder={t("placeholder_name")}
                  value={form.name}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, name: e.target.value }))
                  }
                  className="rounded-md border bg-background p-2"
                />
                <input
                  placeholder={t("placeholder_email")}
                  value={form.email}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, email: e.target.value }))
                  }
                  className="rounded-md border bg-background p-2"
                />
              </div>
              <textarea
                placeholder={t("placeholder_message")}
                value={form.message}
                onChange={(e) =>
                  setForm((s) => ({ ...s, message: e.target.value }))
                }
                className="mt-3 w-full rounded-md border bg-background p-2"
                rows={4}
              />
              <div className="mt-3 flex gap-3">
                <Button type="submit">{t("send")}</Button>
                <a href={`mailto:${t("email")}`}>
                  <Button variant="outline">{t("btn_email")}</Button>
                </a>
              </div>
            </form>
          </div>
        </div>
      </section>
    </motion.main>
  );
}

function Feature({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="rounded-lg border p-4">
      <p className="text-sm font-semibold">{label}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((t) => (
          <span
            key={t}
            className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground ring-1 ring-inset ring-border"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
