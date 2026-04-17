import React, { createContext, useContext, useState, useEffect } from 'react';

type ArabicFont = 'Amiri' | 'Scheherazade New';

interface SettingsContextType {
  arabicFont: ArabicFont;
  setArabicFont: (font: ArabicFont) => void;
  arabicFontSize: number;
  setArabicFontSize: (size: number) => void;
  translationFontSize: number;
  setTranslationFontSize: (size: number) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [arabicFont, setArabicFont] = useState<ArabicFont>(() => {
    const saved = localStorage.getItem('arabicFont');
    return (saved as ArabicFont) || 'Amiri';
  });
  
  const [arabicFontSize, setArabicFontSize] = useState(() => {
    const saved = localStorage.getItem('arabicFontSize');
    return saved ? parseInt(saved) : 28;
  });
  
  const [translationFontSize, setTranslationFontSize] = useState(() => {
    const saved = localStorage.getItem('translationFontSize');
    return saved ? parseInt(saved) : 16;
  });

  useEffect(() => {
    localStorage.setItem('arabicFont', arabicFont);
  }, [arabicFont]);

  useEffect(() => {
    localStorage.setItem('arabicFontSize', arabicFontSize.toString());
  }, [arabicFontSize]);

  useEffect(() => {
    localStorage.setItem('translationFontSize', translationFontSize.toString());
  }, [translationFontSize]);

  return (
    <SettingsContext.Provider
      value={{
        arabicFont,
        setArabicFont,
        arabicFontSize,
        setArabicFontSize,
        translationFontSize,
        setTranslationFontSize,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
