import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Music, Sparkles, Tv, Film, Disc, Calendar, Share2, Copy, 
  RotateCcw, History, ArrowRight, Play, Volume2, Info, Star, HelpCircle,
  Download, Printer, Heart, Palette, Sliders, MapPin, Eye, CloudRain
} from "lucide-react";
import { NostalgiaResult, SavedSearch } from "./types";

// Keepsake Customization Options
const spotlightOptions = [
  { id: "culture", label: "The Era Vibe", icon: "✨", subtitle: "Era Vibe & Cultural Snapshot", description: "A snapshot of the generation's collective pulse and social shift." },
  { id: "movie", label: "Cinema Spotlight", icon: "🎬", subtitle: "Box Office Champion", description: "The #1 film captivating audiences in cinemas everywhere." },
  { id: "tv", label: "Prime Broadcast", icon: "📺", subtitle: "Living Room Standard", description: "The legendary show dominating antennas and prime-time TV." },
  { id: "star", label: "Shared Birthday Icon", icon: "⭐", subtitle: "Celestial Co-Star", description: "The iconic celebrity sharing the timeline alongside you." }
];

const themeOptions = [
  { id: "violet", label: "Midnight Violet", gradient: "from-indigo-950 via-purple-950/40 to-[#08080a]", accent: "text-purple-300", accentBorder: "border-purple-500/20", recordBg: "bg-purple-600", primaryGlow: "rgba(168, 85, 247, 0.2)", bgClass: "bg-[#0b0a12]", textMuted: "text-purple-200/60" },
  { id: "gold", label: "Vintage Gold", gradient: "from-amber-950 via-[#271d0e]/40 to-[#080705]", accent: "text-amber-400", accentBorder: "border-amber-500/20", recordBg: "bg-[#aa802c]", primaryGlow: "rgba(245, 158, 11, 0.15)", bgClass: "bg-[#0c0a06]", textMuted: "text-amber-200/50" },
  { id: "teal", label: "Emerald Sea", gradient: "from-teal-950 via-emerald-950/40 to-[#050808]", accent: "text-teal-300", accentBorder: "border-teal-500/20", recordBg: "bg-teal-600", primaryGlow: "rgba(20, 184, 166, 0.2)", bgClass: "bg-[#060b0b]", textMuted: "text-teal-200/60" },
  { id: "carbon", label: "Modern Graphite", gradient: "from-zinc-900 via-zinc-950 to-black", accent: "text-slate-300", accentBorder: "border-zinc-500/30", recordBg: "bg-zinc-700", primaryGlow: "rgba(148, 163, 184, 0.15)", bgClass: "bg-[#0b0c0d]", textMuted: "text-slate-400/70" }
];

export interface CuratorEdition1930s {
  id: string;
  label: string;
  glowIntensity: string;
  accent: string;
  accentBorder: string;
  recordBg: string;
  primaryGlow: string;
  goldGlow: string;
  vignette: string;
  backgroundColor: string;
  paperBgImage: string;
  paperBlendMode: string;
  outerPaperClass: string;
  lineContrast: string;
  ambientOverlay: string;
  headingClass: string;
  secondaryHeadingClass: string;
  goldGradient: string;
  shadowClass: string;
  textureOpacity: string;
  description: string;
}

const curatorEditions1930s: CuratorEdition1930s[] = [
  {
    id: "grand_ballroom",
    label: "Grand Ballroom Edition",
    glowIntensity: "gilded vintage parchment",
    accent: "text-[#cca97b]/95",
    accentBorder: "border-[#45392d]",
    recordBg: "bg-[#b0926a]",
    primaryGlow: "transparent",
    goldGlow: "transparent",
    vignette: "radial-gradient(circle at 50% 35%, rgba(69, 57, 45, 0.15) 0%, transparent 75%), radial-gradient(circle at 50% 50%, transparent 30%, rgba(12, 10, 8, 0.95) 100%)",
    backgroundColor: "#161310",
    paperBgImage: "radial-gradient(circle at 50% 32%, rgba(220, 185, 145, 0.08) 0%, transparent 72%), radial-gradient(circle at 50% 50%, transparent 50%, rgba(10, 8, 7, 0.92) 100%), url(\"data:image/svg+xml,%3Csvg viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paperNoise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.038' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.77 0 0 0 0 0.69 0 0 0 0 0.58 0 0 0 0.18 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%2523paperNoise)'/%3E%3C/svg%3E\")",
    paperBlendMode: "screen, normal, color-dodge",
    outerPaperClass: "border-[#221c17]",
    lineContrast: "border-[#cca97b]/28 bg-[#14110e]/5",
    ambientOverlay: "sepia-[0.20] brightness-[0.92] contrast-[0.98] saturate-[0.80] shadow-[inset_0_0_120px_rgba(15,11,8,0.55)]",
    headingClass: "font-deco tracking-[0.14em] text-[#faf6eb] font-semibold uppercase leading-tight",
    secondaryHeadingClass: "font-deco tracking-[0.08em] text-[#cca97b] font-medium uppercase",
    goldGradient: "linear-gradient(to bottom, #f2ead3 0%, #cca97b 50%, #90714c 100%)",
    shadowClass: "shadow-[2px_12px_45px_rgba(12,10,8,0.95)]",
    textureOpacity: "opacity-12",
    description: "Luminous, authentic cream-gold foil printing and rich woven fiber preserve a high-society ballroom program."
  },
  {
    id: "velvet_radio",
    label: "Velvet Radio Night",
    glowIntensity: "aged sepia cabinet",
    accent: "text-[#cca97b]/90",
    accentBorder: "border-[#33251a]",
    recordBg: "bg-[#7c4d37]",
    primaryGlow: "transparent",
    goldGlow: "transparent",
    vignette: "radial-gradient(circle at 50% 35%, rgba(60, 40, 25, 0.12) 0%, transparent 72%), radial-gradient(circle at 50% 50%, transparent 25%, rgba(10, 7, 5, 0.98) 100%)",
    backgroundColor: "#110b08",
    paperBgImage: "radial-gradient(circle at 50% 32%, rgba(120, 85, 55, 0.05) 0%, transparent 68%), radial-gradient(circle at 50% 50%, transparent 30%, rgba(8, 5, 3, 0.95) 100%), url(\"data:image/svg+xml,%3Csvg viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paperNoise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.045' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.65 0 0 0 0 0.55 0 0 0 0 0.45 0 0 0 0.22 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%2523paperNoise)'/%3E%3C/svg%3E\")",
    paperBlendMode: "screen, normal, color-dodge",
    outerPaperClass: "border-[#1c1109]",
    lineContrast: "border-[#cca97b]/20 bg-[#100a06]/5",
    ambientOverlay: "sepia-[0.25] brightness-[0.85] contrast-[0.95] saturate-[0.70] shadow-[inset_0_0_140px_rgba(10,6,4,0.7)]",
    headingClass: "font-deco tracking-[0.16em] text-[#edd5c3] font-medium uppercase leading-tight",
    secondaryHeadingClass: "font-deco tracking-[0.10em] text-[#dbbfab] font-medium uppercase",
    goldGradient: "linear-gradient(to bottom, #edd5c3 0%, #a07455 60%, #523724 100%)",
    shadowClass: "shadow-[2px_15px_50px_rgba(8,5,3,0.98)]",
    textureOpacity: "opacity-[0.16]",
    description: "Deep, matte walnut cabinet staining, gold metallic inks, and a heavy porous cardstock of early broadcasts."
  },
  {
    id: "jazz_lounge",
    label: "Jazz Lounge Archive",
    glowIntensity: "smoky ink lounge",
    accent: "text-[#9ca1c4]/90",
    accentBorder: "border-[#25243b]",
    recordBg: "bg-[#333059]",
    primaryGlow: "transparent",
    goldGlow: "transparent",
    vignette: "radial-gradient(circle at 50% 35%, rgba(60, 60, 90, 0.1) 0%, transparent 72%), radial-gradient(circle at 50% 50%, transparent 35%, rgba(6, 6, 10, 0.98) 100%)",
    backgroundColor: "#0c0a11",
    paperBgImage: "radial-gradient(circle at 50% 32%, rgba(130, 130, 180, 0.05) 0%, transparent 70%), radial-gradient(circle at 50% 50%, transparent 35%, rgba(5, 5, 8, 0.96) 100%), url(\"data:image/svg+xml,%3Csvg viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paperNoise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.55 0 0 0 0 0.58 0 0 0 0 0.72 0 0 0 0.18 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%2523paperNoise)'/%3E%3C/svg%3E\")",
    paperBlendMode: "screen, normal, color-dodge",
    outerPaperClass: "border-[#12111d]",
    lineContrast: "border-[#9ca1c4]/20 bg-[#07060b]/10",
    ambientOverlay: "sepia-[0.12] brightness-[0.88] contrast-[1.0] saturate-[0.78] shadow-[inset_0_0_130px_rgba(5,5,10,0.65)]",
    headingClass: "font-deco tracking-[0.15em] text-[#edf0fb] font-bold uppercase leading-tight",
    secondaryHeadingClass: "font-deco tracking-[0.08em] text-[#9ca1c4] font-medium uppercase",
    goldGradient: "linear-gradient(to bottom, #eddbe6 0%, #9ca1c4 50%, #464860 100%)",
    shadowClass: "shadow-[2px_15px_50px_rgba(5,5,8,0.98)]",
    textureOpacity: "opacity-15",
    description: "Desaturated, smoky layout framing, silver metallic engraving, and heavy blue-tinted catalog cover stock."
  },
  {
    id: "golden_theater",
    label: "Golden Theater Print",
    glowIntensity: "theatrical program stamp",
    accent: "text-[#dbb240]/95",
    accentBorder: "border-[#40331a]",
    recordBg: "bg-[#b08f25]",
    primaryGlow: "transparent",
    goldGlow: "transparent",
    vignette: "radial-gradient(circle at 50% 35%, rgba(90, 70, 30, 0.1) 0%, transparent 70%), radial-gradient(circle at 50% 50%, transparent 40%, rgba(10, 8, 4, 0.96) 100%)",
    backgroundColor: "#16120c",
    paperBgImage: "radial-gradient(circle at 50% 32%, rgba(200, 165, 80, 0.05) 0%, transparent 68%), radial-gradient(circle at 50% 50%, transparent 40%, rgba(8, 6, 3, 0.94) 100%), url(\"data:image/svg+xml,%3Csvg viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paperNoise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.034' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.85 0 0 0 0 0.72 0 0 0 0 0.45 0 0 0 0.12 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%2523paperNoise)'/%3E%3C/svg%3E\")",
    paperBlendMode: "screen, normal, color-dodge",
    outerPaperClass: "border-[#20190f]",
    lineContrast: "border-[#cca72a]/28 bg-[#100c07]/8",
    ambientOverlay: "sepia-[0.15] brightness-[0.94] contrast-[1.0] saturate-[0.8] shadow-[inset_0_0_120px_rgba(12,9,4,0.5)]",
    headingClass: "font-deco tracking-[0.16em] text-[#fffcf5] font-semibold uppercase leading-tight",
    secondaryHeadingClass: "font-deco tracking-[0.10em] text-[#dbb240] font-medium uppercase",
    goldGradient: "linear-gradient(to bottom, #fffadb 0%, #cca825 50%, #806509 100%)",
    shadowClass: "shadow-[2px_12px_45px_rgba(10,8,4,0.95)]",
    textureOpacity: "opacity-10",
    description: "Luxurious, hand-stamped theater programs, polished gold-brass engraving, and high-contrast charcoal print boundaries."
  },
  {
    id: "candlelight_broadcast",
    label: "Candlelight Broadcast",
    glowIntensity: "wax-pressed fiber",
    accent: "text-[#cca46e]/95",
    accentBorder: "border-[#332617]",
    recordBg: "bg-[#8c6d43]",
    primaryGlow: "transparent",
    goldGlow: "transparent",
    vignette: "radial-gradient(circle at 50% 35%, rgba(80, 55, 30, 0.1) 0%, transparent 72%), radial-gradient(circle at 50% 50%, transparent 30%, rgba(10, 7, 4, 0.98) 100%)",
    backgroundColor: "#110e0a",
    paperBgImage: "radial-gradient(circle at 50% 32%, rgba(180, 130, 80, 0.05) 0%, transparent 70%), radial-gradient(circle at 50% 50%, transparent 30%, rgba(8, 6, 3, 0.95) 100%), url(\"data:image/svg+xml,%3Csvg viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paperNoise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.80 0 0 0 0 0.65 0 0 0 0 0.45 0 0 0 0.22 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%2523paperNoise)'/%3E%3C/svg%3E\")",
    paperBlendMode: "screen, normal, color-dodge",
    outerPaperClass: "border-[#1a140f]",
    lineContrast: "border-[#cca46e]/22 bg-[#0d0a07]/12",
    ambientOverlay: "sepia-[0.22] brightness-[0.90] contrast-[0.95] saturate-[0.7] shadow-[inset_0_0_130px_rgba(8,6,3,0.65)]",
    headingClass: "font-deco tracking-[0.15em] text-[#faf6eb] font-semibold uppercase leading-tight",
    secondaryHeadingClass: "font-deco tracking-[0.08em] text-[#cca46e] font-medium uppercase",
    goldGradient: "linear-gradient(to bottom, #faf6eb 0%, #dbb076 55%, #8c6a39 100%)",
    shadowClass: "shadow-[2px_12px_45px_rgba(8,6,3,0.95)]",
    textureOpacity: "opacity-[0.18]",
    description: "Raw beeswax press marks, unbleached heavy cotton rag fibers, and deeply stamped dark walnut ink seals."
  },
  {
    id: "noir_collector",
    label: "Noir Collector Edition",
    glowIntensity: "silver shadow emulsion",
    accent: "text-[#c2cbd4]/95",
    accentBorder: "border-[#2e2f33]",
    recordBg: "bg-[#556375]",
    primaryGlow: "transparent",
    goldGlow: "transparent",
    vignette: "radial-gradient(circle at 50% 35%, rgba(80, 85, 95, 0.08) 0%, transparent 72%), radial-gradient(circle at 50% 50%, transparent 40%, rgba(5, 5, 6, 0.98) 100%)",
    backgroundColor: "#060608",
    paperBgImage: "radial-gradient(circle at 50% 32%, rgba(100, 110, 120, 0.05) 0%, transparent 65%), radial-gradient(circle at 50% 50%, transparent 40%, rgba(4, 4, 5, 0.95) 100%), url(\"data:image/svg+xml,%3Csvg viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paperNoise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.048' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0.18 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%2523paperNoise)'/%3E%3C/svg%3E\")",
    paperBlendMode: "screen, normal, color-dodge",
    outerPaperClass: "border-[#0e0e12]",
    lineContrast: "border-[#c2cbd4]/18 bg-[#030304]/15",
    ambientOverlay: "grayscale-[0.45] sepia-[0.05] brightness-[0.82] contrast-[1.08] saturate-[0.55] shadow-[inset_0_0_150px_rgba(4,4,5,0.85)]",
    headingClass: "font-deco tracking-[0.18em] text-[#fafbfc] font-semibold uppercase leading-tight",
    secondaryHeadingClass: "font-deco tracking-[0.11em] text-[#c2cbd4] font-medium uppercase",
    goldGradient: "linear-gradient(to bottom, #ffffff 0%, #94a3b8 50%, #334155 100%)",
    shadowClass: "shadow-[2px_15px_50px_rgba(2,2,3,0.98)]",
    textureOpacity: "opacity-15",
    description: "Desaturated physical silver gelatin darkroom print with sharp contrasts and severe lithographic carbon ink levels."
  }
];

export function getActiveThemeConfig(themeId: string, is1930s: boolean) {
  if (is1930s) {
    const custom = curatorEditions1930s.find(t => t.id === themeId);
    if (custom) return custom;
    // Map existing preset id from standard themes (like "gold", "violet") to beautiful 1930s equivalents
    if (themeId === "gold" || themeId === "carbon") {
      return curatorEditions1930s[0]; // Grand Ballroom
    }
    if (themeId === "violet") {
      return curatorEditions1930s[2]; // Jazz Lounge (indigo hues)
    }
    if (themeId === "teal") {
      return curatorEditions1930s[4]; // Candlelight Broadcast
    }
    return curatorEditions1930s[0];
  } else {
    // Normal themes
    const norm = themeOptions.find(t => t.id === themeId) || themeOptions[0];
    return {
      id: norm.id,
      label: norm.label,
      accent: norm.accent,
      accentBorder: norm.accentBorder,
      recordBg: norm.recordBg,
      primaryGlow: norm.primaryGlow,
      goldGlow: "rgba(210, 180, 140, 0.18)",
      vignette: `radial-gradient(circle at 50% 35%, ${norm.primaryGlow || "rgba(168, 85, 247, 0.15)"} 0%, transparent 68%), radial-gradient(circle at 50% 50%, transparent 35%, rgba(0,0,0,0.68) 100%)`,
      backgroundColor: "#060609",
      paperBgImage: `radial-gradient(circle at 50% 35%, ${norm.primaryGlow || "rgba(168, 85, 247, 0.15)"} 0%, transparent 68%), radial-gradient(circle at 50% 50%, transparent 35%, rgba(0,0,0,0.68) 100%)`,
      paperBlendMode: "normal",
      outerPaperClass: "bg-[#060609] border-[#131317] film-grain",
      lineContrast: "border-white/5 bg-transparent",
      ambientOverlay: "",
      headingClass: "",
      secondaryHeadingClass: "",
      goldGradient: "",
      shadowClass: "shadow-2xl",
      textureOpacity: "opacity-12",
      description: ""
    };
  }
}

// Formats a user personal dedication into an archival ownership inscription style for the 1930s
export function format1930sDedication(text: string): string {
  if (!text) return "";
  const cleanedText = text.trim();
  const lower = cleanedText.toLowerCase();
  
  // If user already wrote a phrase with from, private, curated, property, archive, collection, etc.
  if (
    lower.startsWith("from ") || 
    lower.startsWith("private ") || 
    lower.startsWith("curated ") || 
    lower.startsWith("property ") ||
    lower.includes("collection of") ||
    lower.includes("archive") ||
    lower.includes("registry") ||
    lower.includes("monograph") ||
    lower.includes("exhibition")
  ) {
    return cleanedText.toUpperCase();
  }
  
  // Otherwise wrap simple names with a luxurious design signature style
  return `FROM THE COLLECTION OF ${cleanedText.toUpperCase()}`;
}

// Generates a dynamic atmospheric color mesh gradient based on music genre
function getGenreTheme(genre: string = "") {
  const g = genre.toLowerCase();
  if (g.includes("rock") || g.includes("grunge") || g.includes("alternative")) {
    return {
      gradient: "from-amber-600/30 via-red-900/40 to-slate-950",
      accent: "text-red-400",
      badge: "bg-red-500/20 text-red-300 border-red-500/30",
      glowBg: "bg-red-500/20",
      recordLabel: "bg-red-600"
    };
  }
  if (g.includes("disco") || g.includes("pop") || g.includes("dance")) {
    return {
      gradient: "from-pink-600/30 via-purple-900/40 to-zinc-950",
      accent: "text-pink-400",
      badge: "bg-pink-500/20 text-pink-300 border-pink-500/30",
      glowBg: "bg-pink-500/20",
      recordLabel: "bg-pink-500"
    };
  }
  if (g.includes("soul") || g.includes("r&b") || g.includes("funk")) {
    return {
      gradient: "from-teal-600/20 via-emerald-950/40 to-zinc-950",
      accent: "text-teal-400",
      badge: "bg-teal-500/20 text-teal-300 border-teal-500/30",
      glowBg: "bg-teal-500/20",
      recordLabel: "bg-teal-600"
    };
  }
  if (g.includes("rap") || g.includes("hip") || g.includes("urban")) {
    return {
      gradient: "from-orange-600/20 via-amber-950/40 to-slate-950",
      accent: "text-amber-400",
      badge: "bg-amber-500/20 text-amber-300 border-amber-500/30",
      glowBg: "bg-amber-500/20",
      recordLabel: "bg-orange-600"
    };
  }
  return {
    gradient: "from-indigo-600/30 via-slate-900/40 to-zinc-950",
    accent: "text-indigo-400",
    badge: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    glowBg: "bg-indigo-500/25",
    recordLabel: "bg-indigo-600"
  };
}

// Curated historically-consistent stable public domain portraits and orchestra photography for the 1930s era
const VINTAGE_ARTIST_PORTRAITS: Record<string, { url: string; caption: string }> = {
  "fred astaire": {
    url: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Fred_Astaire_Top_Hat_1935.jpg",
    caption: "Fred Astaire — RKO Pictures publicity portrait for Top Hat (1935)"
  },
  "louis armstrong": {
    url: "https://upload.wikimedia.org/wikipedia/commons/e/ec/Louis_Armstrong_nywts_1953.jpg",
    caption: "Louis Armstrong — Legendary jazz trumpet master and vocalist"
  },
  "judy garland": {
    url: "https://upload.wikimedia.org/wikipedia/commons/f/fb/Judy_Garland_publicity_1939.jpg",
    caption: "Judy Garland — MGM Studios publicity portrait for Over the Rainbow (1939)"
  },
  "cab calloway": {
    url: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Cab_Calloway_Gottlieb.jpg",
    caption: "Cab Calloway — Iconic jazz showman performing live at the Cotton Club"
  },
  "ella fitzgerald": {
    url: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Ella_Fitzgerald_1940.jpg",
    caption: "Ella Fitzgerald — First Lady of Song, vintage swing-era stage portrait"
  },
  "bing crosby": {
    url: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Bing_Crosby_-_Gold_Diggers_of_1935_-_publicity.jpg",
    caption: "Bing Crosby — Paramount Pictures classic vocal crooner portrait (1935)"
  },
  "glenn miller": {
    url: "https://upload.wikimedia.org/wikipedia/commons/0/09/Glenn_Miller_publicity_shot.jpg",
    caption: "Glenn Miller — Acclaimed big band leader and legendary swing trombonist"
  },
  "paul whiteman": {
    url: "https://upload.wikimedia.org/wikipedia/commons/d/de/Paul_Whiteman_NYWTS.jpg",
    caption: "Paul Whiteman — Early orchestral swing champion and sweet jazz leader"
  },
  "jimmy dorsey": {
    url: "https://upload.wikimedia.org/wikipedia/commons/3/36/Jimmy_Dorsey_1944.jpg",
    caption: "Jimmy Dorsey — Big band swing woodwind virtuoso"
  },
  "leo reisman": {
    url: "https://upload.wikimedia.org/wikipedia/commons/c/ca/Jazz_band_at_the_Grand_Terrace_Cafe_1930s.jpg",
    caption: "Leo Reisman Orchestra — Live grand ballroom broadcast (circa 1930s)"
  },
  "edby duchin": { // Eddy Duchin fallback
    url: "https://upload.wikimedia.org/wikipedia/commons/5/52/Paul_Whiteman_Orchestra_Aolian_Hall_1924.jpg",
    caption: "Eddy Duchin Orchestra — Sweet jazz legends performing under grand chandeliers"
  },
  "eddy duchin": {
    url: "https://upload.wikimedia.org/wikipedia/commons/5/52/Paul_Whiteman_Orchestra_Aolian_Hall_1924.jpg",
    caption: "Eddy Duchin Orchestra — Sweet jazz legends performing under grand chandeliers"
  }
};

