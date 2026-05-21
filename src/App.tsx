import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Music, Sparkles, Tv, Film, Disc, Calendar, Share2, Copy, 
  RotateCcw, History, ArrowRight, Play, Volume2, Info, Star, HelpCircle
} from "lucide-react";
import { NostalgiaResult, SavedSearch } from "./types";

// Generates a dynamic atmospheric color mesh gradient based on music genre
function getGenreTheme(genre: string = "") {
  const g = genre.toLowerCase();
  if (g.includes("rock") || g.includes("grunge") || g.includes("alternative")) {
    return {
      gradient: "from-amber-600/30 via-red-900/40 to-slate-950",
      accent: "text-red-400Bg",
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

  const resultSectionRef = useRef<HTMLDivElement>(null);

  // Loading messages sequence
  const loadingSteps = [
    "Spinning up the historical reel-to-reel deck...",
    "Tuning into American airwaves & billboard frequencies...",
    "Retrieving the box office registers & cultural charts...",
    "Polishing the custom groove for your arrival snapshot..."
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

  // Load Search History on mount
  useEffect(() => {
    const saved = localStorage.getItem("birthday_reveal_history");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history archive", e);
      }
    }
  }, []);

  // Sync to local storage
  const saveToHistory = (newResult: NostalgiaResult, formattedDate: string) => {
    const searchId = btoa(formattedDate);
    const existingIndex = history.findIndex((item) => item.id === searchId);
    
    let updatedHistory = [...history];
    if (existingIndex !== -1) {
      updatedHistory.splice(existingIndex, 1); // Remove old duplicate
    }
    
    const newSearch: SavedSearch = {
      id: searchId,
      birthDate: formattedDate,
      data: newResult,
      timestamp: Date.now()
    };

    updatedHistory = [newSearch, ...updatedHistory].slice(0, 8); // Keep up to 8 searches
    setHistory(updatedHistory);
    localStorage.setItem("birthday_reveal_history", JSON.stringify(updatedHistory));
  };

  const deleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = history.filter((item) => item.id !== id);
    setHistory(updated);
    localStorage.setItem("birthday_reveal_history", JSON.stringify(updated));
  };

  // Pre-validate date
  const handleReveal = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!month || !day || !year) {
      setError("Please key in your month, day, and year of birth.");
      return;
    }

    const numericYear = parseInt(year);
    const numericMonth = parseInt(month);
    const numericDay = parseInt(day);

    if (isNaN(numericYear) || numericYear < 1920 || numericYear > 2026) {
      setError("The entered year is outside the available database range of 1920 to 2026.");
      return;
    }

    // Convert the entered birthday into a real Date object and validate it
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
        throw new Error(errorData.error || "Charts were updated weekly, so we matched your birthday to the closest Billboard chart week.");
      }

      const data: NostalgiaResult = await response.json();
      setResult(data);
      saveToHistory(data, formattedDate);

      // Scroll to view result smoothly
      setTimeout(() => {
        resultSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Charts were updated weekly, so we matched your birthday to the closest Billboard chart week.");
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
    sentence: "The radio was playing this when your story began.",
    genre: "Pop / R&B",
    year: "1995"
  };

  const activeTheme = result ? getGenreTheme(result.genre) : getGenreTheme("pop");

  return (
    <div className="min-h-screen relative text-slate-200 overflow-x-hidden bg-[#08080a] font-sans film-grain">
      
      {/* Immersive UI Glow Background & Fine Dust overlay */}
      <div className="absolute inset-0 glow-bg opacity-80 pointer-events-none" />
      
      {/* Decorative Atmosphere Elements */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-radial from-violet-500/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-pink-500/5 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Subtle floating music symbols */}
      <div className="absolute top-20 left-10 text-indigo-300/10 text-4xl select-none pointer-events-none font-serif animate-float">♩</div>
      <div className="absolute top-48 right-12 text-indigo-300/10 text-3xl select-none pointer-events-none font-serif animate-float" style={{ animationDelay: "1.5s" }}>♪</div>
      <div className="absolute bottom-56 left-1/2 text-indigo-300/10 text-5xl select-none pointer-events-none font-serif animate-float" style={{ animationDelay: "3s" }}>♬</div>
      <div className="absolute bottom-12 right-10 text-indigo-300/10 text-4xl select-none pointer-events-none font-serif animate-float" style={{ animationDelay: "0.5s" }}>♭</div>

      {/* Container */}
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-16 relative z-10 flex flex-col min-h-screen justify-between">
        
        {/* Header/Nav row */}
        <header className="flex justify-between items-center mb-12 border-b border-white/5 pb-6">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-linear-to-r from-pink-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <span className="font-serif font-bold text-lg text-white">B</span>
            </div>
            <div>
              <h1 className="font-sans font-bold text-sm tracking-widest text-[#ece7ff] uppercase">RetroWave</h1>
              <p className="text-[10px] text-gray-400 font-mono tracking-wider">CHRONICLES OF MUSIC</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center space-x-1 bg-white/5 border border-white/5 px-3 py-1 rounded-full text-xs font-mono text-gray-400">
            <span className="inline-block w-2 h-2 rounded-full bg-indigo-500 animate-pulse mr-1"></span>
            <span>Billboard Retro Sync Active</span>
          </div>
        </header>

        {/* 50/50 Desktop Split Section */}
        <main className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          
          {/* LEFT SIDE: Heading & Inputs */}
          <div className="flex flex-col space-y-8 pr-0 lg:pr-6" id="welcome_column">
            <div className="space-y-4">
              <span className="inline-flex items-center space-x-2 bg-gradient-to-r from-pink-500/20 to-indigo-600/20 text-indigo-300 font-mono text-xs px-3.5 py-1.5 rounded-full border border-indigo-500/20">
                <Sparkles size={13} className="animate-pulse" />
                <span>Nostalgia Finder</span>
              </span>
              <h2 className="text-4xl md:text-6xl font-sans font-bold text-white tracking-tight leading-tight">
                What Was the <span className="text-indigo-400">Soundtrack</span> of Your Birth?
              </h2>
              <p className="text-xl text-slate-400 font-serif italic leading-relaxed">
                Discover the song America couldn’t stop listening to the day you arrived.
              </p>
            </div>

            {/* Inputs Box */}
            <form onSubmit={handleReveal} className="glass-panel rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden" id="reveal_form border-white/10">
              
              <div className="space-y-3">
                <label className="text-xs uppercase tracking-[0.2em] text-indigo-300 font-semibold block">
                  Your Arrival Date
                </label>
                
                {/* Visual custom inputs */}
                <div className="grid grid-cols-3 gap-3">
                  {/* Month */}
                  <div className="relative">
                    <select
                      value={month}
                      onChange={(e) => setMonth(e.target.value)}
                      className="w-full h-14 bg-white/5 border border-white/10 rounded-xl text-center text-base font-sans focus:outline-hidden focus:border-indigo-500 text-gray-100 appearance-none cursor-pointer hover:bg-white/10 transition-colors"
                      id="input_month"
                    >
                      <option value="" disabled className="bg-slate-950">MM</option>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => {
                        const dateObj = new Date(2000, m - 1);
                        const label = dateObj.toLocaleString("en", { month: "2-digit" });
                        return <option key={m} value={m} className="bg-slate-950">{label}</option>;
                      })}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs">▼</div>
                  </div>

                  {/* Day */}
                  <div className="relative">
                    <select
                      value={day}
                      onChange={(e) => setDay(e.target.value)}
                      className="w-full h-14 bg-white/5 border border-white/10 rounded-xl text-center text-base font-sans focus:outline-hidden focus:border-indigo-500 text-gray-100 appearance-none cursor-pointer hover:bg-white/10 transition-colors"
                      id="input_day"
                    >
                      <option value="" disabled className="bg-slate-950">DD</option>
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                        <option key={d} value={d} className="bg-slate-950">{d.toString().padStart(2, "0")}</option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs">▼</div>
                  </div>

                  {/* Year */}
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="YYYY"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      min="1920"
                      max="2026"
                      className="w-full h-14 bg-white/5 border border-white/10 rounded-xl text-center text-base font-sans focus:outline-hidden focus:border-indigo-500 text-gray-100 hover:bg-white/10 transition-colors"
                      id="input_year"
                    />
                  </div>
                </div>
                <div className="flex flex-col space-y-2 px-1 pt-0.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-gray-400 font-mono tracking-wider">FORMAT: MM / DD / YYYY</span>
                    <span className="text-[10px] text-gray-400 font-mono tracking-wider">RANGE: 1920 - 2026</span>
                  </div>
                  <p className="text-[11px] text-indigo-300 font-medium leading-normal">
                    “Billboard charts are weekly — your result is matched to the chart week of your birthday.”
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
                className="w-full h-14 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all flex items-center justify-center space-x-2 group cursor-pointer select-none disabled:opacity-75 disabled:cursor-wait"
                id="cta_reveal_button"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
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

          {/* RIGHT SIDE: Interactive Sample Reveal Preview Card (Visible BEFORE reveal) */}
          <div className="flex flex-col justify-center items-center" id="example_column">
            <div className="w-full max-w-md relative">
              {/* Card Label tag above preview */}
              <div className="absolute -top-3 left-6 z-20 bg-[#ece7ff] text-[#08080a] text-[10px] font-mono tracking-widest uppercase px-3 py-1 rounded-sm shadow-md font-bold">
                Example Preview
              </div>

              {/* The Mock tape/vinyl Glassmorphism Card */}
              <div className="glass-panel w-full rounded-[2rem] p-6 md:p-8 space-y-6 shadow-2xl relative border-white/10 overflow-hidden transform rotate-1 hover:scale-[1.01] transition-transform duration-500">
                
                {/* Vinyl record preview frame */}
                <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-slate-900/40 border border-white/5 flex items-center justify-center group">
                  
                  {/* Sleeve Background shadow */}
                  <div className="absolute inset-0 rounded-full bg-slate-950/40 shadow-inner" />
                  
                  {/* Rotating album circle with Immersive UI concentric groove style */}
                  <div className="vinyl-spin w-56 h-56 shadow-2xl flex items-center justify-center border-4 border-slate-950 animate-spin-slow">
                    
                    {/* Custom inner sticker */}
                    <div className="w-16 h-16 rounded-full bg-indigo-200 flex flex-col items-center justify-center border border-indigo-400/20">
                      <div className="w-3.5 h-3.5 rounded-full bg-slate-900" />
                    </div>

                  </div>

                  {/* Micro timestamp label on vinyl card overlay */}
                  <div className="absolute bottom-4 left-4 glass px-3 py-1 rounded-full text-[10px] uppercase tracking-tighter text-white">
                    Previewing: Oct 25, 1995
                  </div>
                </div>

                {/* Standard Sample Song Meta */}
                <div className="space-y-1">
                  <div className="flex justify-between items-start">
                    <h2 className="text-3xl font-bold text-white tracking-tight">{sampleData.songTitle}</h2>
                    <span className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded text-[10px] font-bold border border-amber-500/30 uppercase tracking-wider">
                      #1 in America
                    </span>
                  </div>
                  <p className="text-lg text-indigo-300 font-mono">
                    {sampleData.artist}
                  </p>
                </div>

                {/* Atmospheric small sentence */}
                <div className="pt-4 border-t border-white/5">
                  <p className="font-serif italic text-slate-400 text-sm leading-relaxed">
                    “{sampleData.sentence} This track ruled American radio while you were entering the world.”
                  </p>
                </div>

                {/* Simulated Audio progress wave */}
                <div className="flex space-x-2 pt-2 items-center">
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
              className="border-t border-white/5 pt-16 pb-12 w-full space-y-12"
              id="reveal_result_section"
            >
              <div className="text-center space-y-3">
                <span className="font-mono text-xs tracking-widest text-[#ece7ff] uppercase">The Verdict</span>
                <h2 className="text-3xl md:text-5xl font-sans font-bold text-white">Your Birthday Anthem</h2>
                <p className="text-sm text-slate-400 font-serif italic max-w-lg mx-auto">
                  “Charts were updated weekly, so we matched your birthday to the closest Billboard chart week.”
                </p>
                <div className="h-0.5 w-16 bg-gradient-to-r from-pink-500 via-indigo-500 to-teal-400 mx-auto rounded-full" />
              </div>

              {/* REVEAL CARD DESIGN - Custom Full Width Beautiful Container */}
              <div className="glass-panel rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden animate-glow">
                
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
                      <div className="absolute top-0 left-0 w-60 h-60 rounded-2xl bg-gradient-to-tr from-slate-950 to-zinc-900 border border-white/15 p-1 flex flex-col justify-between shadow-2xl z-10 transition-transform duration-500 group-hover:-translate-x-4">
                        
                        {/* Album Inner art: Glassmorphic abstract grid layout */}
                        <div className={`w-full h-[65%] rounded-t-xl bg-gradient-to-br ${activeTheme.gradient} flex items-center justify-center relative overflow-hidden border-b border-white/5`}>
                          {/* Beautiful central star pattern */}
                          <div className="absolute h-32 w-32 border border-white/10 rounded-full animate-pulse-slow" />
                          <div className="absolute h-16 w-16 border border-white/15 rounded-full" />
                          <Disc size={64} className="text-white/20 animate-spin-slow" />
                          
                          {/* Artist title watermark */}
                          <div className="absolute bottom-2 left-2 bg-slate-950/50 backdrop-blur-md px-2 py-0.5 rounded-sm">
                            <span className="font-mono text-[8px] text-white/70 uppercase tracking-widest">{result.genre}</span>
                          </div>
                        </div>

                        {/* Album info bar */}
                        <div className="h-[35%] p-3 bg-slate-900/90 rounded-b-xl flex flex-col justify-center">
                          <h4 className="text-xs font-sans font-bold text-white truncate">{result.songTitle}</h4>
                          <p className="text-[10px] text-gray-400 font-mono truncate">{result.artist}</p>
                          <div className="flex justify-between items-center mt-1 text-[8px] font-mono text-gray-500">
                            <span>REVENUE RECORD</span>
                            <span>#1 BILLBOARD</span>
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
                        <span className="bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-xs px-3 py-1 rounded-full flex items-center space-x-1.5 shadow-md">
                          <Star size={12} className="fill-amber-400 mr-0.5" />
                          <span className="font-bold tracking-wider uppercase">#1 in America</span>
                        </span>
                        <span className="bg-white/5 border border-white/10 text-gray-300 font-mono text-xs px-3 py-1 rounded-full">
                          {result.releaseYear}
                        </span>
                        <span className={`border text-xs px-3 py-1 rounded-full font-mono ${activeTheme.badge}`}>
                          {result.genre}
                        </span>
                      </div>

                      <h3 className="text-3xl md:text-5xl font-sans font-bold text-white tracking-tight leading-tight">
                        {result.songTitle}
                      </h3>
                      <p className="text-lg text-[#ece7ff] font-serif italic">
                        by {result.artist}
                      </p>

                      {/* Birth Date and Chart Week Context Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 max-w-md font-mono text-xs mt-3">
                        <div>
                          <span className="text-gray-400 block text-[9px] uppercase tracking-wider mb-0.5">🎂 Your Birthday</span>
                          <span className="text-white font-bold text-sm tracking-wide">{result.userBirthdayFormatted || "October 25, 1995"}</span>
                        </div>
                        <div className="sm:border-l border-white/10 sm:pl-4">
                          <span className="text-indigo-300 block text-[9px] uppercase tracking-wider mb-0.5">📅 Matched Chart Week</span>
                          <span className="text-indigo-200 font-bold text-sm tracking-wide">{result.matchedChartWeek || "October 21, 1995"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Poetic nostalgic hook detail */}
                    <blockquote className="border-l-2 border-indigo-500/40 pl-4 py-1 text-base text-slate-300 font-serif italic leading-relaxed">
                      “{result.emotionalSentence}”
                    </blockquote>

                    {/* Media action controls */}
                    <div className="flex flex-wrap gap-3 pt-2">
                      <a 
                        href={result.spotifyUrl}
                        target="_blank" 
                        referrerPolicy="no-referrer"
                        className="inline-flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 active:scale-98 text-slate-950 font-sans font-bold text-xs tracking-widest uppercase px-5 py-3 rounded-full transition-all duration-300 shadow-md cursor-pointer"
                      >
                        <Play size={12} className="fill-slate-950" />
                        <span>Search Web & Spotify</span>
                      </a>
                      
                      <button 
                        onClick={handleCopyToClipboard}
                        className="inline-flex items-center space-x-2 bg-white/5 hover:bg-white/10 active:scale-98 text-gray-200 font-mono text-xs px-5 py-3 rounded-full transition-all duration-300 border border-white/10 cursor-pointer shadow-xs"
                      >
                        {copied ? (
                          <>
                            <span className="text-emerald-400">✓ Copied Results</span>
                          </>
                        ) : (
                          <>
                            <Share2 size={13} />
                            <span>Share Your Story</span>
                          </>
                        )}
                      </button>
                    </div>

                  </div>

                </div>

              </div>

              {/* EXTRA NOSTALGIA GRID: Under the Reveal Card */}
              <div className="space-y-6">
                <div className="text-left">
                  <h3 className="text-xl font-sans font-bold text-indigo-300 flex items-center space-x-2 border-b border-white/5 pb-2">
                    <span>🎬</span>
                    <span>Echoes & Culture of {result.releaseYear}</span>
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  
                  {/* Movie box office card */}
                  <div className="glass-panel rounded-2xl p-5 hover:scale-[1.02] transition-transform duration-300 border-white/5 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="h-9 w-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                        <Film size={18} />
                      </div>
                      <span className="font-mono text-[9px] text-slate-400 tracking-wider font-semibold">BOX OFFICE GIANT</span>
                      <h4 className="text-base font-sans font-bold text-white line-clamp-1">{result.movieTitle}</h4>
                      <p className="text-xs text-slate-300 font-serif italic leading-relaxed line-clamp-4">{result.movieDescription}</p>
                    </div>
                    <div className="pt-4 text-[9px] font-mono text-gray-500 border-t border-white/5 mt-3">
                      #1 Movie in Theaters
                    </div>
                  </div>

                  {/* Top rated TV card */}
                  <div className="glass-panel rounded-2xl p-5 hover:scale-[1.02] transition-transform duration-300 border-white/5 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="h-9 w-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                        <Tv size={18} />
                      </div>
                      <span className="font-mono text-[9px] text-slate-400 tracking-wider font-semibold">PRIME TIME CULT</span>
                      <h4 className="text-base font-sans font-bold text-white line-clamp-1">{result.tvShowTitle}</h4>
                      <p className="text-xs text-slate-300 font-serif italic leading-relaxed line-clamp-4">{result.tvShowDescription}</p>
                    </div>
                    <div className="pt-4 text-[9px] font-mono text-gray-500 border-t border-white/5 mt-3">
                      Dominating Living Rooms
                    </div>
                  </div>

                  {/* Celebrity astrological ally card */}
                  <div className="glass-panel rounded-2xl p-5 hover:scale-[1.02] transition-transform duration-300 border-white/5 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="h-9 w-9 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
                        <Star size={18} />
                      </div>
                      <span className="font-mono text-[9px] text-slate-400 tracking-wider font-semibold">CELEBRITY PEER</span>
                      <h4 className="text-base font-sans font-bold text-white line-clamp-1">{result.celebrityName}</h4>
                      <p className="text-xs text-slate-300 font-serif italic leading-relaxed line-clamp-4">{result.celebrityDescription}</p>
                    </div>
                    <div className="pt-4 text-[9px] font-mono text-gray-500 border-t border-white/5 mt-3">
                      Celestial Orbit Peer
                    </div>
                  </div>

                  {/* Cultural Snapshot Card */}
                  <div className="glass-panel rounded-2xl p-5 hover:scale-[1.02] transition-transform duration-300 border-white/5 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="h-9 w-9 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                        <Sparkles size={18} />
                      </div>
                      <span className="font-mono text-[9px] text-slate-400 tracking-wider font-semibold">CULTURAL PARADIGM</span>
                      <h4 className="text-base font-sans font-bold text-white line-clamp-1">The Era Vibe</h4>
                      <p className="text-xs text-slate-300 font-serif italic leading-relaxed line-clamp-4">{result.culturalSnapshot}</p>
                    </div>
                    <div className="pt-4 text-[9px] font-mono text-gray-500 border-t border-white/5 mt-3">
                      Pioneered Epoch Vibe
                    </div>
                  </div>

                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Memory Archive / Vault Shelf (LocalStorage record keeper) */}
        {history.length > 0 && (
          <footer className="border-t border-white/5 pt-12 mt-16 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-mono text-xs tracking-widest text-indigo-300 uppercase flex items-center space-x-2">
                <History size={14} className="animate-spin-slow" />
                <span>Your Nostalgic Record Vault ({history.length})</span>
              </h3>
              <button 
                onClick={() => {
                  setHistory([]);
                  localStorage.removeItem("birthday_reveal_history");
                }}
                className="text-[10px] font-mono text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer border-b border-indigo-500/20 px-1"
              >
                Clear History Rack
              </button>
            </div>

            {/* Carousel rack of previously selected birthday songs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {history.map((record) => {
                const parts = record.birthDate.split("-");
                const formattedDateShort = `${parts[1]}/${parts[2]}/${parts[0]}`;
                
                return (
                  <div 
                    key={record.id}
                    onClick={() => handleSelectHistory(record)}
                    className="glass-panel hover:glass-panel-light p-3 rounded-2xl text-center cursor-pointer select-none group relative overflow-hidden transition-all duration-300 hover:scale-[1.03]"
                    title="Load saved revelation"
                  >
                    {/* Tiny animated spinning vinyl mock inside slot */}
                    <div className="relative h-10 w-10 mx-auto mb-2 flex items-center justify-center">
                      <Disc size={28} className="text-gray-500 group-hover:text-pink-400 transition-colors group-hover:animate-spin-slow" />
                    </div>
                    <p className="text-[10px] font-mono font-bold text-gray-200 tracking-tight leading-none truncate mb-1">
                      {record.data.songTitle}
                    </p>
                    <p className="text-[8px] font-mono text-gray-400 truncate">
                      {record.data.artist}
                    </p>
                    <div className="text-[7px] text-indigo-300 font-mono mt-1 pt-1 border-t border-white/5">
                      {formattedDateShort}
                    </div>

                    {/* Miniature remove button icon */}
                    <button
                      onClick={(e) => deleteHistoryItem(record.id, e)}
                      className="absolute top-1.5 right-1.5 text-gray-600 hover:text-rose-400 z-10 p-0.5"
                      title="Clear from shelf"
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          </footer>
        )}

        {/* Minimal Immersive Footer tags */}
        <div className="flex flex-wrap gap-12 justify-center items-center opacity-40 text-[10px] tracking-[0.25em] font-bold font-sans uppercase pt-12 border-t border-white/5 select-none text-indigo-200">
          <div>Billboard Hot 100</div>
          <div>Nostalgic Moments</div>
          <div>Cultural Archive</div>
        </div>

        {/* Small subtle footer credit line */}
        <footer className="text-center text-gray-500 text-[10px] font-mono mt-8 pt-4 space-y-1">
          <p>© {new Date().getFullYear()} RetroWave Reveal. Music insights retrieved factually from our historical charts database.</p>
          <p>Powered by server-side Gemini AI. No data leaves your secure workspace environments.</p>
        </footer>

      </div>
    </div>
  );
}
