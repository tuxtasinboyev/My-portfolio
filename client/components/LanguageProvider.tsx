import React, { createContext, useContext, useEffect, useState } from "react";

type Lang = "uz" | "ru" | "en";

const translations: Record<string, Record<Lang, string>> = {
  nav_home: { uz: "Asosiy", ru: "Главная", en: "Home" },
  nav_projects: { uz: "Loyihalar", ru: "Проекты", en: "Projects" },
  nav_contact: { uz: "Kontakt", ru: "Контакты", en: "Contact" },
  hero_badge: {
    uz: "salom, bu mening portfolio saytim",
    ru: "Привет, это мое портфолио",
    en: "hi, this is my portfolio",
  },
  name: {
    uz: "Omadbek Tuxtasinboyev",
    ru: "Омадбек Тухтасинбоев",
    en: "Omadbek Tuxtasinboyev",
  },
  subtitle: {
    uz: "Full Stack Developer — React, Node.js, NestJS, TypeScript,Telegram bot,Web bot",
    ru: "Full Stack разработчик — React, Node.js, NestJS, TypeScript,Telegram bot,Web bot",
    en: "Full Stack Developer — React, Node.js, NestJS, TypeScript,Telegram bot,Web bot",
  },
  contact: { uz: "Bog‘lanish", ru: "Связаться", en: "Contact" },
  projects: { uz: "Loyihalar", ru: "Проекты", en: "Projects" },
  github: { uz: "GitHub", ru: "GitHub", en: "GitHub" },
  phone: {
    uz: "+998 90 833 01 83",
    ru: "+998 90 833 01 83",
    en: "+998 90 833 01 83",
  },
  email: {
    uz: "omadbektuxtasinboyev06@gmail.com",
    ru: "omadbektuxtasinboyev06@gmail.com",
    en: "omadbektuxtasinboyev06@gmail.com",
  },
  about_title: { uz: "Men haqimda", ru: "Обо мне", en: "About" },
  experience_title: { uz: "Tajriba", ru: "Опыт", en: "Experience" },
  projects_title: {
    uz: "Loyihalardan namunalar",
    ru: "Примеры проектов",
    en: "Project Samples",
  },
  contact_title: {
    uz: "Keling, birga ishlaymiz",
    ru: "Давайте работать вместе",
    en: "Let’s work together",
  },

  /* feature labels */
  feature_frontend: { uz: "Frontend", ru: "Фронтенд", en: "Frontend" },
  feature_backend: { uz: "Backend", ru: "Бэкенд", en: "Backend" },
  feature_db: { uz: "Ma’lumotlar bazasi", ru: "База данных", en: "Databases" },
  feature_realtime: {
    uz: "Realtime & Integratsiyalar",
    ru: "Realtime и интеграции",
    en: "Realtime & Integrations",
  },

  /* form */
  placeholder_name: { uz: "Ism", ru: "Имя", en: "Name" },
  placeholder_email: { uz: "Email", ru: "Email", en: "Email" },
  placeholder_message: { uz: "Xabar", ru: "Сообщение", en: "Message" },
  send: { uz: "Yuborish", ru: "Отправить", en: "Send" },

  /* projects */
  project_edora_title: {
    uz: "Edora — LMS",
    ru: "Edora — LMS",
    en: "Edora — LMS",
  },
  project_edora_desc: {
    uz: "Foydalanuvchi boshqaruvi, kurslar va kontent boshqaruvi.",
    ru: "Управление пользователями, курсами и контент��м.",
    en: "User management, courses and content management.",
  },

  project_botify_title: {
    uz: "Botify.uz — backend",
    ru: "Botify.uz — backend",
    en: "Botify.uz — backend",
  },
  project_botify_desc: {
    uz: "Xizmatlar va Telegram bot integratsiyasi uchun API.",
    ru: "API для сервисов и интеграции с Telegram-ботом.",
    en: "API for services and Telegram bot integration.",
  },

  project_telegram_title: {
    uz: "Telegram-clone",
    ru: "Telegram-клон",
    en: "Telegram-clone",
  },
  project_telegram_desc: {
    uz: "WebSocket asosida real-time chat, NestJS backend va Next.js frontend.",
    ru: "Реaltime чат на WebSocket, бэкенд на NestJS и фронтенд на Next.js.",
    en: "Real-time chat with WebSockets, NestJS backend and Next.js frontend.",
  },

  project_freelancer_title: {
    uz: "Freelancer platforma",
    ru: "Платформа фриланс",
    en: "Freelancer platform",
  },
  project_freelancer_desc: {
    uz: "Ro‘yxatdan o‘tish, loyiha joylash, to‘lov integratsiyalari.",
    ru: "Регис��рация, размещение проектов и интеграции платежей.",
    en: "Registration, project posting and payment integrations.",
  },

  github_badge: { uz: "GitHub", ru: "GitHub", en: "GitHub" },
  btn_email: { uz: "Email", ru: "Email", en: "Email" },
  profile: { uz: "Profil", ru: "Профиль", en: "Profile" },
  freelancer_place: {
    uz: "Freelancer — Farg‘ona",
    ru: "Фрилансер — Фергана",
    en: "Freelancer — Fergana",
  },
  period_current: {
    uz: "May 2025 – Hozir",
    ru: "Май 2025 – Настоящее время",
    en: "May 2025 – Present",
  },
  about_p1: {
    uz: "Men to‘liq stack veb dasturchiman. HTML, CSS, JavaScript, React va Node.js bilan ishlayman. Mustaqil va jamoa bilan loyihalar qilganman.",
    ru: "Я Full Stack разработчик. Работаю с HTML, CSS, JavaScript, React и Node.js. Работал над проектами как индивидуально, так и в команде.",
    en: "I am a full-stack web developer working with HTML, CSS, JavaScript, React and Node.js. I have built projects both solo and in teams.",
  },
  about_p2: {
    uz: "Moslashuvchan saytlar va kuchli backendlar yarataman. NestJS bilan REST APIlar, PostgreSQL, MySQL va MongoDB bilan ishlayman.",
    ru: "Создаю адаптивные сайты и надежные бэкенды. Работаю с NestJS, PostgreSQL, MySQL и MongoDB.",
    en: "I build responsive sites and robust backends. I work with NestJS, PostgreSQL, MySQL and MongoDB.",
  },
  contact_description: {
    uz: "Loyiha g‘oyangiz bormi? Forma orqali xabar yuboring yoki emailga to‘g‘ridan-to‘g‘ri yozing.",
    ru: "Есть идея проекта? Отправьте сообщение через форму или напишите на почту.",
    en: "Have a project idea? Send a message via the form or email me directly.",
  },
  contact_label: { uz: "Kontakt:", ru: "Контакт:", en: "Contact:" },
  download_resume: {
    uz: "Resume yuklab olish",
    ru: "Скачать резюме",
    en: "Download Resume",
  },
  portfolio_placeholder: {
    uz: "Bu sahifa loyihalar ro‘yxatini ko‘rsatadi.",
    ru: "Эта страница покажет список проектов.",
    en: "This page will list projects in detail.",
  },
};

const LangContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}>({
  lang: "uz",
  setLang: () => {},
  t: (k) => k,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [lang, setLang] = useState<Lang>(
    () =>
      (localStorage.getItem("lang") as Lang) ||
      (navigator.language.startsWith("ru")
        ? "ru"
        : navigator.language.startsWith("en")
          ? "en"
          : "uz"),
  );

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  const t = (key: string) => {
    const map = translations[key];
    if (!map) return key;
    return map[lang] || map.uz;
  };

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
};

export const useTranslation = () => useContext(LangContext);
