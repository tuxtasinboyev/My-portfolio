import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/components/LanguageProvider";
import { Button } from "@/components/ui/button";

export default function Contact() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [error, setError] = useState("");

  const validate = () => {
    if (!form.name.trim()) return "Name is required";
    if (!form.email.includes("@")) return "Valid email required";
    if (!form.message.trim()) return "Message is required";
    return "";
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    const subject = encodeURIComponent(`Portfolio inquiry from ${form.name}`);
    const body = encodeURIComponent(
      form.message + "\n\n" + t("contact_label") + " " + form.email,
    );
    window.location.href = `mailto:${t("email")}?subject=${subject}&body=${body}`;
  };

  return (
    <motion.main
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="container py-20"
    >
      <div className="mx-auto max-w-4xl rounded-3xl border bg-card p-8 shadow-lg">
        <div className="grid gap-8 md:grid-cols-2 items-start">
          <div>
            <h1 className="text-2xl font-bold">{t("contact_title")}</h1>
            <p className="mt-2 text-muted-foreground">
              {t("contact_description")}
            </p>
            <div className="mt-6 space-y-3 text-sm text-muted-foreground">
              <div>
                <strong>Email:</strong>{" "}
                <a href={`mailto:${t("email")}`}>{t("email")}</a>
              </div>
              <div>
                <strong>Phone:</strong>{" "}
                <a href={`tel:${t("phone").replace(/ /g, "")}`}>{t("phone")}</a>
              </div>
              <div>
                <strong>Location:</strong> Fergana, Uzbekistan
              </div>
            </div>
          </div>

          <form onSubmit={onSubmit} className="w-full">
            <div className="grid gap-3">
              <input
                placeholder={t("placeholder_name")}
                value={form.name}
                onChange={(e) =>
                  setForm((s) => ({ ...s, name: e.target.value }))
                }
                className="rounded-md border p-3"
              />
              <input
                placeholder={t("placeholder_email")}
                value={form.email}
                onChange={(e) =>
                  setForm((s) => ({ ...s, email: e.target.value }))
                }
                className="rounded-md border p-3"
              />
              <textarea
                placeholder={t("placeholder_message")}
                value={form.message}
                onChange={(e) =>
                  setForm((s) => ({ ...s, message: e.target.value }))
                }
                className="rounded-md border p-3"
                rows={6}
              />
              {error && <div className="text-destructive text-sm">{error}</div>}
              <div className="flex items-center justify-end">
                <Button type="submit">{t("send")}</Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </motion.main>
  );
}
