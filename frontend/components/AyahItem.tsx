"use client";

import { memo } from "react";
import { motion } from "motion/react";
import { type Ayah } from "@/lib/quran-data";
import { useSettings } from "@/context/SettingsContext";

interface AyahItemProps {
  ayah: Ayah;
}

function AyahItemComponent({ ayah }: AyahItemProps) {
  const { arabicFont, arabicFontSize, translationFontSize } = useSettings();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-card rounded-xl p-6 border border-border shadow-sm"
    >
      {/* Ayah Number Badge */}
      <div className="flex justify-end mb-4">
        <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent/20 border border-accent/30">
          <span className="text-accent-foreground text-sm font-medium">
            {ayah.number}
          </span>
        </div>
      </div>

      {/* Arabic Text */}
      <div className="mb-6">
        <p
          className="text-right leading-loose text-primary"
          style={{
            fontFamily: arabicFont,
            fontSize: `${arabicFontSize}px`,
            lineHeight: "2",
          }}
        >
          {ayah.text}
        </p>
      </div>

      {/* Translation */}
      <div className="pt-4 border-t border-border/50">
        <p
          className="text-muted-foreground font-['Inter'] leading-relaxed"
          style={{
            fontSize: `${translationFontSize}px`,
          }}
        >
          {ayah.translation}
        </p>
      </div>
    </motion.div>
  );
}

export const AyahItem = memo(AyahItemComponent);
