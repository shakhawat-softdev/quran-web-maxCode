'use client';

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
  const [arabicFont, setArabicFont] = useState<ArabicFont>('Amiri');
  const [arabicFontSize, setArabicFontSize] = useState(28);
  const [translationFontSize, setTranslationFontSize] = useState(16);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage after mount
  useEffect(() => {
    setMounted(true);
    const savedFont = localStorage.getItem('arabicFont');
    const savedArabicSize = localStorage.getItem('arabicFontSize');
    const savedTranslationSize = localStorage.getItem('translationFontSize');

    if (savedFont) setArabicFont(savedFont as ArabicFont);
    if (savedArabicSize) setArabicFontSize(parseInt(savedArabicSize));
    if (savedTranslationSize) setTranslationFontSize(parseInt(savedTranslationSize));
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('arabicFont', arabicFont);
    }
  }, [arabicFont, mounted]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('arabicFontSize', arabicFontSize.toString());
    }
  }, [arabicFontSize, mounted]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('translationFontSize', translationFontSize.toString());
    }
  }, [translationFontSize, mounted]);

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
