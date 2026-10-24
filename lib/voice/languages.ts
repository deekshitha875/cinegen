// lib/voice/languages.ts
export interface Language {
  code: string;
  name: string;
  nativeName: string;
  voiceLang: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: "en", name: "English", nativeName: "English", voiceLang: "en-US" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", voiceLang: "te-IN" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", voiceLang: "hi-IN" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", voiceLang: "ta-IN" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", voiceLang: "kn-IN" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", voiceLang: "ml-IN" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", voiceLang: "mr-IN" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", voiceLang: "bn-IN" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", voiceLang: "gu-IN" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", voiceLang: "pa-IN" },
];

export const DEFAULT_LANGUAGE = SUPPORTED_LANGUAGES[0];

export function getLanguageByCode(code: string): Language {
  return SUPPORTED_LANGUAGES.find((l) => l.code === code) ?? DEFAULT_LANGUAGE;
}
