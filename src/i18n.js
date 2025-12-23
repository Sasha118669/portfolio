export const translations = {
  en: {
    home: "Home",
    about: "About",
    portfolio: "Portfolio",
    contact: "Contact",
    welcome: "Welcome",
    language: "Language",
    description: "My Portfolio",
  },
  ru: {
    home: "Главная",
    about: "О мне",
    portfolio: "Портфолио",
    contact: "Контакты",
    welcome: "Добро пожаловать",
    language: "Язык",
    description: "Мое портфолио",
  },
};

export const getCurrentLanguage = () => {
  return localStorage.getItem("language") || "en";
};

export const setLanguage = (lang) => {
  localStorage.setItem("language", lang);
};

export const t = (key) => {
  const lang = getCurrentLanguage();
  return translations[lang]?.[key] || translations["en"]?.[key] || key;
};