// Prepare Decade Mood configurations setting the foundation for future physical Era Mode overrides
interface DecadeMood {
  decade: string;
  name: string;
  glowIntensity: string;
  colorWarmth: string;
  typographyMood: string;
  nostalgiaTexture: string;
  cardAtmosphere: string;
  
  // Custom Dynamic Styling variables:
  headingClass: string;          // Main titles (e.g. font-serif/italic etc)
  accentClass: string;           // Custom text-accent color
  badgeClass: string;            // Style for genre, year, status badges
  btnClass: string;              // CTA buttons matching colors and borders
  tempGlowBg: string;            // Tailwind color class for ambient glows
  ambientOverlayClass: string;   // Image filter or layout adjustments
  eraLabel: string;              // Label e.g. "HISTORIC ARTIFACT RECORD"
  posterHeaderStamp: string;     // Custom left side poster header
  posterYearEdition: string;     // Custom right side poster edition
  timelineDotClass: string;      // Dot style
  vibeText: string;              // Short description representing the tone
}

function getDecadeMood(releaseYear?: number): DecadeMood {
  if (!releaseYear) {
    return {
      decade: "Universal",
      name: "Timeless Echoes",
      glowIntensity: "medium",
      colorWarmth: "balanced-glow",
      typographyMood: "font-sans",
      nostalgiaTexture: "clean vinyl spin",
      cardAtmosphere: "glass-panel border-white/10 hover:border-indigo-500/25 hover:shadow-[0_20px_50px_rgba(99,102,241,0.15)]",
      headingClass: "font-sans font-bold",
      accentClass: "text-indigo-400",
      badgeClass: "bg-[#141224] text-indigo-300 border-indigo-500/30",
      btnClass: "bg-indigo-600 hover:bg-indigo-500 text-white hover:shadow-[0_0_20px_rgba(79,70,229,0.4)]",
      tempGlowBg: "from-violet-500/10 via-transparent to-transparent",
      ambientOverlayClass: "",
      eraLabel: "CHRONOLOGY SOUNDS COLLECTION",
      posterHeaderStamp: "ARCHIVAL KEEPSAKE PRINT",
      posterYearEdition: "TIMELINE EDITION",
      timelineDotClass: "bg-indigo-500 ring-indigo-950/40",
      vibeText: "Discovering classic generational melodies and cultural timeline soundscapes."
    };
  }

  if (releaseYear < 1940) {
    return {
      decade: "1930s",
      name: "Golden Age of Radio & Jazz Refuge",
      glowIntensity: "low",
      colorWarmth: "subtle candlelight warmth",
      typographyMood: "font-serif tracking-[0.18em] text-[#fdecd5] font-light",
      nostalgiaTexture: "lacquer stamp fiber & warm radio hum",
      cardAtmosphere: "border-[#4d3f32]/90 bg-[#171411]/98 hover:border-[#7c634c] shadow-sepia-lg hover:shadow-[0_0_55px_rgba(197,168,128,0.12)] ring-1 ring-[#1b140f]",
      headingClass: "font-serif tracking-[0.14em] text-[#fbf5eb] font-medium leading-[1.15]",
      accentClass: "text-[#cca97b] font-serif tracking-[0.06em] italic font-medium",
      badgeClass: "bg-[#251e18] text-[#ecd8bf] border-[#4d3f32] font-serif uppercase tracking-[0.22em] text-[10px]",
      btnClass: "museum-btn-1930s inline-flex items-center justify-center font-serif italic text-sm tracking-widest",
      tempGlowBg: "from-[#5a4026]/22 via-[#0e0c09] to-[#08080a] opacity-80",
      ambientOverlayClass: "sepia-[0.18] brightness-[0.94] contrast-[0.95] saturate-[0.87] shadow-[inset_0_0_110px_rgba(18,12,8,0.45)] duration-1000",
      eraLabel: "EXHIBITION PLACARD • CULTURAL REFUGES OF THE 1930s",
      posterHeaderStamp: "MUSEUM ARCHIVAL FOLIO: ID-1930-B",
      posterYearEdition: "DECORATIVE ART DECO EXHIBITION CABINET",
      timelineDotClass: "bg-[#cca97b] ring-[#231b13]",
      vibeText: "When glowing vacuum-tube radios and intimate jazz lounges offered a velvet, candlelit sanctuary of song while the world searched for hope."
    };
  }

  if (releaseYear < 1950) {
    return {
      decade: "1940s",
      name: "Wartime Resilience & Swing",
      glowIntensity: "low-silver",
      colorWarmth: "silver-violet-glaze opacity-95",
      typographyMood: "font-serif tracking-tight leading-tight",
      nostalgiaTexture: "smoky lacquer & high-contrast silver shine",
      cardAtmosphere: "border-slate-800 bg-[#11131a]/85 hover:border-slate-600 hover:shadow-[0_0_40px_rgba(148,163,184,0.12)]",
      headingClass: "font-serif font-black tracking-tight uppercase text-slate-200",
      accentClass: "text-slate-400",
      badgeClass: "bg-slate-900 text-slate-300 border-slate-700",
      btnClass: "bg-[#1f242e] border border-slate-700 hover:bg-slate-800 text-slate-200 hover:shadow-[0_0_15px_rgba(148,163,184,0.12)]",
      tempGlowBg: "from-slate-500/20 via-[#0d0f14]/30 to-black/90",
      ambientOverlayClass: "grayscale-[0.25] brightness-[0.9] contrast-[0.95]",
      eraLabel: "HISTORIC WARTIME KEEPSAKE DOCUMENT",
      posterHeaderStamp: "HISTORIC WARTIME KEEPSAKE",
      posterYearEdition: "1940s SWING ERA EDITION",
      timelineDotClass: "bg-slate-500 ring-slate-950/40",
      vibeText: "Resilient swing bands and crackling wartime radio broadcasts."
    };
  }

  if (releaseYear < 1960) {
    return {
      decade: "1950s",
      name: "Vintage Jukebox & Diner Optimism",
      glowIntensity: "medium-polished",
      colorWarmth: "cream-magenta warmth",
      typographyMood: "font-sans tracking-wide leading-relaxed",
      nostalgiaTexture: "polished chrome reflections & vinyl dust scratches",
      cardAtmosphere: "border-rose-950/40 bg-[#161214]/85 hover:border-rose-800/40 hover:shadow-[0_0_45px_rgba(244,63,94,0.15)]",
      headingClass: "font-sans font-extrabold italic text-rose-100",
      accentClass: "text-rose-400",
      badgeClass: "bg-rose-950/40 text-rose-300 border-rose-900/30",
      btnClass: "bg-[#25161c] border border-rose-900/30 hover:bg-rose-900/70 text-rose-200 hover:shadow-[0_0_15px_rgba(244,63,94,0.18)]",
      tempGlowBg: "from-rose-500/20 via-[#180e12]/20 to-black/90",
      ambientOverlayClass: "brightness-[1.02] saturate-[1.02]",
      eraLabel: "CHROME VINTAGE JUKEBOX JUWEL",
      posterHeaderStamp: "VINTAGE JUKEBOX COLLECTIBLE",
      posterYearEdition: "1950s RETRO POP PRINT",
      timelineDotClass: "bg-rose-550 ring-rose-950/30",
      vibeText: "Cozy chrome diners, late drive-ins, and early television dreams."
    };
  }

  if (releaseYear < 1970) {
    return {
      decade: "1960s",
      name: "Midnight Soul & Cultural Revolution",
      glowIntensity: "spirited",
      colorWarmth: "vibrant-cyan-purple-glow",
      typographyMood: "font-sans tracking-wide leading-relaxed",
      nostalgiaTexture: "vivid psychedelic analog print & high contrast halftone",
      cardAtmosphere: "border-violet-950/50 bg-[#0e0d16]/85 hover:border-violet-700/40 hover:shadow-[0_0_45px_rgba(139,92,246,0.2)]",
      headingClass: "font-sans font-black tracking-tight text-violet-100",
      accentClass: "text-violet-400",
      badgeClass: "bg-[#141224] text-violet-300 border-violet-800/40",
      btnClass: "bg-violet-950/80 border border-violet-850/40 hover:bg-violet-900 text-violet-200 hover:shadow-[0_0_18px_rgba(139,92,246,0.22)]",
      tempGlowBg: "from-violet-600/25 via-[#0e0a1b]/20 to-black/90",
      ambientOverlayClass: "contrast-[1.02] brightness-[1.0]",
      eraLabel: "MID-CENTURY EDITORIAL COLLECTIBLE",
      posterHeaderStamp: "MID-CENTURY EDITORIAL COLLECTIBLE",
      posterYearEdition: "1960s REVOLUTION PRINT",
      timelineDotClass: "bg-violet-550 ring-violet-950/40",
      vibeText: "A cultural exploration of television booms and psychedelic British movements."
    };
  }

  if (releaseYear < 1980) {
    return {
      decade: "1970s",
      name: "Disco Groove & Earthy Vinyl",
      glowIntensity: "mellow-analog",
      colorWarmth: "amber-violet-haze",
      typographyMood: "font-serif tracking-wide leading-normal",
      nostalgiaTexture: "warm rotating record dust & woodgrain AM radio hum",
      cardAtmosphere: "border-amber-950/50 bg-[#14110d]/85 hover:border-amber-700/30 hover:shadow-[0_0_40px_rgba(245,158,11,0.15)]",
      headingClass: "font-serif font-extrabold tracking-wide text-amber-200",
      accentClass: "text-amber-400",
      badgeClass: "bg-amber-950/50 text-amber-300 border-amber-900/30",
      btnClass: "bg-amber-950/85 border border-amber-900/30 hover:bg-amber-900/70 text-amber-200 hover:shadow-[0_0_18px_rgba(245,158,11,0.22)]",
      tempGlowBg: "from-amber-600/18 via-[#1a110a]/20 to-black/95",
      ambientOverlayClass: "sepia-[0.15] contrast-[0.98] brightness-[0.94]",
      eraLabel: "RECORD-STORE VINTAGE KEEPSAKE ORIGINAL",
      posterHeaderStamp: "RECORD-STORE KEEPSAKE PRINT",
      posterYearEdition: "1970s EARTHED VINYL EDITION",
      timelineDotClass: "bg-amber-550 ring-amber-950/40",
      vibeText: "Warm FM radio, vintage denim, soul grooves, and analog vinyl crackles."
    };
  }

  if (releaseYear < 1990) {
    return {
      decade: "1980s",
      name: "Neon Synthwave & MTV Nightlife",
      glowIntensity: "dense-neon",
      colorWarmth: "cool-cyber-pink-and-violet-glare",
      typographyMood: "font-mono tracking-widest leading-normal uppercase",
      nostalgiaTexture: "magnetic scanlines, cassette tapes & synthesizer glow",
      cardAtmosphere: "border-pink-500/25 bg-[#150d18]/85 hover:border-pink-500/40 hover:shadow-[0_0_50px_rgba(236,72,153,0.22)]",
      headingClass: "font-mono font-black tracking-widest uppercase text-pink-100",
      accentClass: "text-pink-400",
      badgeClass: "bg-[#25102a] text-pink-300 border-pink-500/20",
      btnClass: "bg-gradient-to-r from-pink-750 to-purple-800 hover:from-pink-650 hover:to-purple-700 text-white font-mono border-pink-500/20 hover:shadow-[0_0_20px_rgba(236,72,153,0.3)]",
      tempGlowBg: "from-pink-600/28 via-[#14081c]/25 to-black/95",
      ambientOverlayClass: "contrast-[1.1] brightness-[1.0] saturate-[1.05] shadow-[inset_0_0_100px_rgba(236,72,153,0.06)]",
      eraLabel: "PREMIUM MTV SYNTH COLLECTIBLE ARTIFACT",
      posterHeaderStamp: "PREMIUM SYNTHWAVE TIMELINE RECORD",
      posterYearEdition: "1980s MTV ENERGY PRINT",
      timelineDotClass: "bg-pink-550 ring-pink-950/45",
      vibeText: "Flickering arcades, magnetic tape loops, and glowing neon synthesizer landscapes."
    };
  }

  if (releaseYear < 2000) {
    return {
      decade: "1990s",
      name: "Analog VHS & Alternative Grunge",
      glowIntensity: "atmospheric",
      colorWarmth: "analog-vhs-indigo-shadow",
      typographyMood: "font-sans font-bold leading-normal uppercase",
      nostalgiaTexture: "magnetic tape loops, CD skips & early web static",
      cardAtmosphere: "border-indigo-950/40 bg-[#0f111b]/85 hover:border-indigo-700/30 hover:shadow-[0_0_40px_rgba(99,102,241,0.2)]",
      headingClass: "font-sans font-black tracking-tight text-indigo-200",
      accentClass: "text-indigo-400",
      badgeClass: "bg-[#111326]/60 text-indigo-350 border-indigo-900/35",
      btnClass: "bg-indigo-950/85 border border-indigo-900/35 hover:bg-indigo-900 text-indigo-200 hover:shadow-[0_0_18px_rgba(99,102,241,0.2)]",
      tempGlowBg: "from-indigo-600/18 via-[#0b0c14]/20 to-black/95",
      ambientOverlayClass: "contrast-[1.0] brightness-[0.98]",
      eraLabel: "90s MAGAZINE-COVER COLLECTIBLE RECORD",
      posterHeaderStamp: "GRUNGE AUTHENTIC KEEPSAKE ORIGINAL",
      posterYearEdition: "1990s MAGAZINE EDITION",
      timelineDotClass: "bg-indigo-550 ring-indigo-950/50",
      vibeText: "Magnetic tape glitches, early dial-up hums, and emotional grunge chords."
    };
  }

  return {
    decade: "2000s+",
    name: "Digital Convergence & Luminous Pop",
    glowIntensity: "sleek-digital",
    colorWarmth: "crisp-clean-luminescence",
    typographyMood: "font-sans tracking-[0.05em] leading-relaxed",
    nostalgiaTexture: "bright pixel resonance & optical glass reflection",
    cardAtmosphere: "border-white/10 bg-[#0c1018]/85 hover:border-white/20 hover:shadow-[0_0_40px_rgba(255,255,255,0.08)]",
    headingClass: "font-sans font-extrabold tracking-tight text-white/95",
    accentClass: "text-slate-300",
    badgeClass: "bg-slate-900/60 text-slate-200 border-white/10",
    btnClass: "bg-[#181d28] border border-white/10 hover:bg-slate-800 text-slate-200 hover:shadow-[0_0_15px_rgba(255,255,255,0.08)]",
    tempGlowBg: "from-slate-400/12 via-[#060a12]/15 to-black/95",
    ambientOverlayClass: "contrast-[1.02] brightness-[1.02]",
    eraLabel: "DIGITAL-ERA PREMIUM ARCHIVED PIECE",
    posterHeaderStamp: "DIGITAL-ERA KEEPSAKE PLATINUM ART",
    posterYearEdition: "2000s LUMINOUS POP EDITION",
    timelineDotClass: "bg-slate-200 ring-slate-950/40",
    vibeText: "Sleek flip phones, glowing early MP3 controllers, and bright social forums."
  };
}

// Helper function to format the Billboard Chart Week in a nostalgic music time capsule presentation
const formatBillboardWeek = (chartDate: string | undefined): string => {
  if (!chartDate) return "";
  return `Billboard Week of ${chartDate}`;
};

// SEO-friendly routing key conversion helpers
function parseRouteDateToInput(dateSlug: string): string | null {
  const cleanStr = dateSlug.toLowerCase().replace(/[^a-z0-9-]/g, "");
  const parts = cleanStr.split("-");
  if (parts.length !== 3) return null;
  const monthStr = parts[0];
  const dayStr = parts[1];
  const yearStr = parts[2];

  const monthsMap: Record<string, number> = {
    january: 1, jan: 1,
    february: 2, feb: 2,
    march: 3, mar: 3,
    april: 4, apr: 4,
    may: 5,
    june: 6, jun: 6,
    july: 7, jul: 7,
    august: 8, aug: 8,
    september: 9, sep: 9,
    october: 10, oct: 10,
    november: 11, nov: 11,
    december: 12, dec: 12
  };

  const month = monthsMap[monthStr];
  const day = parseInt(dayStr, 10);
  const year = parseInt(yearStr, 10);

  if (!month || isNaN(day) || isNaN(year)) return null;
  if (year < 1920 || year > 2026) return null;

  const mStr = String(month).padStart(2, "0");
  const dStr = String(day).padStart(2, "0");
  const yStr = String(year);

  return `${yStr}-${mStr}-${dStr}`;
}

function formatDateToRoute(dateStr: string): string {
  const parts = dateStr.split("-");
  if (parts.length !== 3) return "";
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);

  const months = [
    "january", "february", "march", "april", "may", "june",
    "july", "august", "september", "october", "november", "december"
  ];

  if (month < 1 || month > 12) return "";
  return `${months[month - 1]}-${day}-${year}`;
}

function updatePageMetadata(
  title: string, 
  description: string, 
  canonicalUrl: string, 
  resultDetails?: { 
    songTitle: string; 
    artist: string; 
    userBirthdayFormatted: string; 
    birthDate: string; 
  }
) {
  document.title = title;

  let descMeta = document.querySelector('meta[name="description"]');
  if (descMeta) {
    descMeta.setAttribute("content", description);
  } else {
    descMeta = document.createElement("meta");
    descMeta.setAttribute("name", "description");
    descMeta.setAttribute("content", description);
    document.head.appendChild(descMeta);
  }

  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (canonicalLink) {
    canonicalLink.setAttribute("href", canonicalUrl);
  } else {
    canonicalLink = document.createElement("link");
    canonicalLink.setAttribute("rel", "canonical");
    canonicalLink.setAttribute("href", canonicalUrl);
    document.head.appendChild(canonicalLink);
  }

  // Safely clean up and remove any existing structured data script tags from previous page views
  const oldWebpage = document.getElementById("schema-webpage");
  if (oldWebpage) oldWebpage.remove();
  const oldMusic = document.getElementById("schema-musicrecording");
  if (oldMusic) oldMusic.remove();
  const oldPerson = document.getElementById("schema-person");
  if (oldPerson) oldPerson.remove();
  const oldBreadcrumbs = document.getElementById("schema-breadcrumbs");
  if (oldBreadcrumbs) oldBreadcrumbs.remove();
  const oldFaq = document.getElementById("schema-faq");
  if (oldFaq) oldFaq.remove();

  if (resultDetails) {
    try {
      const webPageSchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": title,
        "description": description,
        "url": canonicalUrl
      };

      const musicSchema = {
        "@context": "https://schema.org",
        "@type": "MusicRecording",
        "name": resultDetails.songTitle,
        "byArtist": {
          "@type": "MusicGroup",
          "name": resultDetails.artist
        }
      };

      const personSchema = {
        "@context": "https://schema.org",
        "@type": "Person",
        "birthDate": resultDetails.birthDate
      };

      const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": window.location.origin + "/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Birthday Song",
            "item": window.location.origin + "/"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": resultDetails.userBirthdayFormatted,
            "item": canonicalUrl
          }
        ]
      };

      const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How is the birthday song selected?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The birthday song is selected from Billboard #1 chart history for the chart week connected to your birth date."
            }
          },
          {
            "@type": "Question",
            "name": "Why does the Billboard week date sometimes differ from my exact birthday?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Billboard charts are organized by chart weeks, so the #1 song may be tied to the Billboard week that includes or represents your birthday, not always the exact calendar day."
            }
          },
          {
            "@type": "Question",
            "name": "Can two birthdays have the same #1 song?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. A song can stay at #1 for multiple weeks, so many birthdays may share the same soundtrack."
            }
          },
          {
            "@type": "Question",
            "name": "Is this the song from the day I was born or the chart week?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "This result is based on the Billboard chart week connected to your birthday."
            }
          }
        ]
      };

      const schemas = [
        { id: "schema-webpage", data: webPageSchema },
        { id: "schema-musicrecording", data: musicSchema },
        { id: "schema-person", data: personSchema },
        { id: "schema-breadcrumbs", data: breadcrumbSchema },
        { id: "schema-faq", data: faqSchema }
      ];

      schemas.forEach((s) => {
        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.id = s.id;
        script.innerHTML = JSON.stringify(s.data);
        document.head.appendChild(script);
      });
    } catch (e) {
      console.error("Error setting JSON-LD schemas client-side:", e);
    }
  }
}

