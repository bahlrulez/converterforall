import React, { useState, useEffect } from 'react';
import { StyleSettings, PositionSettings, FontPayload } from './style-types';
import { DEFAULT_STYLE, DEFAULT_POSITION } from './caption-renderer';
import { FONT_OPTIONS } from './presets';

export function useFontLoader() {
  const [loadedFonts, setLoadedFonts] = useState<Set<string>>(new Set());
  const [fontPayloads, setFontPayloads] = useState<FontPayload[]>([]);

  const loadFontStack = async (fontStack: string) => {
    let option = FONT_OPTIONS.find(opt => opt.value === fontStack);
    
    // Validate localStorage styles: if font ID or file no longer exists, fallback
    if (!option) {
      console.warn("Saved font stack not found in options, falling back to default.");
      option = FONT_OPTIONS[0]; // fallback
    }

    const newPayloads: FontPayload[] = [];
    const newLoaded = new Set(loadedFonts);

    for (const fileName of option.files) {
      if (newLoaded.has(fileName)) continue;

      try {
        // Extract family name intelligently
        let familyName = "";
        if (fileName.toLowerCase().includes('poppins')) familyName = "Poppins";
        else if (fileName.toLowerCase().includes('baloo-2') || fileName.toLowerCase().includes('baloo2')) familyName = "Baloo 2";
        else if (fileName.toLowerCase().includes('mukta')) familyName = "Mukta";
        else if (fileName.toLowerCase().includes('notosansdevanagari')) familyName = "Noto Sans Devanagari";
        else if (fileName.toLowerCase().includes('notosansgurmukhi')) familyName = "Noto Sans Gurmukhi";
        else if (fileName.toLowerCase().includes('hind')) familyName = "Hind";
        else familyName = fileName.split('-')[0].replace(/([a-z])([A-Z])/g, "$1 $2");

        const res = await fetch(`/fonts/` + fileName);
        if (!res.ok) throw new Error("Failed to fetch font: " + fileName);
        const buffer = await res.arrayBuffer();
        
        // Add to main thread document
        const font = new FontFace(familyName, buffer);
        await font.load();
        document.fonts.add(font);
        
        // Keep buffer for worker
        newPayloads.push({ name: familyName, buffer });
        newLoaded.add(fileName);
      } catch (err) {
        console.error(`Failed to load font ` + fileName, err);
      }
    }

    if (newPayloads.length > 0) {
      setFontPayloads(prev => [...prev, ...newPayloads]);
      setLoadedFonts(newLoaded);
    }
  };

  return { loadFontStack, fontPayloads };
}
