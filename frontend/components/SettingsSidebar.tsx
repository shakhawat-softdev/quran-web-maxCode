"use client";

import { memo, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Type, Settings as SettingsIcon } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface SettingsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function SettingsSidebarComponent({ isOpen, onClose }: SettingsSidebarProps) {
  const {
    arabicFont,
    setArabicFont,
    arabicFontSize,
    setArabicFontSize,
    translationFontSize,
    setTranslationFontSize,
  } = useSettings();

  const handleArabicFontChange = useCallback(
    (value: string) => {
      setArabicFont(value as any);
    },
    [setArabicFont],
  );

  const handleArabicFontSizeChange = useCallback(
    (value: number[]) => {
      setArabicFontSize(value[0]);
    },
    [setArabicFontSize],
  );

  const handleTranslationFontSizeChange = useCallback(
    (value: number[]) => {
      setTranslationFontSize(value[0]);
    },
    [setTranslationFontSize],
  );

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 w-80 bg-sidebar border-r border-sidebar-border shadow-2xl z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-sidebar border-b border-sidebar-border p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <SettingsIcon className="w-5 h-5 text-primary" />
                </div>
                <h2 className="font-['Poppins'] text-sidebar-foreground">
                  Settings
                </h2>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-lg hover:bg-sidebar-accent flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-8">
              {/* Arabic Font Selector */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-sidebar-foreground">
                  <Type className="w-4 h-4" />
                  Arabic Font
                </Label>
                <Select
                  value={arabicFont}
                  onValueChange={handleArabicFontChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Amiri">Amiri</SelectItem>
                    <SelectItem value="Scheherazade New">
                      Scheherazade New
                    </SelectItem>
                  </SelectContent>
                </Select>
                <div className="pt-2">
                  <p
                    className="text-2xl text-center text-primary p-4 bg-card rounded-lg border border-border"
                    style={{ fontFamily: arabicFont }}
                  >
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </p>
                </div>
              </div>

              {/* Arabic Font Size */}
              <div className="space-y-3">
                <Label className="flex items-center justify-between text-sidebar-foreground">
                  <span>Arabic Font Size</span>
                  <span className="text-primary font-medium">
                    {arabicFontSize}px
                  </span>
                </Label>
                <Slider
                  value={[arabicFontSize]}
                  onValueChange={handleArabicFontSizeChange}
                  min={20}
                  max={48}
                  step={1}
                  className="py-2"
                />
              </div>

              {/* Translation Font Size */}
              <div className="space-y-3">
                <Label className="flex items-center justify-between text-sidebar-foreground">
                  <span>Translation Font Size</span>
                  <span className="text-primary font-medium">
                    {translationFontSize}px
                  </span>
                </Label>
                <Slider
                  value={[translationFontSize]}
                  onValueChange={handleTranslationFontSizeChange}
                  min={12}
                  max={24}
                  step={1}
                  className="py-2"
                />
              </div>

              {/* Auto-save indicator */}
              <div className="pt-6 border-t border-sidebar-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span>Settings auto-saved</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export const SettingsSidebar = memo(SettingsSidebarComponent);