export default function App() {
  // Input states
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [year, setYear] = useState("");
  
  // App state
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<NostalgiaResult | null>(null);
  const [history, setHistory] = useState<SavedSearch[]>([]);
  const [copied, setCopied] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Poster Customization States
  const [posterTitle, setPosterTitle] = useState("The Song That Welcomed My Story");
  const [posterCity, setPosterCity] = useState("");
  const [posterSpotlight, setPosterSpotlight] = useState("culture");
  const [posterTheme, setPosterTheme] = useState("violet");
  const [posterDedication, setPosterDedication] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [albumArtUrl, setAlbumArtUrl] = useState<string | null>(null);
  const [isLoadingAlbumArt, setIsLoadingAlbumArt] = useState(false);
  const [isVintagePortrait, setIsVintagePortrait] = useState(false);
  const [vintagePortraitCaption, setVintagePortraitCaption] = useState("");
  const [hasAlbumArtError, setHasAlbumArtError] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState<"png" | "pdf">("png");

  const resultSectionRef = useRef<HTMLDivElement>(null);

  // Fallback spotlight if "star" is selected but no valid matching celebrity exists
  useEffect(() => {
    if (posterSpotlight === "star" && !hasValidCelebrityMatch(result)) {
      setPosterSpotlight("culture");
    }
  }, [result, posterSpotlight]);

  // Auto Reset Poster Variables on new core results
  useEffect(() => {
    if (result) {
      setPosterCity("");
      setPosterSpotlight("culture");
      setPosterTheme(result.releaseYear < 1940 ? "gold" : "violet");
      setPosterDedication("");
      setExportError(null);

      // Fetch dynamic high-res album cover from iTunes Search API with historical consistency checks
      const fetchAlbumCover = async () => {
        setIsLoadingAlbumArt(true);
        setAlbumArtUrl(null);
        setIsVintagePortrait(false);
        setVintagePortraitCaption("");
        setHasAlbumArtError(false);
        try {
          // Keep the search term clean and precise
          const cleanedSong = result.songTitle.replace(/\s*\(.*?\)\s*/g, " ").trim();
          const q = `${cleanedSong} ${result.artist}`;
          const searchUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(q)}&entity=song&limit=6`;
          
          let foundAlbumCover = false;
          const res = await fetch(searchUrl);
          if (res.ok) {
            const data = await res.json();
            if (data.results && data.results.length > 0) {
              
              // Helper to normalize strings for comparison
              const normalize = (s: string) => {
                return (s || "")
                  .toLowerCase()
                  .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
                  .replace(/\s+/g, " ")
                  .trim();
              };

              const normTargetTitle = normalize(result.songTitle);
              const normTargetArtist = normalize(result.artist);

              // Find a track that validates properly
              const validTrack = data.results.find((t: any) => {
                const normCandTitle = normalize(t.trackName);
                const normCandArtist = normalize(t.artistName);

                // 1. Verify Song Title Match
                const targetWords = normTargetTitle.split(" ").filter(w => w.length > 2 && w !== "gets" && w !== "your" && w !== "with");
                const titleWordsMatch = targetWords.length > 0 
                  ? targetWords.every(w => normCandTitle.includes(w))
                  : normCandTitle.includes(normTargetTitle) || normTargetTitle.includes(normCandTitle);

                const hasTitleMatch = normCandTitle.includes(normTargetTitle) || 
                                      normTargetTitle.includes(normCandTitle) || 
                                      titleWordsMatch;

                if (!hasTitleMatch) return false;

                // 2. Verify Artist Match (avoid mismatched artists across eras)
                const stopWords = new Set([
                  "and", "or", "the", "his", "her", "their", "orchestra", "band", "singers", 
                  "with", "by", "of", "vocalists", "chorus", "ensemble", "group", "association", 
                  "society", "trio", "quartet", "quintet", "music", "soundtrack", "cast", "recording"
                ]);

                const targetArtistWords = normTargetArtist.split(" ").filter(w => !stopWords.has(w) && w.length > 1);
                const candArtistWords = normCandArtist.split(" ").filter(w => !stopWords.has(w) && w.length > 1);

                const sharesDistinctWord = targetArtistWords.some(w => normCandArtist.includes(w)) ||
                                           candArtistWords.some(w => normTargetArtist.includes(w));

                const isSubstring = normCandArtist.includes(normTargetArtist) || normTargetArtist.includes(normCandArtist);

                if (!sharesDistinctWord && !isSubstring) return false;

                // 3. Verify Genre & Decade compatibility (exclude modern genres for vintage records)
                if (result.releaseYear < 1940 && (t.primaryGenreName?.toLowerCase().includes("hip hop") || t.primaryGenreName?.toLowerCase().includes("metal") || t.primaryGenreName?.toLowerCase().includes("electronic"))) {
                  return false;
                }

                return true;
              });

              if (validTrack) {
                let artworkUrl = validTrack.artworkUrl100 || validTrack.artworkUrl600;
                if (artworkUrl) {
                  // Convert artwork from lower res to professional print high-res (600x600 or 1000x1000)
                  artworkUrl = artworkUrl.replace("100x100bb.jpg", "600x600bb.jpg")
                                         .replace("100x100", "600x600")
                                         .replace("600x600bb.jpg", "1000x1000bb.jpg"); // Try extreme resolution
                  setAlbumArtUrl(artworkUrl);
                  setIsVintagePortrait(false);
                  foundAlbumCover = true;
                  console.log(`[VALIDATION SUCCESS] iTunes artwork matches expected metadata: "${validTrack.trackName}" by "${validTrack.artistName}"`);
                }
              }
            }
          }

          // If no authentic cover art was found or validated, and it's 1930s (vintage), fall back to curated portraits/photography!
          if (!foundAlbumCover && result.releaseYear < 1940) {
            console.log(`[VALIDATION FAILED] No validated iTunes artwork for 1930s song. Activating priority historical portrait lookup...`);
            const targetArtist = result.artist.toLowerCase();
            const matchedKey = Object.keys(VINTAGE_ARTIST_PORTRAITS).find(key => 
              targetArtist.includes(key) || key.includes(targetArtist)
            );

            if (matchedKey) {
              const portrait = VINTAGE_ARTIST_PORTRAITS[matchedKey];
              setAlbumArtUrl(portrait.url);
              setIsVintagePortrait(true);
              setVintagePortraitCaption(portrait.caption);
              console.log(`[PORTRAIT ACTIVE] Mapped "${result.artist}" to historical photo: ${portrait.caption}`);
            } else {
              // Otherwise, check if they are a group / orchestra, map to classic general swing big band / orchestra photography (Priority 3)
              const containsOrchestra = targetArtist.includes("orchestra") || targetArtist.includes("band") || targetArtist.includes("direction");
              if (containsOrchestra) {
                setAlbumArtUrl("https://upload.wikimedia.org/wikipedia/commons/c/ca/Jazz_band_at_the_Grand_Terrace_Cafe_1930s.jpg");
                setIsVintagePortrait(true);
                setVintagePortraitCaption("The Grand Jazz Orchestras — Classic big band stage broadcast (circa 1930s)");
              } else {
                // Keep as null to cleanly trigger the gorgeous fictional archival sleeve rendering (Priority 4)
                setAlbumArtUrl(null);
                setIsVintagePortrait(false);
                setVintagePortraitCaption("");
              }
            }
          }
        } catch (e) {
          console.error("Failed to query iTunes search artwork:", e);
        } finally {
          setIsLoadingAlbumArt(false);
        }
      };

      fetchAlbumCover();
    }
  }, [result]);

  const exportPoster = async (format: "png" | "pdf") => {
    const posterNode = document.getElementById("high-res-keepsake-poster");
    if (!posterNode) {
      setExportError("Could not find print-render engine nodes.");
      return;
    }
    
    setIsExporting(true);
    setExportError(null);
    
    try {
      // Small visual pause to let state changes and vectors load smoothly before capture
      await new Promise((resolve) => setTimeout(resolve, 600));
      
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(posterNode, {
        scale: 2.2, // Keeps print resolution beautifully sharp (approx 1760x2464) while fast
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#08080a",
        scrollX: 0,
        scrollY: 0,
        windowWidth: 800,
        windowHeight: 1120
      });
      
      const imgData = canvas.toDataURL("image/png");
      const cleanTitle = (result?.songTitle || "soundtrack").replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
      
      if (format === "png") {
        const baseLink = document.createElement("a");
        baseLink.download = `${cleanTitle}_birth_keepsake_poster.png`;
        baseLink.href = imgData;
        baseLink.click();
      } else {
        const { jsPDF } = await import("jspdf");
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "px",
          format: [800, 1120]
        });
        pdf.addImage(imgData, "PNG", 0, 0, 800, 1120);
        pdf.save(`${cleanTitle}_birth_keepsake_poster.pdf`);
      }
    } catch (e: any) {
      console.error("Keepsake print compile failed:", e);
      setExportError(`Failed to render high-resolution ${format.toUpperCase()} print image. Please try again.`);
    } finally {
      setIsExporting(false);
    }
  };

  // Loading messages sequence
  const loadingSteps = [
    "Spinning up the historical reel-to-reel deck...",
    "Tuning into American airwaves & billboard frequencies...",
    "Retrieving the box office registers & cultural charts...",
    "Polishing the custom groove for my arrival snapshot..."
  ];

  // Side-effect to rotate loading lines
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingSteps.length);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  // Load Search History on mount & check initial SEO routes
  useEffect(() => {
    const saved = localStorage.getItem("birthday_reveal_history");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history archive", e);
      }
    }

    const checkInitialRoute = async () => {
      const path = window.location.pathname;
      const match = path.match(/^\/birthday-song\/([a-z0-9-]+)$/i);
      
      if (match) {
        const dateSlug = match[1];
        const parsedBirthDate = parseRouteDateToInput(dateSlug);
        
        if (parsedBirthDate) {
          const [y, m, d] = parsedBirthDate.split("-");
          setYear(y);
          setMonth(parseInt(m, 10).toString());
          setDay(parseInt(d, 10).toString());
          
          // Try to retrieve initial server-rendered data first
          const initialData = (window as any).__INITIAL_DATA__;
          if (initialData && initialData.userBirthMonth === parseInt(m, 10) && initialData.userBirthDay === parseInt(d, 10)) {
            setResult(initialData);
            (window as any).__INITIAL_DATA__ = null; // Clear so subsequent runs don't conflict
            
            const title = `The #1 Hit When I Arrived – ${initialData.userBirthdayFormatted}`;
            const desc = `Discover the #1 Billboard song during the week of ${initialData.userBirthdayFormatted} and explore the soundtrack of my arrival.`;
            const canonical = `${window.location.origin}/birthday-song/${dateSlug}`;
            updatePageMetadata(title, desc, canonical, {
              songTitle: initialData.songTitle,
              artist: initialData.artist,
              userBirthdayFormatted: initialData.userBirthdayFormatted,
              birthDate: parsedBirthDate
            });

            setTimeout(() => {
              resultSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 500);
          } else {
            // Need to client-fetch
            await fetchDateReveal(parsedBirthDate);
          }
        }
      }
    };

    checkInitialRoute();
  }, []);

  // Popstate event handler for browser back/forward buttons
  useEffect(() => {
    const handlePopState = async () => {
      const path = window.location.pathname;
      const match = path.match(/^\/birthday-song\/([a-z0-9-]+)$/i);
      
      if (match) {
        const dateSlug = match[1];
        const parsedBirthDate = parseRouteDateToInput(dateSlug);
        
        if (parsedBirthDate) {
          const [y, m, d] = parsedBirthDate.split("-");
          setYear(y);
          setMonth(parseInt(m, 10).toString());
          setDay(parseInt(d, 10).toString());
          
          const found = history.find((h) => h.birthDate === parsedBirthDate);
          if (found) {
            setResult(found.data);
            const title = `The #1 Hit When I Arrived – ${found.data.userBirthdayFormatted}`;
            const desc = `Discover the #1 Billboard song during the week of ${found.data.userBirthdayFormatted} and explore the soundtrack of my arrival.`;
            const canonical = `${window.location.origin}/birthday-song/${dateSlug}`;
            updatePageMetadata(title, desc, canonical, {
              songTitle: found.data.songTitle,
              artist: found.data.artist,
              userBirthdayFormatted: found.data.userBirthdayFormatted,
              birthDate: parsedBirthDate
            });
          } else {
            await fetchDateReveal(parsedBirthDate);
          }
        }
      } else if (path === "/" || path === "") {
        setResult(null);
        setYear("");
        setMonth("");
        setDay("");
        updatePageMetadata(
          "Birthday Song Reveal • Your Soundtrack",
          "Discover the song America couldn’t stop listening to the week I arrived.",
          window.location.origin
        );
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [history]);

  // Clear error when inputs change
  useEffect(() => {
    setError(null);
  }, [month, day, year]);

  // Sync to local storage - functional variant to protect stale closures
  const saveToHistory = (newResult: NostalgiaResult, formattedDate: string) => {
    const searchId = btoa(formattedDate);
    setHistory((prevHistory) => {
      const existingIndex = prevHistory.findIndex((item) => item.id === searchId);
      let updatedHistory = [...prevHistory];
      if (existingIndex !== -1) {
        updatedHistory.splice(existingIndex, 1);
      }
      const newSearch: SavedSearch = {
        id: searchId,
        birthDate: formattedDate,
        data: newResult,
        timestamp: Date.now()
      };
      const finalHistory = [newSearch, ...updatedHistory].slice(0, 8);
      localStorage.setItem("birthday_reveal_history", JSON.stringify(finalHistory));
      return finalHistory;
    });
  };

  const deleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      localStorage.setItem("birthday_reveal_history", JSON.stringify(updated));
      return updated;
    });
  };

  // Reusable search logic
  const fetchDateReveal = async (formattedDate: string) => {
    setLoading(true);
    setLoadingStep(0);
    setIsAudioPlaying(false);
    setError(null);
    try {
      const response = await fetch("/api/reveal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ birthDate: formattedDate })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to retrieve my birthday song. Please check your connection and try again.");
      }

      const data: NostalgiaResult = await response.json();
      setResult(data);
      saveToHistory(data, formattedDate);

      const slug = formatDateToRoute(formattedDate);
      if (slug) {
        const title = `The #1 Hit When I Arrived – ${data.userBirthdayFormatted}`;
        const desc = `Discover the #1 Billboard song during the week of ${data.userBirthdayFormatted} and explore the soundtrack of my arrival.`;
        const canonical = `${window.location.origin}/birthday-song/${slug}`;
        updatePageMetadata(title, desc, canonical, {
          songTitle: data.songTitle,
          artist: data.artist,
          userBirthdayFormatted: data.userBirthdayFormatted,
          birthDate: formattedDate
        });
      }

      setTimeout(() => {
        resultSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Pre-validate date
  const handleReveal = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!month || !day || !year) {
      setError("Please key in my month, day, and year of birth.");
      return;
    }

    const numericYear = parseInt(year);
    const numericMonth = parseInt(month);
    const numericDay = parseInt(day);

    if (isNaN(numericYear) || numericYear < 1920 || numericYear > 2026) {
      setError("The entered year is outside the available database range of 1920 to 2026.");
      return;
    }

    const testDate = new Date(numericYear, numericMonth - 1, numericDay);
    if (testDate.getFullYear() !== numericYear || testDate.getMonth() !== numericMonth - 1 || testDate.getDate() !== numericDay) {
      setError("Please enter a valid birth date.");
      return;
    }

    const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    setLoading(true);
    setLoadingStep(0);
    setIsAudioPlaying(false);

    try {
      const response = await fetch("/api/reveal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ birthDate: formattedDate })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to retrieve my birthday song. Please check your connection and try again.");
      }

      const data: NostalgiaResult = await response.json();
      setResult(data);
      saveToHistory(data, formattedDate);

      const slug = formatDateToRoute(formattedDate);
      if (slug) {
        window.history.pushState(null, "", `/birthday-song/${slug}`);
        const title = `The #1 Hit When I Arrived – ${data.userBirthdayFormatted}`;
        const desc = `Discover the #1 Billboard song during the week of ${data.userBirthdayFormatted} and explore the soundtrack of my arrival.`;
        const canonical = `${window.location.origin}/birthday-song/${slug}`;
        updatePageMetadata(title, desc, canonical, {
          songTitle: data.songTitle,
          artist: data.artist,
          userBirthdayFormatted: data.userBirthdayFormatted,
          birthDate: formattedDate
        });
      }

      setTimeout(() => {
        resultSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectHistory = (search: SavedSearch) => {
    setResult(search.data);
    setIsAudioPlaying(false);
    
    // Parse the date back into input locks
    const [y, m, d] = search.birthDate.split("-");
    setYear(y || "");
    setMonth(m ? parseInt(m).toString() : "");
    setDay(d ? parseInt(d).toString() : "");

    const slug = formatDateToRoute(search.birthDate);
    if (slug) {
      window.history.pushState(null, "", `/birthday-song/${slug}`);
      const title = `The #1 Hit When I Arrived – ${search.data.userBirthdayFormatted}`;
      const desc = `Discover the #1 Billboard song during the week of ${search.data.userBirthdayFormatted} and explore the soundtrack of my arrival.`;
      const canonical = `${window.location.origin}/birthday-song/${slug}`;
      updatePageMetadata(title, desc, canonical, {
        songTitle: search.data.songTitle,
        artist: search.data.artist,
        userBirthdayFormatted: search.data.userBirthdayFormatted,
        birthDate: search.birthDate
      });
    }

    setTimeout(() => {
      resultSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 200);
  };

  // Copy share context
  const handleCopyToClipboard = async () => {
    if (!result) return;
    const shareText = `🎵 My Birthday Soundtrack: "${result.songTitle}" by ${result.artist} (#1 on my birth day in ${result.releaseYear})!\n\n🎬 Box Office: ${result.movieTitle}\n📺 TV Hit: ${result.tvShowTitle}\n\nCheck yours at ${window.location.origin}`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: "My Birthday Soundtrack Reveal",
          text: shareText,
          url: window.location.origin
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (e) {
      // Fallback copy if web share is aborted or denied
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Sample static data for right side before reveal
  const sampleData = {
    date: "October 25, 1995",
    songTitle: "Fantasy",
    artist: "Mariah Carey",
    sentence: "The radio was playing this when my story began.",
    genre: "Pop / R&B",
    year: "1995"
  };

  const activeTheme = result ? getGenreTheme(result.genre) : getGenreTheme("pop");
  const activeDecadeMood = getDecadeMood(result ? result.releaseYear : undefined);
  const is1930s = result ? (result.releaseYear < 1940) : false;
  const activeThemeConfig = getActiveThemeConfig(posterTheme, is1930s);

  const hasValidCelebrityMatch = (resVal: NostalgiaResult | null): boolean => {
    if (!resVal) return false;
    
    let userM = resVal.userBirthMonth;
    let userD = resVal.userBirthDay;
    
    // Backup parser if they are undefined (e.g. from older saved history or empty inputs)
    if (!userM || !userD) {
      const monthsList = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      const match = resVal.userBirthdayFormatted?.match(/([A-Za-z]+)\s+(\d+)/);
      if (match) {
        const mIdx = monthsList.indexOf(match[1]);
        if (mIdx !== -1) {
          userM = mIdx + 1;
        }
        userD = parseInt(match[2]);
      }
    }
    
    const celebM = resVal.celebrityBirthMonth;
    const celebD = resVal.celebrityBirthDay;
    
    return !!(
      userM && 
      userD && 
      celebM && 
      celebD && 
      userM === celebM && 
      userD === celebD && 
      resVal.celebrityName && 
      resVal.celebrityName !== "No iconic birthday match discovered" && 
      resVal.celebrityName.trim() !== ""
    );
  };

  const getCelebrityInfo = (resVal: NostalgiaResult | null) => {
    if (!resVal) return { name: "", description: "" };
    
    const isValid = hasValidCelebrityMatch(resVal);
    
    if (isValid) {
      return {
        name: resVal.celebrityName,
        description: resVal.celebrityDescription
      };
    } else {
      return {
        name: "No iconic birthday match discovered",
        description: "A distinctive day in history, waiting for my unique story to unfold."
      };
    }
  };

  return (
    <div className={`min-h-screen relative text-slate-200 overflow-x-hidden font-sans transition-all duration-1000 ${
      result && activeDecadeMood.decade === "1930s"
        ? "bg-[#0f0c0a] film-grain-1930s"
        : "bg-[#08080a] film-grain"
    } ${result ? activeDecadeMood.ambientOverlayClass : ""}`}>
      
      {/* 1930s Dramatic Screen Margins Vignette for Cinematic Ballroom Depth */}
      {result && activeDecadeMood.decade === "1930s" && (
        <div className="fixed inset-0 pointer-events-none z-50 mix-blend-multiply opacity-60 shadow-[inset_0_0_120px_rgba(20,15,11,0.85)]" />
      )}
      
      {/* Immersive UI Glow Background & Fine Dust overlay */}
      <div className={`absolute inset-0 transition-opacity duration-1000 pointer-events-none ${
        result && activeDecadeMood.decade === "1930s" ? "glow-bg-1930s opacity-95" : "glow-bg opacity-80"
      }`} />
      
      {/* Decorative Atmosphere Elements */}
      <div className={`absolute top-0 left-0 w-full h-[500px] bg-radial ${result ? activeDecadeMood.tempGlowBg : "from-violet-500/10"} via-transparent to-transparent pointer-events-none transition-all duration-1000`} />
      <div className={`absolute top-1/3 right-1/4 w-80 h-80 rounded-full blur-[120px] pointer-events-none animate-pulse-slow transition-all duration-1000 ${
        result && activeDecadeMood.decade === "1930s" ? "bg-amber-800/5" : "bg-pink-500/5"
      }`} />
      <div className={`absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full blur-[140px] pointer-events-none transition-all duration-1000 ${
        result && activeDecadeMood.decade === "1930s" ? "bg-amber-900/5" : "bg-indigo-500/5"
      }`} />

      {/* Subtle floating music symbols */}
      <div className={`absolute top-20 left-10 text-4xl select-none pointer-events-none font-serif animate-float transition-all duration-1000 ${
        result && activeDecadeMood.decade === "1930s" ? "text-amber-300/5" : "text-indigo-300/10"
      }`}>♩</div>
      <div className={`absolute top-48 right-12 text-3xl select-none pointer-events-none font-serif animate-float transition-all duration-1000 ${
        result && activeDecadeMood.decade === "1930s" ? "text-amber-300/5" : "text-indigo-300/10"
      }`} style={{ animationDelay: "1.5s" }}>♪</div>
      <div className={`absolute bottom-56 left-1/2 text-5xl select-none pointer-events-none font-serif animate-float transition-all duration-1000 ${
        result && activeDecadeMood.decade === "1930s" ? "text-amber-300/5" : "text-indigo-300/10"
      }`} style={{ animationDelay: "3s" }}>♬</div>
      <div className={`absolute bottom-12 right-10 text-4xl select-none pointer-events-none font-serif animate-float transition-all duration-1000 ${
        result && activeDecadeMood.decade === "1930s" ? "text-amber-300/5" : "text-indigo-300/10"
      }`} style={{ animationDelay: "0.5s" }}>♭</div>

      {/* Container */}
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-10 relative z-10 flex flex-col min-h-screen justify-between">
        
        {/* Header/Nav row */}
        <header className="flex justify-between items-center mb-8 md:mb-10 border-b border-white/5 pb-5">
          <div className="flex items-center space-x-3">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-700 ${
              result && activeDecadeMood.decade === "1930s"
                ? "bg-[#1d1611]/95 border border-[#a88a64]/40"
                : "bg-linear-to-r from-pink-500 to-indigo-600"
            }`}>
              <span className={`font-serif font-bold text-lg transition-colors duration-700 ${
                result && activeDecadeMood.decade === "1930s" ? "text-[#c5a880]" : "text-white"
              }`}>B</span>
            </div>
            <div>
              <span className={`block transition-all duration-700 ${
                result && activeDecadeMood.decade === "1930s"
                  ? "font-serif tracking-[0.16em] italic text-[#f2ebd9] text-sm"
                  : "font-sans font-bold text-sm tracking-widest text-[#ece7ff] uppercase"
              }`}>RetroWave</span>
              <p className={`text-[10px] font-mono tracking-wider transition-colors duration-700 ${
                result && activeDecadeMood.decade === "1930s" ? "text-[#a88a64]" : "text-gray-400"
              }`}>
                {result && activeDecadeMood.decade === "1930s" ? "CHRONICLES OF RADIO & JAZZ" : "CHRONICLES OF MUSIC"}
              </p>
            </div>
          </div>
          <div className={`hidden sm:flex items-center space-x-1 border px-3 py-1 rounded-full text-xs font-mono transition-all duration-700 ${
            result && activeDecadeMood.decade === "1930s"
              ? "bg-[#17130f]/65 border-[#3d3126] text-[#c5a880]/80"
              : "bg-white/5 border border-white/5 text-gray-400"
          }`}>
            <span className={`inline-block w-2 h-2 rounded-full mr-1 ${
              result && activeDecadeMood.decade === "1930s" ? "bg-amber-500 animate-pulse-slow" : "bg-indigo-500 animate-pulse"
            }`}></span>
            <span>{result && activeDecadeMood.decade === "1930s" ? "1930s Archive Reel Active" : "Billboard Retro Sync Active"}</span>
          </div>
        </header>

        {/* 50/50 Desktop Split Section */}
        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-10 md:mb-12">
          
          {/* LEFT SIDE: Heading & Inputs */}
          <div className="flex flex-col space-y-8 pr-0 lg:pr-6" id="welcome_column">
            <div className="space-y-4">
              <span className="inline-flex items-center space-x-2 bg-gradient-to-r from-pink-500/20 to-indigo-600/20 text-indigo-300 font-mono text-xs px-3.5 py-1.5 rounded-full border border-indigo-500/20">
                <Sparkles size={13} className="animate-pulse" />
                <span>Nostalgia Finder</span>
              </span>
              <h2 className="text-4xl md:text-6xl font-sans font-bold text-white tracking-tight leading-tight">
                What Was the <span className="text-indigo-400">Soundtrack</span> of My Birth?
              </h2>
              <p className="text-base md:text-lg text-slate-300 font-sans tracking-wide leading-relaxed">
                Discover the song America couldn’t stop listening to the week I arrived.
              </p>
            </div>

            {/* Inputs Box */}
            <form 
              onSubmit={handleReveal} 
              className={`rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden transition-all duration-700 ${
                result && activeDecadeMood.decade === "1930s"
                  ? `${activeDecadeMood.cardAtmosphere} border-amber-950/40`
                  : "glass-panel border-white/10"
              }`} 
              id="reveal_form"
            >
              
              <div className="space-y-3">
                <label className={`text-xs uppercase tracking-[0.2em] font-semibold block transition-colors duration-300 ${
                  result && activeDecadeMood.decade === "1930s" ? activeDecadeMood.accentClass : "text-indigo-300"
                }`}>
                  My Arrival Date
                </label>
                
                {/* Visual custom inputs */}
                <div className="grid grid-cols-3 gap-3">
                  {/* Month */}
                  <div className="relative">
                    <select
                      value={month}
                      onChange={(e) => {
                        setMonth(e.target.value);
                        setResult(null);
                      }}
                      className={`w-full h-14 rounded-xl text-center text-sm font-sans focus:outline-hidden appearance-none cursor-pointer transition-all duration-353 text-ellipsis overflow-hidden whitespace-nowrap px-2 ${
                        result && activeDecadeMood.decade === "1930s"
                          ? "bg-[#120f0d]/95 border border-[#3d3126] text-amber-100/90 focus:border-[#c5a880]/50 hover:bg-[#191410]"
                          : "bg-white/5 border border-white/10 text-gray-100 focus:border-indigo-500 hover:bg-white/10"
                      }`}
                      id="input_month"
                    >
                      <option value="" disabled className="bg-slate-950">Month</option>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => {
                        const dateObj = new Date(2000, m - 1);
                        const label = dateObj.toLocaleString("en", { month: "short" });
                        return <option key={m} value={m} className="bg-slate-950">{label}</option>;
                      })}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs">▼</div>
                  </div>

                  {/* Day */}
                  <div className="relative">
                    <select
                      value={day}
                      onChange={(e) => {
                        setDay(e.target.value);
                        setResult(null);
                      }}
                      className={`w-full h-14 rounded-xl text-center text-sm font-sans focus:outline-hidden appearance-none cursor-pointer transition-all duration-353 px-2 ${
                        result && activeDecadeMood.decade === "1930s"
                          ? "bg-[#120f0d]/95 border border-[#3d3126] text-amber-100/90 focus:border-[#c5a880]/50 hover:bg-[#191410]"
                          : "bg-white/5 border border-white/10 text-gray-100 focus:border-indigo-500 hover:bg-white/10"
                      }`}
                      id="input_day"
                    >
                      <option value="" disabled className="bg-slate-950">Day</option>
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                        <option key={d} value={d} className="bg-slate-950">{d}</option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs">▼</div>
                  </div>

                  {/* Year */}
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="Year"
                      value={year}
                      onChange={(e) => {
                        setYear(e.target.value);
                        setResult(null);
                      }}
                      min="1920"
                      max="2026"
                      className={`w-full h-14 rounded-xl text-center text-sm font-sans focus:outline-hidden transition-all duration-353 px-2 ${
                        result && activeDecadeMood.decade === "1930s"
                          ? "bg-[#120f0d]/95 border border-[#3d3126] text-amber-100/90 focus:border-[#c5a880]/50 hover:bg-[#191410]"
                          : "bg-white/5 border border-white/10 text-gray-100 focus:border-indigo-500 hover:bg-white/10"
                      }`}
                      id="input_year"
                    />
                  </div>
                </div>
                <div className="flex flex-col space-y-2 px-1 pt-0.5">
                  <div className="flex justify-between items-center text-[10px] text-gray-400 font-mono tracking-wider">
                    <span>Month / Day / Year</span>
                    <span>Range: 1920 - 2026</span>
                  </div>
                  <p className={`text-[11px] font-medium leading-normal transition-all duration-300 ${
                    result && activeDecadeMood.decade === "1930s" ? "text-amber-200/60 font-serif italic" : "text-indigo-300 font-sans"
                  }`}>
                    {result && activeDecadeMood.decade === "1930s"
                      ? "“A preserved permanent collection document detailing the song matching your entry.”"
                      : "“Discover the nostalgic melody broadcasting across the nation the week my journey began.”"}
                  </p>
                </div>
              </div>

              {/* Error label if any */}
              {error && (
                <div className="text-red-300 bg-red-950/40 border border-red-500/20 rounded-xl px-4 py-3 text-xs font-serif leading-relaxed flex items-center space-x-2">
                  <Info size={14} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Reveal CTA Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full h-14 font-extrabold text-[#ebe6dd] rounded-xl transition-all duration-500 flex items-center justify-center space-x-2 group cursor-pointer select-none disabled:opacity-75 disabled:cursor-wait ${
                  result && activeDecadeMood.decade === "1930s"
                    ? activeDecadeMood.btnClass
                    : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]"
                }`}
                id="cta_reveal_button"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className={`h-4 w-4 rounded-full border-2 border-t-transparent animate-spin ${
                      result && activeDecadeMood.decade === "1930s" ? "border-[#c5a880]" : "border-white"
                    }`} />
                    <span className="font-mono tracking-wider text-xs normal-case">Consulting the Archives...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <span>Reveal My Song</span>
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </div>
                )}
              </button>
            </form>

            {/* Historical era archive status indicator */}
            <div className="flex items-center space-x-4 opacity-50 pt-2">
              <div className="h-[1px] w-12 bg-slate-600"></div>
              <span className="text-[10px] uppercase tracking-widest font-mono">Historical Archives: 1920 — 2026</span>
            </div>

            {/* Quick Loading Indicator beneath inputs */}
            <AnimatePresence>
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white/5 border border-white/5 p-4 rounded-2xl"
                >
                  <p className="text-xs font-mono text-pink-300 flex items-center space-x-2">
                    <span className="relative flex h-2 w-2 mr-1">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
                    </span>
                    <span>{loadingSteps[loadingStep]}</span>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT SIDE: Interactive Sample Reveal Preview Card (Visible BEFORE reveal, and shows REAL result if revealed) */}
          <div className="flex flex-col justify-center items-center" id="example_column">
            <div className="w-full max-w-sm relative">
              {/* Card Label tag above preview */}
              <div className={`absolute -top-3 left-6 z-20 text-[10px] font-mono tracking-widest uppercase px-3 py-1 rounded-sm shadow-md font-bold transition-all duration-500 ${
                result 
                  ? `${activeDecadeMood.badgeClass} border bg-[#0d0d12]/95` 
                  : "bg-[#ece7ff] text-[#08080a]"
              }`}>
                {result ? `ERA: ${activeDecadeMood.decade} ${activeDecadeMood.name}` : "Collectible Preview"}
              </div>

              {/* The Mock tape/vinyl Glassmorphism Card */}
              <div className={`w-full rounded-[2rem] p-5 md:p-6 pb-5 space-y-5 shadow-2xl relative overflow-hidden font-sans transition-all duration-500 ease-out hover:-translate-y-1 ${
                result ? activeDecadeMood.cardAtmosphere : "glass-panel border-white/10 hover:shadow-[0_20px_50px_rgba(99,102,241,0.15)] hover:border-indigo-500/25"
              }`}>
                
                {/* Vinyl record preview frame */}
                <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-slate-900/40 border border-white/5 flex items-center justify-center group">
                  
                  {/* Sleeve Background shadow */}
                  <div className="absolute inset-0 rounded-full bg-slate-950/40 shadow-inner" />
                  
                  {/* Rotating album circle with Immersive UI concentric groove style */}
                  <div 
                    className="vinyl-spin w-48 h-48 shadow-2xl flex items-center justify-center border-4 border-slate-950 animate-spin-slow"
                    style={{ animationDuration: result && activeDecadeMood.decade === "1930s" ? "20s" : "12s" }}
                  >
                    
                    {/* Custom inner sticker */}
                    <div className={`w-14 h-14 rounded-full ${result ? activeTheme.recordLabel : "bg-indigo-400"} flex flex-col items-center justify-center border border-indigo-400/20`}>
                      <div className="w-3 h-3 rounded-full bg-slate-900" />
                    </div>

                  </div>

                  {/* Micro timestamp label on vinyl card overlay */}
                  <div className="absolute bottom-4 left-4 glass px-3 py-1 rounded-full text-[10px] uppercase tracking-tighter text-white">
                    {result ? `Revealed: ${result.userBirthdayFormatted || "October 25, 1995"}` : "Previewing: Oct 25, 1995"}
                  </div>
                </div>

                {/* Standard Sample Song Meta */}
                <div className="space-y-1">
                  <div className="flex justify-between items-start">
                    <h2 className="text-2xl font-bold text-white tracking-tight leading-tight">{result ? result.songTitle : sampleData.songTitle}</h2>
                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded text-[9px] font-bold border border-amber-500/30 uppercase tracking-wider">
                      #1 Hit
                    </span>
                  </div>
                  <p className="text-base text-indigo-300 font-mono">
                    {result ? result.artist : sampleData.artist}
                  </p>
                </div>

                {/* Atmospheric small sentence */}
                <div className="pt-3.5 border-t border-white/5">
                  <p className="font-serif italic text-slate-400 text-xs md:text-sm leading-relaxed">
                    {result ? (
                      `“${result.emotionalSentence || "The radio was playing this melody when my story began.”"}`
                    ) : (
                      `“${sampleData.sentence} This track ruled American radio while I was entering the world.”`
                    )}
                  </p>
                </div>

                {/* Simulated Audio progress wave */}
                <div className="flex space-x-2 pt-1 items-center">
                   <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
                     <div className="h-full w-1/3 bg-indigo-500"></div>
                   </div>
                   <span className="text-[9px] font-mono text-slate-500">0:44 / 3:28</span>
                </div>
              </div>
            </div>
          </div>

        </main>

        {/* Real Dynamic Result Section: Appears BELOW the Split Grid */}
        <AnimatePresence>
          {result && (
            <motion.div
              ref={resultSectionRef}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="border-t border-white/5 pt-8 pb-6 w-full space-y-6"
              id="reveal_result_section"
            >
              <div className="text-center space-y-3.5 max-w-2xl mx-auto pb-4">
                <span className={`font-mono ${activeDecadeMood.accentClass} text-xs tracking-widest uppercase block transition-all duration-300`}>
                  {activeDecadeMood.eraLabel}
                </span>
                <h1 className={`text-4xl md:text-5xl tracking-tight leading-tight transition-all duration-500 ${
                  result && activeDecadeMood.decade === "1930s"
                    ? "gold-foil-text font-serif font-medium tracking-[0.14em]"
                    : `text-white ${activeDecadeMood.headingClass}`
                }`}>
                  The #1 Hit When I Arrived
                </h1>
                <h2 className={`text-xl md:text-2xl font-serif font-medium transition-all duration-500 ${
                  result && activeDecadeMood.decade === "1930s" ? "text-[#c5a880]/90 tracking-[0.06em]" : activeDecadeMood.accentClass
                }`}>
                  Born on {result.userBirthdayFormatted}?
                </h2>
                <p className="text-sm md:text-base text-slate-300">
                  The #1 Billboard song when I arrived was <strong className="text-white font-bold font-sans">“{result.songTitle}” by {result.artist}</strong>.
                </p>
                <p className="text-xs md:text-sm text-slate-400 font-mono tracking-wide">
                  This result is based on the <strong className={`font-bold ${activeDecadeMood.accentClass}`}>{formatBillboardWeek(result.matchedChartWeek)}</strong>.
                </p>
                <p className="text-sm text-slate-300 font-serif italic max-w-md mx-auto leading-relaxed pt-1">
                  My birthday has its own soundtrack — and apparently, it arrived with: “{result.emotionalSentence || "This was the sound echoing across America when my story began."}”
                </p>
                <div className="pt-2">
                  <span className={`text-xs md:text-sm font-sans font-bold tracking-widest uppercase italic block ${activeDecadeMood.accentClass}`}>
                    “The world already had a theme song waiting.”
                  </span>
                  <span className="text-[10px] md:text-xs font-mono text-slate-400 block tracking-wider uppercase mt-1">
                    Era Frequency: {activeDecadeMood.name} — {activeDecadeMood.vibeText}
                  </span>
                </div>
                <div className={`h-0.5 w-12 mx-auto rounded-full mt-3 animate-pulse transition-all duration-300 ${
                  activeDecadeMood.decade === "1930s" ? "bg-[#c5a880]/30" : "bg-gradient-to-r from-pink-500 via-indigo-500 to-teal-400"
                }`} />
              </div>

              {/* REVEAL CARD DESIGN - Custom Full Width Beautiful Container */}
              <div className={`rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden transition-all duration-500 ${activeDecadeMood.cardAtmosphere}`}>
                
                {/* Aura lighting directly inside reveal card */}
                <div className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-[100px] pointer-events-none ${activeTheme.glowBg} opacity-50`} />
                
                {/* Vinyl Record Layout: Grid 2-cols */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
                  
                  {/* Column 1: Splendid Vinyl Slip Out Showcase */}
                  <div className="md:col-span-5 flex justify-center py-4">
                    <div className="relative group cursor-pointer w-60 h-60">
                      
                      {/* Black vinyl disc that slips out on hover/touch with Concentric groovy texture */}
                      <div className="absolute top-0 left-0 w-60 h-60 vinyl-spin flex items-center justify-center transition-transform duration-700 ease-out group-hover:translate-x-12 shadow-2xl z-0 border-4 border-slate-900">
                        {/* Custom label stickers */}
                        <div className={`w-[35%] h-[35%] rounded-full ${activeTheme.recordLabel} border border-white/10 flex items-center justify-center animate-spin-slow`}>
                          <Music size={14} className="text-white" />
                        </div>
                        {/* Hole */}
                        <div className="absolute w-3 h-3 rounded-full bg-[#08080a] border border-zinc-700" />
                      </div>

                      {/* Custom Generated/Abstract Album Artwork sleeve */}
                      <div className={`absolute top-0 left-0 w-60 h-60 rounded-2xl p-1 flex flex-col justify-between shadow-2xl z-10 transition-all duration-500 group-hover:-translate-x-4 border ${
                        result && activeDecadeMood.decade === "1930s"
                          ? "poster-paper-1930s border-[#cca97b]/38 shadow-[0_0_25px_rgba(197,168,128,0.15)]"
                          : "bg-[#060609] bg-gradient-to-tr from-slate-950 to-zinc-900 border-white/15"
                      }`}>
                        
                        {/* Album Inner art: Glassmorphic abstract grid layout */}
                        <div className={`w-full h-[65%] rounded-t-xl flex items-center justify-center relative overflow-hidden border-b ${
                          result && activeDecadeMood.decade === "1930s"
                            ? "bg-[#1f1915] border-[#cca97b]/20"
                            : `${activeTheme.gradient} border-white/5`
                        }`}>
                          {/* Central thematic pattern */}
                          {result && activeDecadeMood.decade === "1930s" ? (
                            <>
                              {/* Art Deco design embellishments */}
                              <div className="absolute inset-4 border border-[#cca97b]/12 rotate-45 pointer-events-none" />
                              <div className="absolute h-24 w-24 border border-[#cca97b]/15 rounded-full" />
                              <div className="absolute h-12 w-12 border border-[#cca97b]/20 rounded-full" />
                              <Music size={48} className="text-[#cca97b]/35" />
                            </>
                          ) : (
                            <>
                              <div className="absolute h-32 w-32 border border-white/10 rounded-full animate-pulse-slow" />
                              <div className="absolute h-16 w-16 border border-white/15 rounded-full" />
                              <Disc size={64} className="text-white/20 animate-spin-slow" />
                            </>
                          )}
                          
                          {/* Artist title watermark */}
                          <div className={`absolute bottom-2 left-2 backdrop-blur-md px-2 py-0.5 rounded-sm ${
                            result && activeDecadeMood.decade === "1930s" ? "bg-[#1a1511]/90" : "bg-slate-950/50"
                          }`}>
                            <span className={`font-mono text-[8px] uppercase tracking-widest ${
                              result && activeDecadeMood.decade === "1930s" ? "text-[#fdecd5]" : "text-white/70"
                            }`}>{result.genre}</span>
                          </div>
                        </div>

                        {/* Album info bar */}
                        <div className={`h-[35%] p-3 rounded-b-xl flex flex-col justify-center ${
                          result && activeDecadeMood.decade === "1930s" ? "bg-[#1f1915]/95" : "bg-slate-900/90"
                        }`}>
                          <h4 className={`text-xs truncate ${
                            result && activeDecadeMood.decade === "1930s" ? "font-serif text-[#fbf5eb] tracking-wider" : "font-sans font-bold text-white"
                          }`}>{result.songTitle}</h4>
                          <p className={`text-[10px] truncate ${
                            result && activeDecadeMood.decade === "1930s" ? "font-serif italic text-[#cca97b]" : "text-gray-400 font-mono"
                          }`}>{result.artist}</p>
                          <div className="flex justify-between items-center mt-1 text-[8px] font-mono text-gray-500">
                            <span>{result && activeDecadeMood.decade === "1930s" ? "SHELLAC PRESSING" : "REVENUE RECORD"}</span>
                            <span>{result && activeDecadeMood.decade === "1930s" ? "DECO ORCHESTRA" : "#1 BILLBOARD"}</span>
                          </div>
                        </div>

                      </div>

                    </div>
                  </div>

                  {/* Column 2: Large song identity particulars */}
                  <div className="md:col-span-7 space-y-6 text-left" id="song_credentials">
                    <div className="space-y-3">
                      
                      {/* Billboard status ribbon */}
                      <div className="flex flex-wrap gap-2 items-center">
                        {result && activeDecadeMood.decade === "1930s" ? (
                          <span className="bg-[#332617] border border-[#cca97b]/50 text-[#fdecd5] font-serif text-[11px] uppercase tracking-[0.14em] px-3.5 py-1 rounded-full flex items-center space-x-1.5 shadow-md">
                            <Star size={11} className="fill-[#cca97b] stroke-[#cca97b] mr-0.5 animate-pulse" />
                            <span className="font-semibold">No. 1 Charting Record</span>
                          </span>
                        ) : (
                          <span className="bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-xs px-3 py-1 rounded-full flex items-center space-x-1.5 shadow-md">
                            <Star size={12} className="fill-amber-400 mr-0.5" />
                            <span className="font-bold tracking-wider uppercase">#1 in America</span>
                          </span>
                        )}

                        <span className={`px-3 py-1 rounded-full text-xs transition-all duration-300 border ${
                          result && activeDecadeMood.decade === "1930s"
                            ? "bg-[#251e18] border-[#cca97b]/30 text-[#ecd8bf] font-serif"
                            : "bg-white/5 border-white/10 text-gray-300 font-mono"
                        }`}>
                          {result.releaseYear}
                        </span>
                        <span className={`border text-xs px-3 py-1 rounded-full font-mono transition-all duration-300 ${activeDecadeMood.badgeClass}`}>
                          {result.genre}
                        </span>
                      </div>

                      <h3 className={`text-xs uppercase tracking-[0.2em] font-mono font-bold block pt-1 transition-all duration-300 ${activeDecadeMood.accentClass}`}>
                        Song Details
                      </h3>
                      <h4 className={`text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight transition-all duration-500 ${activeDecadeMood.headingClass}`}>
                        {result.songTitle}
                      </h4>
                      <p className={`text-lg font-serif italic transition-all duration-500 ${activeDecadeMood.accentClass}`}>
                        by {result.artist}
                      </p>

                      {/* Birth Date and Billboard Week Context Details */}
                      <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 border rounded-2xl p-4 max-w-md font-mono text-xs mt-3 transition-all duration-500 ${
                        activeDecadeMood.decade === "1930s" ? "bg-[#1c1612]/75 border-[#4e3c2e]" :
                        activeDecadeMood.decade === "1940s" ? "bg-[#161a24]/50 border-slate-800" :
                        activeDecadeMood.decade === "1950s" ? "bg-rose-950/20 border-rose-900/30" :
                        activeDecadeMood.decade === "1960s" ? "bg-violet-950/20 border-violet-900/30" :
                        activeDecadeMood.decade === "1970s" ? "bg-amber-950/30 border-amber-900/30" :
                        activeDecadeMood.decade === "1980s" ? "bg-pink-950/20 border-pink-900/30" :
                        activeDecadeMood.decade === "1990s" ? "bg-indigo-950/20 border-indigo-900/30" :
                        "bg-white/5 border-white/10"
                      }`}>
                        <div>
                          <span className={`block text-[9px] uppercase tracking-wider mb-0.5 ${
                            activeDecadeMood.decade === "1930s" ? "text-[#cca97b]/85" : "text-gray-400"
                          }`}>🎂 My Birthday</span>
                          <span className={`font-bold text-sm tracking-wide ${
                            activeDecadeMood.decade === "1930s" ? "text-[#fdecd5]" : "text-white"
                          }`}>{result.userBirthdayFormatted || "October 25, 1995"}</span>
                        </div>
                        <div className={`sm:border-l sm:pl-4 ${
                          activeDecadeMood.decade === "1930s" ? "border-[#4e3c2e]" : "border-white/10"
                        }`}>
                          <span className={`block text-[9px] uppercase tracking-wider mb-0.5 ${
                            activeDecadeMood.decade === "1930s" ? "text-[#cca97b]/85" : "text-gray-400"
                          }`}>📅 Historical Week</span>
                          <span className={`font-bold text-xs tracking-wide block ${
                            activeDecadeMood.decade === "1930s" ? "text-[#cca97b]" : activeDecadeMood.accentClass
                          }`}>
                            {formatBillboardWeek(result.matchedChartWeek || "October 21, 1995")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Poetic nostalgic hook detail */}
                    <blockquote className={`border-l-2 pl-4 py-1 text-base text-slate-300 font-serif italic leading-relaxed transition-all duration-500 ${
                      activeDecadeMood.decade === "1930s" ? "border-[#c5a880]/40" :
                      activeDecadeMood.decade === "1970s" ? "border-amber-600/40" :
                      activeDecadeMood.decade === "1940s" ? "border-slate-500/40" :
                      activeDecadeMood.decade === "1950s" ? "border-rose-500/40" :
                      activeDecadeMood.decade === "1960s" ? "border-violet-500/40" :
                      activeDecadeMood.decade === "1980s" ? "border-pink-500/50" :
                      activeDecadeMood.decade === "1990s" ? "border-indigo-500/40" :
                      "border-indigo-500/40"
                    }`}>
                      “{result.emotionalSentence}”
                    </blockquote>

                    {/* Media action controls */}
                    <div className="flex flex-wrap gap-2.5 pt-1.5 animate-fade-in-up">
                      <a 
                        href={result.spotifyUrl}
                        target="_blank" 
                        referrerPolicy="no-referrer"
                        className={`inline-flex items-center space-x-1.5 active:scale-98 font-sans font-bold text-xs px-4 py-2.5 rounded-full transition-all duration-300 border cursor-pointer shadow-xs ${
                          result && activeDecadeMood.decade === "1930s"
                            ? "bg-[#183a24] hover:bg-[#204a30] text-[#e0efdf] border-[#55a26c]/30"
                            : "bg-emerald-700/80 hover:bg-emerald-600 text-white border-emerald-500/20"
                        }`}
                      >
                        <Play size={11} className="fill-current" />
                        <span>Search Web & Spotify</span>
                      </a>
                      
                      <button 
                        onClick={handleCopyToClipboard}
                        className={`inline-flex items-center space-x-1.5 active:scale-98 text-xs px-4 py-2.5 rounded-full transition-all duration-300 border cursor-pointer shadow-xs ${
                          result && activeDecadeMood.decade === "1930s"
                            ? "bg-[#1c1814] hover:bg-[#28221c] text-[#dfcfb8] border-[#c5a880]/30 font-serif"
                            : "bg-white/5 hover:bg-white/10 text-gray-200 border-white/10 font-mono"
                        }`}
                      >
                        {copied ? (
                          <>
                            <span className="text-emerald-400">✓ Copied Results</span>
                          </>
                        ) : (
                          <>
                            <Share2 size={13} />
                            <span>Share My Story</span>
                          </>
                        )}
                      </button>

                      <button 
                        onClick={() => {
                          const composer = document.getElementById("keepsake_composer_section");
                          composer?.scrollIntoView({ behavior: "smooth", block: "start" });
                        }}
                        className={`inline-flex items-center space-x-1.5 active:scale-98 text-xs font-semibold px-4.5 py-2.5 rounded-full transition-all duration-300 border cursor-pointer ${
                          result && activeDecadeMood.decade === "1930s"
                            ? "bg-linear-to-b from-[#2e2620] to-[#1c1613] text-[#fbf5eb] border-[#c5a880]/40 hover:border-[#c5a880]/70 font-serif italic shadow-[0_4px_12px_rgba(197,168,128,0.1)]"
                            : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white border-indigo-400/35 hover:shadow-[0_0_15px_rgba(99,102,241,0.25)] font-sans"
                        }`}
                      >
                        <Sparkles size={11} className="animate-pulse" />
                        <span>Turn Memory Into Art</span>
                      </button>
                    </div>

                  </div>

                </div>

              </div>

              {/* SECTION 2: SEO/AI-Friendly Supporting Context Section */}
              <section id="birthday-song-context" className="pt-24 border-t border-white/5 mt-24 max-w-2xl mx-auto text-left space-y-8">
                <div className="space-y-3">
                  <h2 className="text-xl md:text-2xl font-sans font-extrabold text-white tracking-tight leading-tight">
                    What Was Happening in Music That Week?
                  </h2>
                  <p className="text-sm md:text-base text-slate-300 leading-relaxed font-sans font-normal">
                    During the chart week of <strong>{result.matchedChartWeek}</strong>, the track <strong className="text-white">“{result.songTitle}”</strong> by <strong className="text-white">{result.artist}</strong> was the undisputed #1 song in America. It ruled radios across America.
                  </p>
                </div>

                <div className="space-y-3">
                  <h2 className="text-xl md:text-2xl font-sans font-extrabold text-white tracking-tight leading-tight">
                    Your Birthday Soundtrack
                  </h2>
                  <p className="text-sm md:text-base text-slate-300 leading-relaxed font-sans font-normal">
                    Your arrival came with its own soundtrack. While radios played <strong className="text-white">“{result.songTitle}”</strong>, your first moments in history were anchored to this melody: <span className="text-indigo-200 italic">“{result.emotionalSentence || 'This was the sound echoing across America when your story began.'}”</span>
                  </p>
                </div>
              </section>

              {/* SECTION 4: EXTRA NOSTALGIA GRID: Under the Reveal Card */}
              <section id="birthday-song-culture" className="pt-24 border-t border-white/5 mt-24 space-y-8">
                <div className="text-left space-y-2 max-w-2xl mx-auto md:text-center">
                  <h3 className="text-xl md:text-2xl font-sans font-extrabold text-white tracking-tight">
                    Echoes & Culture of {result.releaseYear}
                  </h3>
                  <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-sans max-w-xl mx-auto">
                    Music was only part of the story.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch pt-2">
                  
                  {/* Movie box office card */}
                  <div className="bg-white/[0.01] hover:bg-white/[0.03] rounded-2xl p-5 transition-all duration-300 border border-white/5 hover:border-white/10 flex flex-col justify-between text-left">
                    <div className="space-y-3">
                      <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400">
                        <Film size={14} />
                      </div>
                      <div>
                        <span className="font-mono text-[8px] text-slate-500 tracking-wider font-semibold uppercase">Box Office</span>
                        <h4 className="text-sm font-sans font-bold text-white line-clamp-1">{result.movieTitle}</h4>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">{result.movieDescription}</p>
                    </div>
                    <div className="pt-3 text-[90%] font-mono text-[9px] text-slate-500 border-t border-white/5 mt-3">
                      Dominating Cinema Screens
                    </div>
                  </div>

                  {/* Top rated TV card */}
                  <div className="bg-white/[0.01] hover:bg-white/[0.03] rounded-2xl p-5 transition-all duration-300 border border-white/5 hover:border-white/10 flex flex-col justify-between text-left">
                    <div className="space-y-3">
                      <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400">
                        <Tv size={14} />
                      </div>
                      <div>
                        <span className="font-mono text-[8px] text-slate-500 tracking-wider font-semibold uppercase">Prime Time</span>
                        <h4 className="text-sm font-sans font-bold text-white line-clamp-1">{result.tvShowTitle}</h4>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">{result.tvShowDescription}</p>
                    </div>
                    <div className="pt-3 text-[90%] font-mono text-[9px] text-slate-500 border-t border-white/5 mt-3">
                      Ruling Television Broadcasts
                    </div>
                  </div>

                  {/* Celebrity astrological ally card */}
                  <div className="bg-white/[0.01] hover:bg-white/[0.03] rounded-2xl p-5 transition-all duration-300 border border-white/5 hover:border-white/10 flex flex-col justify-between text-left">
                    <div className="space-y-3">
                      <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400">
                        <Star size={14} />
                      </div>
                      <div>
                        <span className="font-mono text-[8px] text-slate-500 tracking-wider font-semibold uppercase">Shared Birthday</span>
                        <h4 className="text-sm font-sans font-bold text-white line-clamp-1">{getCelebrityInfo(result).name}</h4>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">{getCelebrityInfo(result).description}</p>
                    </div>
                    <div className="pt-3 text-[90%] font-mono text-[9px] text-slate-500 border-t border-white/5 mt-3">
                      Sharing Your Timeline Path
                    </div>
                  </div>

                  {/* Cultural Snapshot Card (Featured Premium Accent Glow) */}
                  <div className="rounded-2xl p-5 transition-all duration-300 border border-indigo-500/10 bg-[#0d0d14]/50 flex flex-col justify-between text-left relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/[0.03] rounded-full blur-2xl group-hover:bg-indigo-500/[0.06] transition-all duration-300" />
                    
                    <div className="space-y-3 relative z-10 w-full">
                      <div className="h-8 w-8 rounded-lg bg-indigo-500/10 border border-indigo-400/20 flex items-center justify-center text-indigo-400">
                        <Sparkles size={14} />
                      </div>
                      <div>
                        <span className="font-mono text-[8px] text-indigo-400 tracking-wider font-semibold uppercase">Cultural Vibe</span>
                        <h4 className="text-sm font-sans font-bold text-indigo-200 line-clamp-1">Generation Signature</h4>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">{result.culturalSnapshot}</p>
                    </div>
                    <div className="pt-3 text-[90%] font-mono text-[9px] text-indigo-400/60 border-t border-white/5 mt-3 relative z-10">
                      Prevalent Musical Vibe
                    </div>
                  </div>

                </div>
              </section>

              {/* SECTION 5: KEEPSAKE ORIGINAL POSTER COMPOSER MODULE */}
              <div id="keepsake_composer_section" className="pt-24 border-t border-white/5 mt-24 space-y-8">
                <div className="text-left space-y-2 max-w-2xl mx-auto md:text-center">
                  <span className="inline-flex items-center space-x-1.5 py-1 px-3 rounded bg-white/[0.02] border border-white/5 text-slate-400 font-mono text-[9px] uppercase tracking-widest font-bold">
                    <Palette size={10} className="text-slate-400" />
                    <span>Keepsake Artifact</span>
                  </span>
                  <h2 className="text-2xl md:text-3xl font-sans font-extrabold text-white tracking-tight">
                    My Birthday Soundtrack Poster
                  </h2>
                  <p className="text-xs md:text-sm text-slate-400 font-sans leading-relaxed">
                    Turn your arrival into a framed cultural artifact.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch pt-2">
                  
                  {/* LEFT: Mini Settings Panel (Secondary visual weight) */}
                  <div className="lg:col-span-4 space-y-4">
                    <div className={`rounded-2xl p-5 space-y-5 shadow-inner text-left h-full flex flex-col justify-between border backdrop-blur-md transition-all duration-700 ${
                      result && activeDecadeMood.decade === "1930s"
                        ? "bg-[#181310]/95 border-[#4d3f32] shadow-[0_15px_35px_rgba(20,15,12,0.6)]"
                        : "bg-[#060609]/30 border-white/[0.03]"
                    }`}>
                      
                      <div className="space-y-4">
                        {/* Section 1: Headline selection */}
                        <div className="space-y-1.5">
                          <label className={`text-[9px] font-semibold uppercase tracking-widest font-mono flex items-center space-x-1.5 transition-colors duration-300 ${
                            result && activeDecadeMood.decade === "1930s" ? activeDecadeMood.accentClass : "text-slate-400"
                          }`}>
                            <Sliders size={11} className={result && activeDecadeMood.decade === "1930s" ? "text-[#cca97b]/80" : "text-slate-500"} />
                            <span>Poster Headline</span>
                          </label>
                          <select
                            value={posterTitle}
                            onChange={(e) => setPosterTitle(e.target.value)}
                            className={`w-full text-xs font-sans h-10 rounded-lg px-3 italic font-medium cursor-pointer transition-all duration-300 ${
                              result && activeDecadeMood.decade === "1930s"
                                ? "bg-[#1d1814] border-[#4d3f32] text-amber-100 focus:border-[#cca97b]/50 focus:outline-hidden"
                                : "bg-white/[0.02] border border-white/5 text-gray-300 focus:border-indigo-500/50 hover:border-white/10"
                            }`}
                          >
                            <option value="The #1 Hit When I Arrived">"The #1 Hit When I Arrived"</option>
                            <option value="The Song That Welcomed My Story">"The Song That Welcomed My Story"</option>
                            <option value="My Birth Soundtrack">"My Birth Soundtrack"</option>
                            <option value="America Was Playing This When I Arrived">"America Was Playing This..."</option>
                          </select>
                        </div>

                        {/* Section 2: Birth location */}
                        <div className="space-y-1.5">
                          <label className={`text-[9px] font-semibold uppercase tracking-widest font-mono flex items-center space-x-1.5 transition-colors duration-300 ${
                            result && activeDecadeMood.decade === "1930s" ? activeDecadeMood.accentClass : "text-slate-400"
                          }`}>
                            <MapPin size={11} className={result && activeDecadeMood.decade === "1930s" ? "text-[#cca97b]/80" : "text-slate-500"} />
                            <span>Where My Story Began</span>
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Seattle, Washington"
                            value={posterCity}
                            onChange={(e) => setPosterCity(e.target.value)}
                            className={`w-full text-xs font-sans h-10 rounded-lg px-3 font-medium transition-all duration-300 focus:outline-hidden ${
                              result && activeDecadeMood.decade === "1930s"
                                ? "bg-[#1d1814] border-[#4d3f32] text-amber-100 focus:border-[#cca97b]/50"
                                : "bg-white/[0.02] border border-white/5 text-gray-300 focus:border-indigo-500/50 hover:border-white/10"
                            }`}
                          />
                          <span className="text-[8px] text-slate-500 font-mono tracking-wide block">Places location coordinate stamps dynamically onto the template.</span>
                        </div>

                        {/* Section 3: Nostalgia Spotlight Selection */}
                        <div className="space-y-1.5">
                          <label className={`text-[9px] font-semibold uppercase tracking-widest font-mono flex items-center space-x-1.5 transition-colors duration-300 ${
                            result && activeDecadeMood.decade === "1930s" ? activeDecadeMood.accentClass : "text-slate-400"
                          }`}>
                            <Sparkles size={11} className={result && activeDecadeMood.decade === "1930s" ? "text-[#cca97b]/80" : "text-slate-500"} />
                            <span>Memory Spotlight</span>
                          </label>
                          <div className={`grid gap-1.5 ${spotlightOptions.filter((s) => s.id !== "star" || hasValidCelebrityMatch(result)).length === 3 ? "grid-cols-3" : "grid-cols-4"}`}>
                            {spotlightOptions
                              .filter((s) => s.id !== "star" || hasValidCelebrityMatch(result))
                              .map((s) => (
                                <button
                                  key={s.id}
                                  type="button"
                                  onClick={() => setPosterSpotlight(s.id)}
                                  className={`h-10 rounded-lg flex flex-col items-center justify-center border font-sans relative cursor-pointer transition-all duration-200 active:scale-95 ${
                                    posterSpotlight === s.id 
                                      ? (result && activeDecadeMood.decade === "1930s"
                                          ? "bg-[#251e18] border-[#cca97b]/60 text-[#cca97b] font-semibold animate-pulse-slow shadow-md"
                                          : "bg-white/[0.08] border-white/20 text-white font-medium") 
                                      : (result && activeDecadeMood.decade === "1930s"
                                          ? "bg-[#1d1814]/40 border-[#4d3f32] text-slate-400 hover:border-[#6b5847] hover:text-[#cca97b]"
                                          : "bg-transparent border-white/5 text-slate-500 hover:border-white/10 hover:text-slate-300")
                                  }`}
                                  title={s.label}
                                >
                                  <span className="text-xs mb-0.5">{s.icon}</span>
                                  <span className="text-[7px] font-mono tracking-tight font-bold uppercase">{s.label.split(" ")[0]}</span>
                                </button>
                              ))}
                          </div>
                          <div className={`rounded-lg p-2.5 text-[10px] font-sans leading-relaxed border text-center transition-all duration-300 ${
                            result && activeDecadeMood.decade === "1930s"
                              ? "bg-[#1d1814]/70 border-[#4d3f32] text-slate-350"
                              : "bg-white/[0.01] border border-white/5 text-slate-400"
                          }`}>
                            <span className={`font-bold block mb-0.5 text-[9px] uppercase tracking-wider ${
                              result && activeDecadeMood.decade === "1930s" ? activeDecadeMood.accentClass : "text-indigo-400"
                            }`}>{spotlightOptions.find(s => s.id === posterSpotlight)?.subtitle || "Era Vibe & Cultural Snapshot"}</span>
                            “{spotlightOptions.find(s => s.id === posterSpotlight)?.description || "A snapshot of the generation's collective pulse and social shift."}”
                          </div>
                        </div>

                        {/* Section 4: Palette select swatches / Museum Curator Exhibition Style Selector */}
                        <div className="space-y-2">
                          <label className={`text-[9px] font-semibold uppercase tracking-widest font-mono flex items-center space-x-1.5 transition-colors duration-300 ${
                            result && activeDecadeMood.decade === "1930s" ? activeDecadeMood.accentClass : "text-slate-400"
                          }`}>
                            <Palette size={11} className={result && activeDecadeMood.decade === "1930s" ? "text-[#cca97b]/80" : "text-slate-500"} />
                            <span>{result && activeDecadeMood.decade === "1930s" ? "Archival Preservation Medium" : "Exhibition Soundscape Colors"}</span>
                          </label>

                          {result && activeDecadeMood.decade === "1930s" ? (
                            /* Immersive Curator Selection System for 1930s */
                            <div className="space-y-2">
                              <div className="grid grid-cols-3 gap-1.5">
                                {curatorEditions1930s.map((edition) => {
                                  const isSelected = posterTheme === edition.id || 
                                    (posterTheme === "gold" && edition.id === "grand_ballroom") || 
                                    (posterTheme === "carbon" && edition.id === "grand_ballroom") ||
                                    (posterTheme === "violet" && edition.id === "jazz_lounge") ||
                                    (posterTheme === "teal" && edition.id === "candlelight_broadcast");
                                  return (
                                    <button
                                      key={edition.id}
                                      type="button"
                                      onClick={() => setPosterTheme(edition.id)}
                                      className={`py-2 px-1 rounded-xl flex flex-col items-center justify-between border text-center relative cursor-pointer active:scale-95 transition-all duration-200 min-h-16 ${
                                        isSelected 
                                          ? "bg-[#251e18] border-[#cca97b]/80 text-[#cca97b] shadow-[0_4px_12px_rgba(37,30,24,0.5)] font-semibold"
                                          : "bg-[#1d1814]/45 border-[#4d3f32]/60 text-slate-400 hover:border-[#cca97b]/40 hover:text-amber-100"
                                      }`}
                                    >
                                      <span className={`h-2.5 w-2.5 rounded-full ${edition.recordBg} border border-white/10 shadow-sm`} />
                                      <span className="text-[7.5px] font-mono tracking-tight leading-snug mt-1.5 w-full truncate">{edition.label.replace(" Edition", "").replace(" Print", "")}</span>
                                    </button>
                                  );
                                })}
                              </div>
                              {/* Curator's Exhibition Notes */}
                              <div className="rounded-xl border border-[#4d3f32]/50 bg-[#16120e]/65 p-3 text-left shadow-inner transition-all duration-350">
                                <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-[#cca97b]/70 block mb-1">Curator's Exhibition Notes</span>
                                <p className="text-[9.5px] leading-relaxed text-[#edd5c3]/90 italic font-serif">
                                  “{(() => {
                                    const activeConf = curatorEditions1930s.find(e => e.id === posterTheme) || 
                                      (posterTheme === "violet" ? curatorEditions1930s[2] : 
                                       posterTheme === "teal" ? curatorEditions1930s[4] : curatorEditions1930s[0]);
                                    return activeConf.description;
                                  })()}”
                                </p>
                              </div>
                            </div>
                          ) : (
                            /* Standard Themes Reframed as Immersive Curator Styles */
                            <div className="space-y-2">
                              <div className="grid grid-cols-4 gap-1.5">
                                {themeOptions.map((t) => (
                                  <button
                                    key={t.id}
                                    type="button"
                                    onClick={() => setPosterTheme(t.id)}
                                    className={`py-2 px-1 rounded-xl flex flex-col items-center justify-between border text-center relative cursor-pointer active:scale-95 transition-all duration-200 min-h-16 ${
                                      posterTheme === t.id 
                                        ? "bg-white/[0.08] border-white/25 text-white font-semibold" 
                                        : "bg-transparent border-white/5 text-slate-500 hover:border-white/15 hover:text-slate-300"
                                    }`}
                                  >
                                    <span className={`h-2 text-none w-2 rounded-full ${t.recordBg} border border-white/10 shadow-sm`} />
                                    <span className="text-[7.5px] font-mono tracking-tight leading-snug mt-1.5 w-full truncate">{t.label.replace("Midnight ", "").replace("Vintage ", "").replace("Emerald ", "").replace("Modern ", "")}</span>
                                  </button>
                                ))}
                              </div>
                              {/* Classic Notes Box */}
                              <div className="rounded-xl border border-white/5 bg-white/[0.01] p-3 text-left shadow-inner transition-all duration-350">
                                <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-stone-400 block mb-1">Acoustic Medium Details</span>
                                <p className="text-[9.5px] leading-relaxed text-slate-400 italic">
                                  {posterTheme === "violet" && "“Midnight Violet: Imbues the exhibit frame with neon evening tones and deep desaturated acoustic filters.”"}
                                  {posterTheme === "gold" && "“Vintage Gold: Reclaims the rich, organic glow of early vinyl wax with polished copper accents.”"}
                                  {posterTheme === "teal" && "“Emerald Sea: Wraps the historical snapshot in vibrant marine hues and cool retro acoustic shade.”"}
                                  {posterTheme === "carbon" && "“Modern Graphite: Focuses visual and typography weight strictly on the raw recording data with minimalist carbon backing.”"}
                                  {!["violet", "gold", "teal", "carbon"].includes(posterTheme) && "“Selected high-fidelity restoration overlay. Highlighting historic catalog textures and acoustic curves.”"}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Section 5: Dedication message */}
                        <div className="space-y-1.5">
                          <label className={`text-[9px] font-semibold uppercase tracking-widest font-mono flex items-center space-x-1.5 transition-colors duration-300 ${
                            result && activeDecadeMood.decade === "1930s" ? activeDecadeMood.accentClass : "text-slate-400"
                          }`}>
                            <Heart size={11} className={result && activeDecadeMood.decade === "1930s" ? "text-[#cca97b]/80" : "text-slate-500"} />
                            <span>Personal Dedication</span>
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Emma's Nursery Gallery"
                            value={posterDedication}
                            maxLength={45}
                            onChange={(e) => setPosterDedication(e.target.value)}
                            className={`w-full text-xs font-sans h-10 rounded-lg px-3 focus:outline-hidden transition-all duration-300 ${
                              result && activeDecadeMood.decade === "1930s"
                                ? "bg-[#1d1814] border-[#4d3f32] text-amber-100 focus:border-[#cca97b]/50"
                                : "bg-white/[0.02] border border-white/5 text-gray-300 focus:border-indigo-500/50"
                            }`}
                          />
                          <span className="text-[8px] text-slate-500 font-mono tracking-wide block">Watermarked with high typographic precision along the base.</span>
                        </div>
                      </div>

                      {/* Error Banner */}
                      {exportError && (
                        <div className="text-red-350 bg-red-950/20 border border-red-500/10 rounded-lg px-3 py-2 text-xs font-serif leading-relaxed flex items-center space-x-1.5 theme-adaptable-error">
                          <Info size={11} className="shrink-0 text-red-500" />
                          <span>{exportError}</span>
                        </div>
                      )}

                      {/* Unifed print selectors and single download trigger */}
                      <div className="pt-4 border-t border-white/5 space-y-3">
                        
                        {/* Elegant Segmented Format Switcher */}
                        <div className="space-y-1">
                          <div className={`grid grid-cols-2 gap-1 p-1 rounded-lg border transition-colors duration-300 ${
                            result && activeDecadeMood.decade === "1930s"
                              ? "bg-[#1d1814] border-[#4d3f32]"
                              : "bg-white/[0.02] border-white/5"
                          }`}>
                            <button
                              type="button"
                              onClick={() => setDownloadFormat("png")}
                              className={`py-1.5 rounded-md text-[9px] font-mono tracking-wider transition-all cursor-pointer ${
                                downloadFormat === "png"
                                  ? (result && activeDecadeMood.decade === "1930s"
                                      ? "bg-[#332b22] text-[#cca97b] font-extrabold shadow-sm"
                                      : "bg-white/[0.08] text-white font-extrabold")
                                  : "text-slate-500 hover:text-slate-300"
                              }`}
                            >
                              HQ PNG IMAGE
                            </button>
                            <button
                              type="button"
                              onClick={() => setDownloadFormat("pdf")}
                              className={`py-1.5 rounded-md text-[9px] font-mono tracking-wider transition-all cursor-pointer ${
                                downloadFormat === "pdf"
                                  ? (result && activeDecadeMood.decade === "1930s"
                                      ? "bg-[#332b22] text-[#cca97b] font-extrabold shadow-sm"
                                      : "bg-white/[0.08] text-white font-extrabold")
                                  : "text-slate-500 hover:text-slate-300"
                              }`}
                            >
                              VECTOR PRINT-PDF
                            </button>
                          </div>
                        </div>

                        {/* Single dominant white button */}
                        <button
                          type="button"
                          onClick={() => exportPoster(downloadFormat)}
                          disabled={isExporting}
                          className={`w-full h-11 active:scale-[0.99] font-extrabold text-xs font-sans tracking-widest rounded-lg transition-all flex items-center justify-center space-x-2 group cursor-pointer disabled:opacity-75 disabled:cursor-wait uppercase ${
                            result && activeDecadeMood.decade === "1930s"
                              ? "bg-[#4a3a2a] hover:bg-[#5a4734] text-[#fff6e6] border border-[#d2ab7e]/50 shadow-xl hover:shadow-[0_0_25px_rgba(210,171,126,0.2)]"
                              : "bg-white hover:bg-zinc-100 text-black shadow-2xl"
                          }`}
                        >
                          {isExporting ? (
                            <div className="flex items-center space-x-2">
                              <div className={`h-3.5 w-3.5 rounded-full border-2 animate-spin ${
                                result && activeDecadeMood.decade === "1930s" ? "border-[#cca97b]/30 border-t-[#cca97b]" : "border-black/30 border-t-black"
                              }`} />
                              <span className={`font-mono tracking-wider text-[10px] font-bold ${
                                result && activeDecadeMood.decade === "1930s" ? "text-amber-200/90" : "text-black"
                              }`}>DIGGING COVERS...</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-1.5">
                              <Download size={13} className="shrink-0" />
                              <span>Download My Music Poster</span>
                            </div>
                          )}
                        </button>
                      </div>

                    </div>
                  </div>

                  {/* RIGHT: Live Collector Keepsake Preview Screen (Visual Hero of Page) */}
                  <div className="lg:col-span-8 flex flex-col items-center justify-center space-y-4">
                    
                    <div className="text-[10px] font-mono tracking-[0.25em] text-slate-500 uppercase flex items-center space-x-2 select-none">
                      <span className="h-1 w-1 rounded-full bg-indigo-500 animate-pulse-slow"></span>
                      <span>POSTER PREVIEW</span>
                    </div>

                    <div 
                      style={result && activeDecadeMood.decade === "1930s" ? {
                        backgroundColor: activeThemeConfig.backgroundColor,
                        backgroundImage: activeThemeConfig.paperBgImage,
                        backgroundBlendMode: activeThemeConfig.paperBlendMode as any
                      } : undefined}
                      className={`relative w-full max-w-[460px] md:max-w-[490px] aspect-[1/1.4] p-6.5 md:p-8 flex flex-col justify-between text-left shadow-2xl overflow-hidden group font-sans select-none border-[10px] md:border-[15px] transition-all duration-1000 ${
                        result && activeDecadeMood.decade === "1930s"
                          ? `${activeThemeConfig.shadowClass} ${activeThemeConfig.outerPaperClass} ring-2 ring-[#cca97b]/20`
                          : "bg-[#060609] border-[#131317] film-grain"
                      }`}
                    >
                      
                      {/* Premium editorial paper reflection & overlay shine */}
                      <div className="absolute inset-0 bg-radial from-white/[0.03] via-transparent to-transparent pointer-events-none z-10" />
                      <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-transparent via-white/[0.015] to-transparent transform rotate-12 pointer-events-none z-10" />
 
                      {/* Highly adjusted double vignette background */}
                      <div 
                        className="absolute inset-0 transition-opacity duration-700 ease-in-out pointer-events-none" 
                        style={{
                          background: activeThemeConfig.vignette,
                          opacity: 0.95
                        }}
                      />
 
                      {/* Editorial frame hair-lines representing elite frame design */}
                      <div className={`absolute inset-2.5 border pointer-events-none rounded-2xl transition-all duration-1000 ${
                        result && activeDecadeMood.decade === "1930s" ? activeThemeConfig.lineContrast : "border-white/5"
                      }`} />
                      <div className={`absolute inset-3 border pointer-events-none rounded-2xl transition-all duration-1000 ${
                        result && activeDecadeMood.decade === "1930s" ? "border-[#2e2217]/50" : "border-white/5"
                      }`} />

                      {/* 1930s Museum Registry collector mark / Private Archive stamp overlay */}
                      {result && activeDecadeMood.decade === "1930s" && posterDedication && (
                        <div className="absolute bottom-[9px] md:bottom-[12.5px] left-0 right-0 text-center z-20 pointer-events-none transition-all duration-1000">
                          <span className={`inline-block px-1.5 py-[1px] bg-neutral-950/25 rounded-[1px] border border-[#cca97b]/5 uppercase font-serif italic text-[4.2px] md:text-[4.8px] tracking-[0.2em] ${activeThemeConfig.accent} opacity-40 backdrop-blur-[0.5px]`}>
                            {format1930sDedication(posterDedication)}
                          </span>
                        </div>
                      )}

                      {/* Authentic 1930s Art Deco Symmetrical Geometric Border System overlay (SVG) */}
                      {result && activeDecadeMood.decade === "1930s" && (
                        <svg className={`absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)] pointer-events-none transition-all duration-1000 ${activeThemeConfig.accent}`} viewBox="0 0 100 140" preserveAspectRatio="none">
                          <rect x="1" y="1" width="98" height="138" fill="none" stroke="currentColor" strokeWidth="0.45" className="opacity-40" />
                          <rect x="2.5" y="2.5" width="95" height="135" fill="none" stroke="currentColor" strokeWidth="0.75" className="opacity-60" />
                          <rect x="4" y="4" width="92" height="132" fill="none" stroke="currentColor" strokeWidth="0.3" className="opacity-25" />
                          
                          <path d="M 1,12 L 12,1 L 12,5 L 5,12 Z" fill="none" stroke="currentColor" strokeWidth="0.4" className="opacity-50" />
                          <line x1="2.5" y1="2.5" x2="15" y2="2.5" stroke="currentColor" strokeWidth="0.6" className="opacity-70" />
                          <line x1="2.5" y1="2.5" x2="2.5" y2="15" stroke="currentColor" strokeWidth="0.6" className="opacity-70" />
                          <line x1="4.5" y1="4.5" x2="11" y2="4.5" stroke="currentColor" strokeWidth="0.45" className="opacity-45" />
                          <line x1="4.5" y1="4.5" x2="4.5" y2="11" stroke="currentColor" strokeWidth="0.45" className="opacity-45" />

                          <path d="M 99,12 L 88,1 L 88,5 L 95,12 Z" fill="none" stroke="currentColor" strokeWidth="0.4" className="opacity-50" />
                          <line x1="97.5" y1="2.5" x2="85" y2="2.5" stroke="currentColor" strokeWidth="0.6" className="opacity-70" />
                          <line x1="97.5" y1="2.5" x2="97.5" y2="15" stroke="currentColor" strokeWidth="0.6" className="opacity-70" />
                          <line x1="95.5" y1="4.5" x2="89" y2="4.5" stroke="currentColor" strokeWidth="0.45" className="opacity-45" />
                          <line x1="95.5" y1="4.5" x2="95.5" y2="11" stroke="currentColor" strokeWidth="0.45" className="opacity-45" />

                          <path d="M 1,128 L 12,139 L 12,135 L 5,128 Z" fill="none" stroke="currentColor" strokeWidth="0.4" className="opacity-50" />
                          <line x1="2.5" y1="137.5" x2="15" y2="137.5" stroke="currentColor" strokeWidth="0.6" className="opacity-70" />
                          <line x1="2.5" y1="137.5" x2="2.5" y2="125" stroke="currentColor" strokeWidth="0.6" className="opacity-70" />
                          <line x1="4.5" y1="135.5" x2="11" y2="135.5" stroke="currentColor" strokeWidth="0.45" className="opacity-45" />
                          <line x1="4.5" y1="135.5" x2="4.5" y2="129" stroke="currentColor" strokeWidth="0.45" className="opacity-45" />

                          <path d="M 99,128 L 88,139 L 88,135 L 94,128 Z" fill="none" stroke="currentColor" strokeWidth="0.4" className="opacity-50" />
                          <line x1="97.5" y1="137.5" x2="85" y2="137.5" stroke="currentColor" strokeWidth="0.6" className="opacity-70" />
                          <line x1="97.5" y1="137.5" x2="97.5" y2="125" stroke="currentColor" strokeWidth="0.6" className="opacity-70" />
                          <line x1="95.5" y1="135.5" x2="89" y2="135.5" stroke="currentColor" strokeWidth="0.45" className="opacity-45" />
                          <line x1="95.5" y1="135.5" x2="95.5" y2="129" stroke="currentColor" strokeWidth="0.45" className="opacity-45" />

                          <path d="M 45,2.5 L 50,7.5 L 55,2.5" fill="none" stroke="currentColor" strokeWidth="0.5" className="opacity-65" />
                          <line x1="41" y1="2.5" x2="59" y2="2.5" stroke="currentColor" strokeWidth="0.75" className="opacity-80" />
                          
                          <path d="M 45,137.5 L 50,132.5 L 55,137.5" fill="none" stroke="currentColor" strokeWidth="0.5" className="opacity-65" />
                          <line x1="41" y1="137.5" x2="59" y2="137.5" stroke="currentColor" strokeWidth="0.75" className="opacity-80" />
                        </svg>
                      )}

                      {/* POSTER CONTENTS START */}
                      <div className="relative z-10 w-full h-full flex flex-col justify-between p-2 md:p-4 font-sans">
                        
                        {/* 1. Header Stamp detail */}
                        <div className={`flex justify-between items-center text-[8px] md:text-[9.5px] pb-2 text-center border-b transition-all duration-300 ${
                          result && activeDecadeMood.decade === "1930s"
                            ? `${activeThemeConfig.accentBorder} ${activeThemeConfig.accent} font-deco tracking-[0.15em]`
                            : "border-white/5 text-slate-500 font-mono tracking-[0.16em]"
                        }`}>
                          <span>{activeDecadeMood.posterHeaderStamp}</span>
                          <span>{activeDecadeMood.posterYearEdition}</span>
                        </div>
 
                        {/* 2. Headline label */}
                        <div className="pt-2">
                          <span className={`text-[8.5px] md:text-[9.5px] uppercase text-center block leading-none transition-all duration-300 ${
                            result && activeDecadeMood.decade === "1930s"
                              ? `font-deco tracking-[0.24em] ${activeThemeConfig.accent} font-semibold`
                              : "font-mono tracking-[0.28em] font-extrabold text-[#ece7ff]"
                          }`}>{posterTitle}</span>
                        </div>
 
                        {/* 3. Massive Iconic Title */}
                        <div className="text-center pt-2 space-y-1">
                          <h2 
                            style={result && activeDecadeMood.decade === "1930s" ? {
                              backgroundImage: activeThemeConfig.goldGradient,
                              textShadow: "1px 1px 0px rgba(0,0,0,0.85)"
                            } : undefined}
                            className={`text-xl md:text-2xl uppercase text-center leading-normal line-clamp-2 px-3 transition-all duration-300 ${
                              result && activeDecadeMood.decade === "1930s"
                                ? `gold-foil-text font-deco tracking-[0.11em] font-semibold`
                                : `text-white ${activeDecadeMood.headingClass}`
                            }`}
                          >
                            {result.songTitle}
                          </h2>
                          {result && activeDecadeMood.decade === "1930s" && (
                            <div className="flex items-center justify-center py-0.5 opacity-65 select-none animate-none">
                              <span className={`${activeThemeConfig.accent} text-[7px] tracking-[0.25em]`}>✦ ❖ ✦</span>
                            </div>
                          )}
                          <p className={`text-[11px] md:text-xs font-serif italic text-center leading-none mt-1 transition-all duration-300 ${
                            result && activeDecadeMood.decade === "1930s" ? "text-[#fbf5eb] tracking-wide font-medium" : activeDecadeMood.accentClass
                          }`}>
                            by {result.artist}
                          </p>
                          <div className={`text-[7.5px] md:text-[8px] font-mono uppercase tracking-[0.18em] pt-1.5 max-w-xs mx-auto text-center border-t transition-all duration-300 ${
                            result && activeDecadeMood.decade === "1930s" ? `${activeThemeConfig.accentBorder} ${activeThemeConfig.accent} font-medium` : "border-white/[0.03] text-slate-500"
                          }`}>
                            {formatBillboardWeek(result.matchedChartWeek)}
                          </div>
                        </div>

                        {/* 4. Enriched High-Res Album Cover Core */}
                        <div className="my-3.5 flex justify-center items-center py-0.5">
                          {albumArtUrl && !hasAlbumArtError ? (
                            result && activeDecadeMood.decade === "1930s" ? (
                              /* 1930s Archival Mounted Framed Photo style */
                              <div className="relative p-2.5 bg-[#1b1511] border-[5px] border-[#382b1e] rounded-sm shadow-[0_12px_32px_rgba(10,8,6,0.9)] w-[11.5rem] h-[11.5rem] md:w-[13.5rem] md:h-[13.5rem] flex items-center justify-center">
                                {/* Bevel effect */}
                                <div className="absolute inset-0 border border-[#ab8a64]/15 pointer-events-none" />
                                {/* Ivory card matting */}
                                <div className="w-full h-full p-2 bg-[#f4ebd0] border border-[#cca97b]/30 flex items-center justify-center relative shadow-inner">
                                  {/* Fine photo corner mount brackets representing physical mounting tape corners */}
                                  <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#54412e] m-0.5 pointer-events-none" />
                                  <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#54412e] m-0.5 pointer-events-none" />
                                  <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#54412e] m-0.5 pointer-events-none" />
                                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#54412e] m-0.5 pointer-events-none" />
                                  
                                  {/* Actual photo print */}
                                  <div className="w-full h-full relative overflow-hidden border border-[#54412e]/25">
                                    <img 
                                      src={albumArtUrl} 
                                      alt={`${result.songTitle} Album Art`}
                                      className="w-full h-full object-cover select-none sepia-[0.55] brightness-[0.8] contrast-[0.95] saturate-[0.6] filter grayscale-[10%]"
                                      crossOrigin="anonymous"
                                      referrerPolicy="no-referrer"
                                      onError={() => {
                                        console.warn("[ARTWORK ERROR] Fallback portrait failed to load. Defaulting to fictional shellac record sleeve.");
                                        setHasAlbumArtError(true);
                                      }}
                                    />
                                    {/* Tone blending filter layers */}
                                    <div className="absolute inset-0 bg-[#ebdcb9]/15 mix-blend-color-burn pointer-events-none" />
                                    <div className="absolute inset-0 bg-black/15 pointer-events-none" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/15 pointer-events-none" />
                                    
                                    {/* Exquisite vintage frame title subtitle card */}
                                    {isVintagePortrait && vintagePortraitCaption && (
                                      <div className="absolute bottom-0 inset-x-0 bg-black/80 border-t border-[#cca97b]/25 px-1 py-0.5 text-center text-[#cca97b]/90 font-serif italic text-[5.5px] uppercase tracking-wider backdrop-blur-xs select-none leading-none truncate z-20">
                                        {vintagePortraitCaption}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              /* Standard floating modern art */
                              <div className="relative w-40 h-40 md:w-[11.5rem] md:h-[11.5rem] rounded-xl overflow-hidden border border-white/20 shadow-[0_20px_45px_rgba(0,0,0,0.85),_0_0_25px_rgba(99,102,241,0.12)] bg-slate-900 flex items-center justify-center">
                                <img 
                                  src={albumArtUrl} 
                                  alt={`${result.songTitle} Album Art`}
                                  className="w-full h-full object-cover select-none"
                                  crossOrigin="anonymous"
                                  referrerPolicy="no-referrer"
                                  onError={() => setHasAlbumArtError(true)}
                                />
                                <div className="absolute inset-0 bg-indigo-950/15 mix-blend-color pointer-events-none" />
                                <div className="absolute inset-0 bg-black/25 pointer-events-none" />
                                <div className="absolute inset-0 bg-radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.4) 100%) pointer-events-none" />
                                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 pointer-events-none" />
                                <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/85 border border-white/10 text-[6px] font-mono tracking-wider uppercase text-slate-300 rounded font-extrabold">
                                  {result.genre}
                                </span>
                              </div>
                            )
                          ) : (
                            /* Fallback shellac record style */
                            result && activeDecadeMood.decade === "1930s" ? (
                              /* Beautiful physical record sleeve */
                              <div className="relative p-[5px] bg-[#1b1511] border-[3px] border-[#382b1e] rounded-sm shadow-[0_12px_32px_rgba(10,8,6,0.9)] w-[11.5rem] h-[11.5rem] md:w-[13.5rem] md:h-[13.5rem] flex items-center justify-center overflow-hidden">
                                <div className="w-full h-full p-2 m-1 bg-[#f4ebd0] border border-[#cca97b]/30 flex flex-col justify-between items-center relative shadow-inner overflow-hidden">
                                  {/* Art Deco border on sleeve */}
                                  <div className="absolute inset-1 border border-[#4d3f32]/15 pointer-events-none" />
                                  <div className="absolute top-0.5 left-0.5 text-[#4d3f32]/30 text-[6px] font-serif pointer-events-none">❖</div>
                                  <div className="absolute top-0.5 right-0.5 text-[#4d3f32]/30 text-[6px] font-serif pointer-events-none">❖</div>
                                  <div className="absolute bottom-0.5 left-0.5 text-[#4d3f32]/30 text-[6px] font-serif pointer-events-none">❖</div>
                                  <div className="absolute bottom-0.5 right-0.5 text-[#4d3f32]/30 text-[6px] font-serif pointer-events-none">❖</div>

                                  {/* Circular record cut-out */}
                                  <div className="relative w-28 h-28 rounded-full bg-[#13110f] border-[3px] border-[#211a14] flex items-center justify-center shadow-lg overflow-hidden my-auto">
                                    <div className="absolute inset-1 rounded-full border border-white/[0.035]" />
                                    <div className="absolute inset-2 rounded-full border border-white/[0.015]" />
                                    <div className="absolute inset-3 rounded-full border border-[#cca97b]/5" />
                                    <div className="absolute inset-5 rounded-full border border-white/[0.02]" />
                                    <div className="absolute inset-7 rounded-full border border-white/[0.015]" />

                                    {/* Record label */}
                                    <div className="w-[3.25rem] h-[3.25rem] rounded-full bg-[#dbb076] border-2 border-[#1c1613]/50 flex flex-col items-center justify-between text-center p-1 shadow-inner relative z-10">
                                      <div className="absolute inset-0.5 rounded-full border border-[#1c1613]/10 pointer-events-none" />
                                      <span className="text-[3.5px] font-sans font-extrabold tracking-widest text-[#1c1613] mt-0.5 leading-none">SHELLAC</span>
                                      
                                      <div className="flex flex-col items-center justify-center flex-1 max-w-[42px] mt-0.5 leading-tight">
                                        <span className="text-[4px] font-serif font-black text-[#1c1613] uppercase truncate max-w-[40px]">{result.songTitle}</span>
                                        <span className="text-[3px] font-sans text-[#1c1613]/70 truncate max-w-[36px]">{result.artist}</span>
                                      </div>

                                      <div className="flex flex-col items-center justify-center w-full">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#13110f] border border-[#dbb076]" />
                                        <span className="text-[3px] font-mono text-[#1c1613]/60 font-bold uppercase tracking-wider mt-0.5">78 RPM</span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="text-[4.5px] font-serif font-medium tracking-wide text-[#4d3f32]/80 text-center uppercase pointer-events-none select-none">
                                    PRESERVED RECORDING
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="relative w-40 h-40 md:w-[11.5rem] md:h-[11.5rem] rounded-full shadow-[0_16px_36px_rgba(0,0,0,0.7)]">
                                <div className="absolute inset-0 rounded-full bg-[#111] border-[3px] border-zinc-805 flex items-center justify-center vinyl-spin animate-spin-slow">
                                  <div className="absolute inset-3 rounded-full border border-white/[0.03]" />
                                  <div className="absolute inset-6 rounded-full border border-white/[0.03]" />
                                  <div className="absolute inset-9 rounded-full border border-white/[0.03]" />
                                  <div className="absolute inset-12 rounded-full border border-white/[0.03]" />
                                  <div className={`w-12 h-12 rounded-full ${activeThemeConfig.recordBg || "bg-indigo-600"} border border-white/10 flex flex-col items-center justify-center shadow-inner`}>
                                    <div className="text-[4.5px] font-mono tracking-widest text-white/90 uppercase font-extrabold truncate max-w-[34px]">{result.genre}</div>
                                    <div className="w-2 h-2 rounded-full bg-[#0c0c10] border border-zinc-800 mt-0.5" />
                                  </div>
                                </div>
                                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent pointer-events-none" />
                              </div>
                            )
                          )}
                        </div>

                        {/* 5. Minimalist Splitted Split-Grip Info */}
                        <div className={`grid grid-cols-2 gap-4 text-left py-3 my-2 ${
                          result && activeDecadeMood.decade === "1930s" ? `border-y ${activeThemeConfig.accentBorder} font-serif` : "border-y border-white/5 font-mono"
                        }`}>
                          
                          {/* Horology context block */}
                          <div className="space-y-0.5">
                            <span className={`text-[6.5px] md:text-[7px] font-bold block uppercase tracking-widest ${
                              result && activeDecadeMood.decade === "1930s" ? activeThemeConfig.accent : activeDecadeMood.accentClass
                            }`}>I. ARRIVAL DATE</span>
                            <span className={`text-[9.5px] md:text-[11px] block truncate leading-tight tracking-tight ${
                              result && activeDecadeMood.decade === "1930s" ? "text-[#fbf5eb] font-semibold" : "text-white font-sans font-extrabold"
                            }`}>{result.userBirthdayFormatted || "October 25, 1995"}</span>
                            <span className={`text-[7.2px] md:text-[8px] block truncate leading-none flex items-center pt-0.5 ${
                              result && activeDecadeMood.decade === "1930s" ? "text-[#ecd8bf]/85" : "text-slate-500"
                            }`}>
                              <MapPin size={7} className={`mr-0.5 ${result && activeDecadeMood.decade === "1930s" ? `${activeThemeConfig.accent}/60` : "text-slate-600"}`} />
                              {posterCity || "Earth Coordinates"}
                            </span>
                          </div>

                          {/* Historical snapshot block */}
                          <div className={`space-y-0.5 pl-4 ${
                            result && activeDecadeMood.decade === "1930s" ? `border-l ${activeThemeConfig.accentBorder}` : "border-l border-white/5"
                          }`}>
                            <span className={`text-[6.5px] md:text-[7px] font-bold block uppercase tracking-widest ${
                              result && activeDecadeMood.decade === "1930s" ? activeThemeConfig.accent : activeDecadeMood.accentClass
                            }`}>II. SPOTLIGHT</span>
                            {posterSpotlight === "culture" && (
                              <>
                                <span className={`text-[9.5px] md:text-[11px] block truncate leading-tight tracking-tight ${
                                  result && activeDecadeMood.decade === "1930s" ? "text-[#fbf5eb] font-semibold" : "text-white font-sans font-extrabold"
                                }`}>The Era Vibe</span>
                                <span className={`text-[7.2px] md:text-[8px] block line-clamp-2 leading-snug ${
                                  result && activeDecadeMood.decade === "1930s" ? "text-[#ecd8bf]/90" : "text-slate-400"
                                }`}>{result.culturalSnapshot}</span>
                              </>
                            )}
                            {posterSpotlight === "movie" && (
                              <>
                                <span className={`text-[9.5px] md:text-[11px] block truncate leading-tight tracking-tight ${
                                  result && activeDecadeMood.decade === "1930s" ? "text-[#fbf5eb] font-semibold" : "text-white font-sans font-extrabold"
                                }`}>#1 Cinema Screen</span>
                                <span className={`text-[7.2px] md:text-[8px] block line-clamp-2 leading-snug ${
                                  result && activeDecadeMood.decade === "1930s" ? "text-[#ecd8bf]/90" : "text-slate-400"
                                }`}>“{result.movieTitle}”</span>
                              </>
                            )}
                            {posterSpotlight === "tv" && (
                              <>
                                <span className={`text-[9.5px] md:text-[11px] block truncate leading-tight tracking-tight ${
                                  result && activeDecadeMood.decade === "1930s" ? "text-[#fbf5eb] font-semibold" : "text-white font-sans font-extrabold"
                                }`}>Prime TV Cult</span>
                                <span className={`text-[7.2px] md:text-[8px] block line-clamp-2 leading-snug ${
                                  result && activeDecadeMood.decade === "1930s" ? "text-[#ecd8bf]/90" : "text-slate-400"
                                }`}>“{result.tvShowTitle}”</span>
                              </>
                            )}
                            {posterSpotlight === "star" && (
                              <>
                                <span className={`text-[9.5px] md:text-[11px] block truncate leading-tight tracking-tight ${
                                  result && activeDecadeMood.decade === "1930s" ? "text-[#fbf5eb] font-semibold" : "text-white font-sans font-extrabold"
                                }`}>Shared Birthday Icon</span>
                                <span className={`text-[7.2px] md:text-[8px] block line-clamp-2 leading-snug ${
                                  result && activeDecadeMood.decade === "1930s" ? "text-[#ecd8bf]/90" : "text-slate-400"
                                }`}>{getCelebrityInfo(result).name}</span>
                              </>
                            )}
                          </div>

                        </div>

                        {/* 6. Poetic Quote callquote Block */}
                        <div className={`my-1.5 text-center border rounded-xl p-2.5 tracking-wide backdrop-blur-3xl shadow-inner ${
                          result && activeDecadeMood.decade === "1930s"
                            ? `bg-[#1d1814]/70 ${activeThemeConfig.accentBorder}`
                            : "bg-white/[0.015] border-white/[0.04]"
                        }`}>
                          <p className={`text-[8.5px] md:text-[9.5px] font-serif leading-relaxed italic px-2 max-w-sm mx-auto ${
                            result && activeDecadeMood.decade === "1930s" ? "text-[#fbf5eb]" : "text-slate-350"
                          }`}>
                            “{result.emotionalSentence}”
                          </p>
                          {posterDedication && activeDecadeMood.decade !== "1930s" && (
                            <p className={`text-[7.5px] md:text-[8px] tracking-[0.2em] block uppercase font-extrabold border-t pt-2 mt-1.5 leading-none border-white/[0.04] ${activeDecadeMood.accentClass} font-sans`}>
                              {posterDedication}
                            </p>
                          )}
                        </div>

                        {/* 7. Barcode luxury footer code stamp */}
                        <div className={`flex justify-between items-end text-[6px] md:text-[6.5px] pt-2.5 border-t ${
                          result && activeDecadeMood.decade === "1930s" ? `${activeThemeConfig.accentBorder} ${activeThemeConfig.accent}/70 font-serif` : "border-white/5 text-slate-500 font-mono"
                        }`}>
                          <div className="flex flex-col text-left space-y-0.5">
                            <span>ARCHIVAL SOUNDTRACK MEMORY PRINT • RECORD NO. {((result.releaseYear || 1995) * 7).toString(16).toUpperCase()}</span>
                            <span>HISTORICAL MUSIC VERIFICATION CAPTURE • GRAPHIC DESIGN EDITION</span>
                          </div>
                          
                          {/* Aesthetic vector barcode stamp */}
                          <div className="flex items-end space-x-[1px] h-3.5 md:h-4 pr-1 opacity-35 shrink-0">
                            <div className={`w-[1px] h-full ${result && activeDecadeMood.decade === "1930s" ? activeThemeConfig.accent.replace("text-", "bg-").split("/")[0] : "bg-slate-500"}`}></div>
                            <div className={`w-[2px] h-full ${result && activeDecadeMood.decade === "1930s" ? activeThemeConfig.accent.replace("text-", "bg-").split("/")[0] : "bg-slate-500"}`}></div>
                            <div className={`w-[1px] h-2 ${result && activeDecadeMood.decade === "1930s" ? activeThemeConfig.accent.replace("text-", "bg-").split("/")[0] : "bg-slate-500"}`}></div>
                            <div className={`w-[1px] h-full ${result && activeDecadeMood.decade === "1930s" ? activeThemeConfig.accent.replace("text-", "bg-").split("/")[0] : "bg-slate-500"}`}></div>
                            <div className={`w-[3px] h-full ${result && activeDecadeMood.decade === "1930s" ? activeThemeConfig.accent.replace("text-", "bg-").split("/")[0] : "bg-slate-500"}`}></div>
                            <div className={`w-[1.5px] h-1 ${result && activeDecadeMood.decade === "1930s" ? activeThemeConfig.accent.replace("text-", "bg-").split("/")[0] : "bg-slate-500"}`}></div>
                            <div className={`w-[2px] h-full ${result && activeDecadeMood.decade === "1930s" ? activeThemeConfig.accent.replace("text-", "bg-").split("/")[0] : "bg-slate-500"}`}></div>
                            <div className={`w-[1px] h-full ${result && activeDecadeMood.decade === "1930s" ? activeThemeConfig.accent.replace("text-", "bg-").split("/")[0] : "bg-slate-500"}`}></div>
                          </div>
                        </div>

                      </div>
                      {/* POSTER CONTENTS END */}

                    </div>

                    <p className="text-[10px] text-slate-500 font-mono leading-normal max-w-md text-center tracking-tight">
                       💡 Custom Artpiece Tip: Toggling colorways and spotlight elements update the artwork immediately.
                    </p>

                  </div>

                </div>
              </div>

              {/* HIDDEN HIGH-RESOLUTION PRINT POSTER FOR HTML2CANVAS COMPILING */}
              <div className="absolute left-[-9999px] top-[-9999px] pointer-events-none overflow-hidden select-none font-sans">
                <div 
                  id="high-res-keepsake-poster" 
                  style={result && activeDecadeMood.decade === "1930s" ? {
                    width: "800px", height: "1120px",
                    backgroundColor: activeThemeConfig.backgroundColor,
                    backgroundImage: activeThemeConfig.paperBgImage,
                    backgroundBlendMode: activeThemeConfig.paperBlendMode as any
                  } : { width: "800px", height: "1120px" }}
                  className={`relative flex flex-col justify-between p-16 overflow-hidden text-slate-100 border-[16px] rounded-3xl transition-all duration-1000 ${
                    result && activeDecadeMood.decade === "1930s"
                      ? `${activeThemeConfig.shadowClass} ${activeThemeConfig.outerPaperClass} ring-2 ring-[#cca97b]/20 film-grain-1930s`
                      : "bg-[#08080a] border-[#131317] film-grain"
                  }`}
                >
                  {/* Background atmospheric gradient theme matching preview */}
                  <div 
                    className="absolute inset-0"
                    style={{
                      background: activeThemeConfig.vignette
                    }}
                  />

                  {/* Double frame editorial border */}
                  <div className={`absolute inset-8 border-2 rounded-2xl pointer-events-none ${
                    result && activeDecadeMood.decade === "1930s" ? activeThemeConfig.lineContrast : "border-white/5"
                  }`} />
                  <div className={`absolute inset-10 border rounded-2xl pointer-events-none ${
                    result && activeDecadeMood.decade === "1930s" ? "border-[#2e2217]/50" : "border-white/5"
                  }`} />

                  {/* 1930s Museum Registry collector mark / Private Archive stamp overlay */}
                  {result && activeDecadeMood.decade === "1930s" && posterDedication && (
                    <div className="absolute bottom-[35px] left-0 right-0 text-center z-20 pointer-events-none">
                      <span className={`inline-block px-3 py-[2px] bg-neutral-950/25 rounded-[1px] border border-[#cca97b]/8 uppercase font-serif italic text-[8.5px] tracking-[0.22em] ${activeThemeConfig.accent} opacity-40 backdrop-blur-[0.5px]`}>
                        {format1930sDedication(posterDedication)}
                      </span>
                    </div>
                  )}

                  {/* Authentic 1930s Art Deco Symmetrical Geometric Border System overlay (SVG) */}
                  {result && activeDecadeMood.decade === "1930s" && (
                    <svg className={`absolute inset-8 w-[calc(100%-64px)] h-[calc(100%-64px)] pointer-events-none transition-all duration-1000 ${activeThemeConfig.accent}`} viewBox="0 0 100 140" preserveAspectRatio="none">
                      <rect x="1" y="1" width="98" height="138" fill="none" stroke="currentColor" strokeWidth="0.45" className="opacity-40" />
                      <rect x="2.5" y="2.5" width="95" height="135" fill="none" stroke="currentColor" strokeWidth="0.75" className="opacity-60" />
                      <rect x="4" y="4" width="92" height="132" fill="none" stroke="currentColor" strokeWidth="0.3" className="opacity-25" />
                      
                      <path d="M 1,12 L 12,1 L 12,5 L 5,12 Z" fill="none" stroke="currentColor" strokeWidth="0.4" className="opacity-50" />
                      <line x1="2.5" y1="2.5" x2="15" y2="2.5" stroke="currentColor" strokeWidth="0.6" className="opacity-70" />
                      <line x1="2.5" y1="2.5" x2="2.5" y2="15" stroke="currentColor" strokeWidth="0.6" className="opacity-70" />
                      <line x1="4.5" y1="4.5" x2="11" y2="4.5" stroke="currentColor" strokeWidth="0.45" className="opacity-45" />
                      <line x1="4.5" y1="4.5" x2="4.5" y2="11" stroke="currentColor" strokeWidth="0.45" className="opacity-45" />

                      <path d="M 99,12 L 88,1 L 88,5 L 95,12 Z" fill="none" stroke="currentColor" strokeWidth="0.4" className="opacity-50" />
                      <line x1="97.5" y1="2.5" x2="85" y2="2.5" stroke="currentColor" strokeWidth="0.6" className="opacity-70" />
                      <line x1="97.5" y1="2.5" x2="97.5" y2="15" stroke="currentColor" strokeWidth="0.6" className="opacity-70" />
                      <line x1="95.5" y1="4.5" x2="89" y2="4.5" stroke="currentColor" strokeWidth="0.45" className="opacity-45" />
                      <line x1="95.5" y1="4.5" x2="95.5" y2="11" stroke="currentColor" strokeWidth="0.45" className="opacity-45" />

                      <path d="M 1,128 L 12,139 L 12,135 L 5,128 Z" fill="none" stroke="currentColor" strokeWidth="0.4" className="opacity-50" />
                      <line x1="2.5" y1="137.5" x2="15" y2="137.5" stroke="currentColor" strokeWidth="0.6" className="opacity-70" />
                      <line x1="2.5" y1="137.5" x2="2.5" y2="125" stroke="currentColor" strokeWidth="0.6" className="opacity-70" />
                      <line x1="4.5" y1="135.5" x2="11" y2="135.5" stroke="currentColor" strokeWidth="0.45" className="opacity-45" />
                      <line x1="4.5" y1="135.5" x2="4.5" y2="129" stroke="currentColor" strokeWidth="0.45" className="opacity-45" />

                      <path d="M 99,128 L 88,139 L 88,135 L 94,128 Z" fill="none" stroke="currentColor" strokeWidth="0.4" className="opacity-50" />
                      <line x1="97.5" y1="137.5" x2="85" y2="137.5" stroke="currentColor" strokeWidth="0.6" className="opacity-70" />
                      <line x1="97.5" y1="137.5" x2="97.5" y2="125" stroke="currentColor" strokeWidth="0.6" className="opacity-70" />
                      <line x1="95.5" y1="135.5" x2="89" y2="135.5" stroke="currentColor" strokeWidth="0.45" className="opacity-45" />
                      <line x1="95.5" y1="135.5" x2="95.5" y2="129" stroke="currentColor" strokeWidth="0.45" className="opacity-45" />

                      <path d="M 45,2.5 L 50,7.5 L 55,2.5" fill="none" stroke="currentColor" strokeWidth="0.5" className="opacity-65" />
                      <line x1="41" y1="2.5" x2="59" y2="2.5" stroke="currentColor" strokeWidth="0.75" className="opacity-80" />
                      
                      <path d="M 45,137.5 L 50,132.5 L 55,137.5" fill="none" stroke="currentColor" strokeWidth="0.5" className="opacity-65" />
                      <line x1="41" y1="137.5" x2="59" y2="137.5" stroke="currentColor" strokeWidth="0.75" className="opacity-80" />
                    </svg>
                  )}
                  
                  {/* Header stamp metadata info */}
                  <div className={`relative z-10 flex justify-between items-center text-xs pb-4 border-b ${
                    result && activeDecadeMood.decade === "1930s"
                      ? `${activeThemeConfig.accentBorder} ${activeThemeConfig.accent} font-deco tracking-[0.15em]`
                      : "border-white/15 text-slate-500 font-mono tracking-[0.25em]"
                  }`}>
                    <span>{activeDecadeMood.posterHeaderStamp}</span>
                    <span>{activeDecadeMood.posterYearEdition}</span>
                  </div>

                  {/* 1. Headline Theme Identifier */}
                  <div className="relative z-10 text-center pt-4">
                    <span className={`text-[12px] uppercase block transition-all duration-300 ${
                      result && activeDecadeMood.decade === "1930s"
                        ? `font-deco tracking-[0.24em] ${activeThemeConfig.accent} font-semibold`
                        : `font-mono tracking-[0.28em] font-bold ${activeDecadeMood.accentClass}`
                    }`}>
                      {posterTitle}
                    </span>
                  </div>

                  {/* 2. Giant Song Title & Artist Display */}
                  <div className="relative z-10 text-center space-y-2 pt-2">
                    <h2 className={`text-4xl uppercase text-center max-w-2xl mx-auto line-clamp-2 ${
                      result && activeDecadeMood.decade === "1930s"
                        ? `gold-foil-text font-deco tracking-[0.11em] font-semibold`
                        : `text-white ${activeDecadeMood.headingClass}`
                    }`} style={result && activeDecadeMood.decade === "1930s" ? {
                      backgroundImage: activeThemeConfig.goldGradient,
                      textShadow: "1.5px 1.5px 0px rgba(0,0,0,0.85)",
                      wordSpacing: "0.06em"
                    } : { wordSpacing: "0.06em" }}>
                      {result.songTitle}
                    </h2>
                    {result && activeDecadeMood.decade === "1930s" && (
                      <div className="flex items-center justify-center py-1 opacity-65 select-none">
                        <span className={`${activeThemeConfig.accent} text-[11px] tracking-[0.28em]`}>✦ ❖ ✦</span>
                      </div>
                    )}
                    <p className={`text-sm font-serif italic text-center transition-all duration-300 ${
                      result && activeDecadeMood.decade === "1930s" ? "text-[#fbf5eb] tracking-wide font-medium" : activeDecadeMood.accentClass
                    }`}>
                      by {result.artist}
                    </p>
                    <div className={`text-[9px] font-mono uppercase tracking-[0.2em] pt-1.5 transition-all duration-300 ${
                      result && activeDecadeMood.decade === "1930s" ? `${activeThemeConfig.accentBorder} ${activeThemeConfig.accent} font-medium` : "text-slate-500"
                    }`}>
                      {formatBillboardWeek(result.matchedChartWeek)}
                    </div>
                  </div>

                  {/* 3. High-Res Vinyl Record Centerpiece or Album Cover Graphic */}
                  <div className="relative z-10 flex justify-center items-center my-4.5">
                    {albumArtUrl && !hasAlbumArtError ? (
                      result && activeDecadeMood.decade === "1930s" ? (
                        /* 1930s Archival Mounted Framed Photo style */
                        <div className="relative p-5 bg-[#1b1511] border-[10px] border-[#382b1e] rounded-sm shadow-[0_22px_55px_rgba(10,8,6,0.92)] w-[360px] h-[360px] flex items-center justify-center">
                          {/* Bevel effect */}
                          <div className="absolute inset-0 border border-[#ab8a64]/15 pointer-events-none" />
                          {/* Ivory card matting */}
                          <div className="w-full h-full p-4 bg-[#f4ebd0] border border-[#cca97b]/30 flex items-center justify-center relative shadow-inner">
                            {/* Fine photo corner mount brackets representing physical mounting tape corners */}
                            <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#54412e] m-1 pointer-events-none" />
                            <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-[#54412e] m-1 pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-[#54412e] m-1 pointer-events-none" />
                            <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#54412e] m-1 pointer-events-none" />
                            
                            {/* Actual photo print */}
                            <div className="w-full h-full relative overflow-hidden border border-[#54412e]/25">
                              <img 
                                src={albumArtUrl} 
                                alt={`${result.songTitle} Album Art`}
                                className="w-full h-full object-cover select-none sepia-[0.55] brightness-[0.8] contrast-[0.95] saturate-[0.6] filter grayscale-[10%]"
                                crossOrigin="anonymous"
                                referrerPolicy="no-referrer"
                                onError={() => setHasAlbumArtError(true)}
                              />
                              {/* Tone blending filter layers */}
                              <div className="absolute inset-0 bg-[#ebdcb9]/15 mix-blend-color-burn pointer-events-none" />
                              <div className="absolute inset-0 bg-black/15 pointer-events-none" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/15 pointer-events-none" />
                              
                              {/* Exquisite vintage frame title subtitle card */}
                              {isVintagePortrait && vintagePortraitCaption && (
                                <div className="absolute bottom-0 inset-x-0 bg-black/80 border-t border-[#cca97b]/25 px-2 py-1 text-center text-[#cca97b]/90 font-serif italic text-[8px] uppercase tracking-wider backdrop-blur-xs select-none leading-normal truncate z-20">
                                  {vintagePortraitCaption}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Standard floating high-res album cover styling */
                        <div 
                          className="relative w-80 h-80 rounded-xl overflow-hidden border flex items-center justify-center bg-slate-950 border-white/25 shadow-[0_22px_55px_rgba(0,0,0,0.85)]"
                        >
                          <img 
                            src={albumArtUrl} 
                            alt={`${result.songTitle} Cover Art`}
                            className="w-full h-full object-cover select-none"
                            crossOrigin="anonymous"
                            referrerPolicy="no-referrer"
                            onError={() => setHasAlbumArtError(true)}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/15 pointer-events-none" />
                          <div className="absolute inset-0 ring-1 ring-inset ring-white/15 pointer-events-none" />
                          <span className="absolute bottom-4 right-4 px-3 py-1 bg-black/85 border border-white/10 text-[9px] font-mono tracking-widest uppercase text-slate-350 rounded font-bold">
                            {result.genre}
                          </span>
                        </div>
                      )
                    ) : (
                      result && activeDecadeMood.decade === "1930s" ? (
                        /* Beautiful physical record sleeve */
                        <div className="relative p-5 bg-[#1b1511] border-[10px] border-[#382b1e] rounded-sm shadow-[0_22px_55px_rgba(10,8,6,0.92)] w-[360px] h-[360px] flex items-center justify-center overflow-hidden">
                          {/* Rich vintage fiber sleeve textures */}
                          <div className="absolute inset-0 bg-[#f4ebd0] p-4 m-2.5 border border-[#cca97b]/30 flex flex-col justify-between items-center relative shadow-inner overflow-hidden">
                            {/* Symmetric Art Deco elegant corners printed on the vintage sleeve cardboard */}
                            <div className="absolute inset-2 border border-[#4d3f32]/25 rounded-xs pointer-events-none" />
                            {/* Corner Flourishes */}
                            <div className="absolute top-1.5 left-1.5 text-[#4d3f32]/40 text-xs font-serif select-none pointer-events-none">❖</div>
                            <div className="absolute top-1.5 right-1.5 text-[#4d3f32]/40 text-xs font-serif select-none pointer-events-none">❖</div>
                            <div className="absolute bottom-1.5 left-1.5 text-[#4d3f32]/40 text-xs font-serif select-none pointer-events-none">❖</div>
                            <div className="absolute bottom-1.5 right-1.5 text-[#4d3f32]/40 text-xs font-serif select-none pointer-events-none">❖</div>

                            {/* Circular sleeve label cutout showing the physical Shellac 78 record */}
                            <div className="relative w-72 h-72 rounded-full bg-[#13110f] border-[8px] border-[#211a14] flex items-center justify-center shadow-2xl overflow-hidden">
                              {/* Shellac circular grooves representing physical vinyl record tracks */}
                              <div className="absolute inset-2 rounded-full border border-white/[0.03]" />
                              <div className="absolute inset-5 rounded-full border border-white/[0.02]" />
                              <div className="absolute inset-9 rounded-full border border-[#cca97b]/5" />
                              <div className="absolute inset-12 rounded-full border border-white/[0.03]" />
                              <div className="absolute inset-16 rounded-full border border-white/[0.01]" />
                              <div className="absolute inset-20 rounded-full border border-white/[0.035]" />
                              <div className="absolute inset-24 rounded-full border border-white/[0.015]" />
                              
                              {/* Authentic heavy gold foil stamp record label */}
                              <div className="w-32 h-32 rounded-full bg-[#cda97c] border-[5px] border-[#291e13]/60 flex flex-col items-center justify-between text-center p-3 shadow-inner relative z-10 select-none">
                                {/* Subtle concentric gold rings of the label print */}
                                <div className="absolute inset-1.5 rounded-full border border-[#291e13]/15 pointer-events-none" />
                                <div className="absolute inset-2 rounded-full border border-[#291e13]/10 pointer-events-none" />
                                <div className="absolute inset-3.5 rounded-full border border-dashed border-[#291e13]/15 pointer-events-none" />

                                <div className="text-[7.5px] font-deco font-extrabold tracking-[0.22em] text-[#1c1613] mt-0.5 uppercase">CHRONOSOPHIC</div>
                                
                                <div className="flex flex-col items-center justify-center flex-1 max-w-[100px] mt-1 space-y-0.5">
                                  {/* Beautifully styled song title */}
                                  <span className="text-[10px] font-serif font-black leading-tight text-[#1c1613] uppercase drop-shadow-sm line-clamp-2">
                                    {result.songTitle}
                                  </span>
                                  {/* Artist billing */}
                                  <span className="text-[6.5px] font-sans font-bold tracking-tight leading-none text-[#1c1613]/85 truncate max-w-[90px]">
                                    {result.artist}
                                  </span>
                                </div>

                                <div className="flex flex-col items-center justify-center w-full mt-1">
                                  {/* Center spindle hole */}
                                  <div className="w-4 h-4 rounded-full bg-[#13110f] border-2 border-[#cda97b] shadow-md flex items-center justify-center">
                                    <div className="w-1 h-1 rounded-full bg-transparent" />
                                  </div>
                                  <span className="text-[5.5px] font-mono font-bold text-[#1c1613]/70 tracking-widest mt-1 uppercase">78 R.P.M. RECORD</span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Vintage typography printed on sleeve footer representing factory labels */}
                            <div className="text-[6.5px] font-serif font-medium tracking-[0.16em] text-[#4d3f32]/85 text-center uppercase">
                              PRESERVED FOR RE-BROADCASTING WITH DE LUXE FIDELITY
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="relative w-80 h-80 rounded-full bg-[#111] border-[10px] border-[#0c0c10] shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex items-center justify-center">
                          <div className="absolute inset-8 rounded-full border border-white/[0.035]" />
                          <div className="absolute inset-16 rounded-full border border-white/[0.035]" />
                          <div className="absolute inset-24 rounded-full border border-white/[0.035]" />
                          <div className="absolute inset-32 rounded-full border border-white/[0.035]" />
                          <div className={`w-28 h-28 rounded-full ${activeThemeConfig.recordBg || "bg-indigo-600"} border border-white/10 flex flex-col items-center justify-center shadow-inner`}>
                            <span className="text-[9px] font-mono tracking-widest text-white font-extrabold uppercase truncate max-w-[80px]">{result.genre}</span>
                            <div className="w-4 h-4 bg-[#08080a] rounded-full border border-zinc-800 mt-2" />
                          </div>
                          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent" />
                        </div>
                      )
                    )}
                  </div>

                  {/* 4. Supporting Nostalgia split grid */}
                  <div className={`relative z-10 grid grid-cols-2 gap-10 text-left py-6 my-2.5 ${
                    result && activeDecadeMood.decade === "1930s" ? `border-y ${activeThemeConfig.accentBorder} font-deco` : "border-y border-white/10 font-mono"
                  }`}>
                    
                    {/* Column A: Horology details */}
                    <div className="space-y-1">
                      <span className={`text-[10px] font-bold block uppercase tracking-wider ${
                        result && activeDecadeMood.decade === "1930s" ? activeThemeConfig.accent : activeDecadeMood.accentClass
                      }`}>I. ARRIVAL DATE</span>
                      <span className={`text-base block font-bold leading-tight ${
                        result && activeDecadeMood.decade === "1930s" ? "text-[#fbf5eb] font-semibold" : "text-white font-sans"
                      }`}>{result.userBirthdayFormatted || "October 25, 1995"}</span>
                      <span className={`text-[11px] block tracking-wide truncate flex items-center ${
                        result && activeDecadeMood.decade === "1930s" ? "text-[#ecd8bf]/85" : "text-slate-400"
                      }`}>
                        <MapPin size={10} className={`mr-1 ${result && activeDecadeMood.decade === "1930s" ? `${activeThemeConfig.accent}/60` : "text-slate-500"}`} />
                        {posterCity || "Earth Coordinates"}
                      </span>
                    </div>

                    {/* Column B: Selected Spotlights */}
                    <div className={`space-y-1 pl-8 ${
                      result && activeDecadeMood.decade === "1930s" ? `border-l ${activeThemeConfig.accentBorder}` : "border-l border-white/10"
                    }`}>
                      <span className={`text-[10px] font-bold block uppercase tracking-wider ${
                        result && activeDecadeMood.decade === "1930s" ? activeThemeConfig.accent : activeDecadeMood.accentClass
                      }`}>II. SPOTLIGHT</span>
                      {posterSpotlight === "culture" && (
                        <>
                          <span className={`text-[12px] block truncate leading-tight ${
                            result && activeDecadeMood.decade === "1930s" ? "text-[#fbf5eb] font-semibold" : "text-white font-sans font-bold"
                          }`}>The Era Vibe</span>
                          <span className={`text-[10.5px] block leading-relaxed line-clamp-3 ${
                            result && activeDecadeMood.decade === "1930s" ? "text-[#ecd8bf]/90" : "text-slate-350"
                          }`}>{result.culturalSnapshot}</span>
                        </>
                      )}
                      {posterSpotlight === "movie" && (
                        <>
                          <span className={`text-[12px] block truncate leading-tight ${
                            result && activeDecadeMood.decade === "1930s" ? "text-[#fbf5eb] font-semibold" : "text-white font-sans font-bold"
                          }`}>#1 Box Office Cinema</span>
                          <span className={`text-[10.5px] block leading-relaxed line-clamp-3 ${
                            result && activeDecadeMood.decade === "1930s" ? "text-[#ecd8bf]/90" : "text-slate-350"
                          }`}>“{result.movieTitle}”</span>
                        </>
                      )}
                      {posterSpotlight === "tv" && (
                        <>
                          <span className={`text-[12px] block truncate leading-tight ${
                            result && activeDecadeMood.decade === "1930s" ? "text-[#fbf5eb] font-semibold" : "text-white font-sans font-bold"
                          }`}>Prime TV Hit</span>
                          <span className={`text-[10.5px] block leading-relaxed line-clamp-3 ${
                            result && activeDecadeMood.decade === "1930s" ? "text-[#ecd8bf]/90" : "text-slate-350"
                          }`}>“{result.tvShowTitle}”</span>
                        </>
                      )}
                      {posterSpotlight === "star" && (
                        <>
                          <span className={`text-[12px] block truncate leading-tight ${
                            result && activeDecadeMood.decade === "1930s" ? "text-[#fbf5eb] font-semibold" : "text-white font-sans font-bold"
                          }`}>Shared Birthday Icon</span>
                          <span className={`text-[10.5px] block leading-relaxed line-clamp-3 ${
                            result && activeDecadeMood.decade === "1930s" ? "text-[#ecd8bf]/90" : "text-slate-350"
                          }`}>{getCelebrityInfo(result).name}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* 5. Poetic Quote callquote Block */}
                  <div className={`relative z-10 text-center my-3.5 border rounded-2xl p-6.5 tracking-wide ${
                    result && activeDecadeMood.decade === "1930s"
                      ? `bg-[#1d1814]/70 ${activeThemeConfig.accentBorder}`
                      : "bg-white/[0.015] border border-white/5"
                  }`}>
                    <p className={`text-sm font-serif leading-relaxed italic max-w-xl mx-auto ${
                      result && activeDecadeMood.decade === "1930s" ? "text-[#fbf5eb]" : "text-slate-300"
                    }`}>
                      “{result.emotionalSentence}”
                    </p>
                    {posterDedication && activeDecadeMood.decade !== "1930s" && (
                      <p className={`text-xs tracking-widest block uppercase font-bold border-t pt-3 mt-3 border-white/5 ${activeDecadeMood.accentClass} font-sans`}>
                        {posterDedication}
                      </p>
                    )}
                  </div>

                  {/* 6. Footer Stamp details & decoration */}
                  <div className={`relative z-10 flex justify-between items-end text-[8px] pt-6 border-t ${
                    result && activeDecadeMood.decade === "1930s" ? `${activeThemeConfig.accentBorder} ${activeThemeConfig.accent}/75 font-deco` : "border-white/5 text-slate-500 font-mono"
                  }`}>
                    <div className="flex flex-col text-left space-y-0.5">
                      <span>CHRONOLOGY ARTIFACT OF SOUND • KEEPSAKE COMMEMORATIVE PRINT</span>
                      <span>GENUINE HISTORICAL BILLBOARD RECORD VERIFICATION • ARCHIVAL CLAY COLOR BLENDS</span>
                    </div>
                    
                    <div className="flex items-end space-x-[2px] h-6 pr-2 opacity-35">
                      <div className={`w-[1px] h-full ${result && activeDecadeMood.decade === "1930s" ? activeThemeConfig.accent.replace("text-", "bg-").split("/")[0] : "bg-slate-500"}`}></div>
                      <div className={`w-[3px] h-full ${result && activeDecadeMood.decade === "1930s" ? activeThemeConfig.accent.replace("text-", "bg-").split("/")[0] : "bg-slate-500"}`}></div>
                      <div className={`w-[1px] h-4 ${result && activeDecadeMood.decade === "1930s" ? activeThemeConfig.accent.replace("text-", "bg-").split("/")[0] : "bg-slate-500"}`}></div>
                      <div className={`w-[1px] h-full ${result && activeDecadeMood.decade === "1930s" ? activeThemeConfig.accent.replace("text-", "bg-").split("/")[0] : "bg-slate-500"}`}></div>
                      <div className={`w-[4px] h-full ${result && activeDecadeMood.decade === "1930s" ? activeThemeConfig.accent.replace("text-", "bg-").split("/")[0] : "bg-slate-500"}`}></div>
                      <div className={`w-[1.5px] h-2 ${result && activeDecadeMood.decade === "1930s" ? activeThemeConfig.accent.replace("text-", "bg-").split("/")[0] : "bg-slate-500"}`}></div>
                      <div className={`w-[3px] h-full ${result && activeDecadeMood.decade === "1930s" ? activeThemeConfig.accent.replace("text-", "bg-").split("/")[0] : "bg-slate-500"}`}></div>
                      <div className={`w-[1px] h-full ${result && activeDecadeMood.decade === "1930s" ? activeThemeConfig.accent.replace("text-", "bg-").split("/")[0] : "bg-slate-500"}`}></div>
                      <div className={`w-[2.5px] h-full ${result && activeDecadeMood.decade === "1930s" ? activeThemeConfig.accent.replace("text-", "bg-").split("/")[0] : "bg-slate-500"}`}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: SEO/AI-Friendly FAQ Section (Repositioned lower on the page) */}
              <section id="birthday-song-faq" className="pt-24 border-t border-white/5 mt-24 max-w-2xl mx-auto text-left space-y-8">
                <div>
                  <h2 className="text-lg md:text-xl font-sans font-bold text-slate-300 tracking-tight leading-tight mb-1.5 flex items-center space-x-2">
                    <HelpCircle size={18} className="text-indigo-400 shrink-0" />
                    <span>About Your Musical Arrival</span>
                  </h2>
                  <p className="text-xs text-slate-550 font-sans">Frequently asked questions and timeline details regarding your historical birthday soundtrack.</p>
                </div>

                <div className="divide-y divide-white/5 max-w-2xl">
                  <div className="py-4 first:pt-0">
                    <h3 className="text-sm font-sans font-semibold text-white tracking-tight pb-1">
                      How is the birthday song selected?
                    </h3>
                    <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-sans font-normal">
                      The birthday song is selected from Billboard #1 chart history for the chart week connected to your birth date.
                    </p>
                  </div>

                  <div className="py-4">
                    <h3 className="text-sm font-sans font-semibold text-white tracking-tight pb-1">
                      Why does the Billboard week date sometimes differ from my exact birthday?
                    </h3>
                    <p className="text-xs md:text-sm text-slate-405 leading-relaxed font-sans font-normal">
                      Billboard charts are organized by chart weeks, so the #1 song may be tied to the Billboard week that includes or represents your birthday, not always the exact calendar day.
                    </p>
                  </div>

                  <div className="py-4">
                    <h3 className="text-sm font-sans font-semibold text-white tracking-tight pb-1">
                      Can two birthdays have the same #1 song?
                    </h3>
                    <p className="text-xs md:text-sm text-slate-405 leading-relaxed font-sans font-normal">
                      Yes. A song can stay at #1 for multiple weeks, so many birthdays may share the same soundtrack.
                    </p>
                  </div>

                  <div className="py-4">
                    <h3 className="text-sm font-sans font-semibold text-white tracking-tight pb-1">
                      Is this the song from the day I was born or the chart week?
                    </h3>
                    <p className="text-xs md:text-sm text-slate-405 leading-relaxed font-sans font-normal">
                      This result is based on the Billboard chart week connected to your birthday.
                    </p>
                  </div>
                </div>
              </section>

              {/* Emotional Weather Cross-Link Section */}
              <div className="pt-10 border-t border-white/5 mt-10 text-center max-w-xl mx-auto space-y-4">
                <div className="flex justify-center">
                  <div className="inline-flex items-center justify-center h-11 w-11 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.15)]">
                    <CloudRain size={20} className="stroke-[1.5]" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-base md:text-lg font-sans font-medium text-indigo-100 tracking-tight">
                    🌧️ Want to know what the sky felt like that day too?
                  </h4>
                  <p className="text-xs text-slate-400/90 font-sans max-w-md mx-auto leading-relaxed">
                    Uncover the skies, storms, or sunshine that welcomed my story.
                  </p>
                </div>
                <div className="pt-1">
                  <a 
                    href={`https://www.google.com/search?q=${encodeURIComponent(`historical weather on ${result.userBirthdayFormatted}`)}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-950/80 to-purple-950/80 hover:from-indigo-900/80 hover:to-purple-900/80 text-indigo-200 hover:text-indigo-100 font-sans text-xs font-semibold tracking-wide px-4.5 py-2.5 rounded-full transition-all duration-300 border border-indigo-500/30 hover:border-indigo-500/50 hover:shadow-[0_0_15px_rgba(99,102,241,0.25)] hover:scale-[1.02] active:scale-98 cursor-pointer"
                  >
                    <span>Explore the Weather Story</span>
                    <ArrowRight size={11} className="text-indigo-400" />
                  </a>
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

        {/* Minimal Immersive Footer tags */}
        <div className="flex flex-wrap gap-12 justify-center items-center opacity-40 text-[10px] tracking-[0.25em] font-bold font-sans uppercase pt-12 border-t border-white/5 select-none text-indigo-200">
          <div>Billboard Hot 100</div>
          <div>Nostalgic Moments</div>
          <div>Cultural Archive</div>
        </div>

        {/* Small subtle footer credit line */}
        <footer className="text-center text-gray-500 text-[10px] font-mono mt-8 pt-4">
          <p>© {new Date().getFullYear()} RetroWave Reveal. Music insights retrieved factually from our historical charts database.</p>
        </footer>

      </div>
    </div>
  );
}
