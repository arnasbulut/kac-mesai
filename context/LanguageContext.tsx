import createContextHook from "@nkzw/create-context-hook";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Language, translations, TranslationKey } from "@/constants/languages";

const LANGUAGE_STORAGE_KEY = "cost-in-hours-language";

export const [LanguageProvider, useLanguage] = createContextHook(() => {
  const [language, setLanguage] = useState<Language>('tr');
  const [isLoading, setIsLoading] = useState(true);

  // Load language from storage on mount
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const storedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (storedLanguage && (storedLanguage === 'en' || storedLanguage === 'tr')) {
          setLanguage(storedLanguage as Language);
        }
      } catch (error) {
        console.error("Failed to load language:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLanguage();
  }, []);

  // Update language
  const updateLanguage = async (newLanguage: Language) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage);
      setLanguage(newLanguage);
    } catch (error) {
      console.error("Failed to save language:", error);
    }
  };

  // Translation function
  const t = (key: TranslationKey): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  return {
    language,
    updateLanguage,
    t,
    isLoading,
  };
});
