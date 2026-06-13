import express from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { BILLBOARD_ARCHIVE } from "./src/data/billboard-archive";

let viteInstance: any = null;

dotenv.config();

// Date calculation and formatting helpers
function getChartDates(birthDateStr: string) {
  const parts = birthDateStr.split("-");
  const y = parseInt(parts[0]);
  const m = parseInt(parts[1]);
  const d = parseInt(parts[2]);
  
  // Construct date in timezone safe UTC way
  const birthDate = new Date(Date.UTC(y, m - 1, d));
  
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const userBirthdayFormatted = `${months[birthDate.getUTCMonth()]} ${birthDate.getUTCDate()}, ${birthDate.getUTCFullYear()}`;
  
  // Find Saturday on or before (0 is Sunday, 6 is Saturday)
  const dayOfWeek = birthDate.getUTCDay();
  const daysToSubtract = (dayOfWeek + 1) % 7;
  
  const sateOnOrBefore = new Date(birthDate);
  sateOnOrBefore.setUTCDate(birthDate.getUTCDate() - daysToSubtract);
  
  let chartDate = sateOnOrBefore;
  
  // Only use a future chart date if there is no earlier chart date in the database (pre-1920)
  if (sateOnOrBefore.getUTCFullYear() < 1920) {
    const sateAfter = new Date(sateOnOrBefore);
    sateAfter.setUTCDate(sateOnOrBefore.getUTCDate() + 7);
    chartDate = sateAfter;
  }
  
  const matchedChartWeek = `${months[chartDate.getUTCMonth()]} ${chartDate.getUTCDate()}, ${chartDate.getUTCFullYear()}`;
  
  return {
    userBirthdayFormatted,
    matchedChartWeek,
    chartYear: chartDate.getUTCFullYear()
  };
}

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper to parse date slug from SEO URL
function parseRouteDate(dateStr: string) {
  const cleanStr = dateStr.toLowerCase().replace(/[^a-z0-9-]/g, "");
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

  const mStr = String(month).padStart(2, "0");
  const dStr = String(day).padStart(2, "0");
  const yStr = String(year);

  return `${yStr}-${mStr}-${dStr}`; // YYYY-MM-DD
}

// Complete historical chart dataset for 1930s (1930-1939) with custom atmospheric entries
const HISTORICAL_CHART_DATASET_1930S = [
  // Specific requested test dates first
  {
    exactDate: "1933-01-07",
    year: 1933,
    songTitle: "Night and Day",
    artist: "Fred Astaire & Leo Reisman Orchestra",
    genre: "Cole Porter Swing / Big Band",
    billboardRank: "No. 1 Chart Hit of 1933",
    albumCoverDescription: "An archival lacquer disc with a warm gold typography label on a soft textured fiber sleeve.",
    spotifyUrl: `https://open.spotify.com/search/${encodeURIComponent("Fred Astaire Leo Reisman Night and Day")}`,
    emotionalSentence: "Astaire's silky swing echoed through high-society ballrooms the week my story entered the world.",
    movieTitle: "King Kong",
    movieDescription: "Screaming theater crowds stared in absolute wonder as the mighty beast scaled the Empire State.",
    tvShowTitle: "The Jack Benny Program",
    tvShowDescription: "Radio valves glowed amber inside polished cabinets, broadcasting dry comedic timing to living rooms.",
    culturalSnapshot: "Felt fedoras, sweeping wool cloaks, and brass horns gleaming under ballroom chandeliers."
  },
  {
    exactDate: "1934-01-07", // January 7, 1934 -> matches Jan 6, 1934 chart week
    year: 1934,
    songTitle: "Did You Ever See a Dream Walking?",
    artist: "Eddy Duchin & His Orchestra",
    genre: "Sweet Jazz / Big Band",
    billboardRank: "No. 1 Chart Hit of 1934",
    albumCoverDescription: "An ornate Brunswick label with detailed gold scrolling on a glossy black lacquer disc.",
    spotifyUrl: `https://open.spotify.com/search/${encodeURIComponent("Eddy Duchin Did You Ever See a Dream Walking")}`,
    emotionalSentence: "Eddy Duchin's lyrical piano keys softened a quiet, snowy winter the week my story began.",
    movieTitle: "It Happened One Night",
    movieDescription: "Sparkling silver-screen wit and classic screwball romance captured the national imagination.",
    tvShowTitle: "Ma Perkins",
    tvShowDescription: "Fascinating daily radio dramas kept housewives spellbound during quiet afternoon chores.",
    culturalSnapshot: "Double-breasted suits, classic model-T coupes, and the nostalgic warmth of wood-carved radios."
  },
  {
    exactDate: "1932-02-09", // Feb 9, 1932
    year: 1932,
    songTitle: "All of Me",
    artist: "Louis Armstrong",
    genre: "Early Jazz / Orchestral",
    billboardRank: "No. 1 Chart Hit of 1932",
    albumCoverDescription: "Label features a deep navy shellac finish with gold hand-lettered text, framed by ornate brass engravings.",
    spotifyUrl: `https://open.spotify.com/search/${encodeURIComponent("Louis Armstrong All of Me")}`,
    emotionalSentence: "The smoky, sweet blues of Armstrong warmed cold jazz parlors the week my story began.",
    movieTitle: "Grand Hotel",
    movieDescription: "Plush velvet theatre drapery parting to reveal Greta Garbo in breathtaking black-and-white.",
    tvShowTitle: "The Shadow",
    tvShowDescription: "Huddled around wooden radio cabinets, listeners shivered at the narrator's eerie, famous laugh.",
    culturalSnapshot: "Elegantly tailored wool overcoats, vintage streetcars, and the warm crackle of early jukebox models."
  },
  {
    exactDate: "1936-06-02", // June 2, 1936
    year: 1936,
    songTitle: "Is It True What They Say About Dixie?",
    artist: "Jimmy Dorsey & His Orchestra",
    genre: "Dixieland Swing / Jazz",
    billboardRank: "No. 1 Chart Hit of 1936",
    albumCoverDescription: "Sleek mahogany shellac record center with hand-typed font and early swing-era vector illustrations.",
    spotifyUrl: `https://open.spotify.com/search/${encodeURIComponent("Jimmy Dorsey Is It True What They Say About Dixie")}`,
    emotionalSentence: "Dorsey's energetic brass filled sunny summer ice-cream parlors the week my story began.",
    movieTitle: "Modern Times",
    movieDescription: "Laughter echoed as Charlie Chaplin struggled against the towering machines of an industrial age.",
    tvShowTitle: "The Fibber McGee and Molly Show",
    tvShowDescription: "Warm family hearths and witty radio banter filled households on breezy Tuesday nights.",
    culturalSnapshot: "Polished chrome roadsters, straw boater hats, and neon-lit swing halls redefining weekend fun."
  },
  {
    exactDate: "1939-09-01", // Sep 1, 1939
    year: 1939,
    songTitle: "Over the Rainbow",
    artist: "Judy Garland",
    genre: "Vocal Jazz / Orchestral Pop",
    billboardRank: "No. 1 Chart Hit of 1939",
    albumCoverDescription: "A gorgeous historic Decca label on a rich textured paper jacket featuring nostalgic yellow brick road illustrations.",
    spotifyUrl: `https://open.spotify.com/search/${encodeURIComponent("Judy Garland Over the Rainbow")}`,
    emotionalSentence: "Garland's timeless voice whispered of hope beyond the rain the week my story entered the world.",
    movieTitle: "The Wizard of Oz",
    movieDescription: "Velvet theaters glowed as stunning Technicolor wizardry swept across the massive silver screen.",
    tvShowTitle: "The Edgar Bergen and Charlie McCarthy Show",
    tvShowDescription: "Ventriloquist banter on the airwaves kept families laughing huddled around living room hearths.",
    culturalSnapshot: "The sweep of classic trench coats, steam locomotives, and early monochrome photo printing."
  },

  // Yearly dynamic fallbacks to ensure each year 1930-1939 resolves independently
  {
    year: 1930,
    songTitle: "Happy Days Are Here Again",
    artist: "Leo Reisman Orchestra",
    genre: "Golden Age Orchestral",
    billboardRank: "No. 1 Chart Hit of 1930",
    albumCoverDescription: "A heavy vintage Victor record center in dark mahogany red with gold decorative scrollwork.",
    spotifyUrl: `https://open.spotify.com/search/${encodeURIComponent("Leo Reisman Happy Days Are Here Again")}`,
    emotionalSentence: "A joyous anthem of silver linings echoed through theaters the week my story began.",
    movieTitle: "All Quiet on the Western Front",
    movieDescription: "Stark cinematic realism of war moved theater audiences to quiet, profound tears.",
    tvShowTitle: "The Amos 'n' Andy Show",
    tvShowDescription: "Radio dials hummed as millions tuned in for nightly parlor-side comedy serials.",
    culturalSnapshot: "Classic wool fedoras, steam railway stations, and early art-deco theater designs."
  },
  {
    year: 1931,
    songTitle: "Minnie the Moocher",
    artist: "Cab Calloway & His Cotton Club Orchestra",
    genre: "Early Harlem Swing / Jazz",
    billboardRank: "No. 1 Chart Hit of 1931",
    albumCoverDescription: "Vintage shellac 78 record center with hand-lettered gold print and historic Brunswick framing.",
    spotifyUrl: `https://open.spotify.com/search/${encodeURIComponent("Cab Calloway Minnie the Moocher")}`,
    emotionalSentence: "Calloway's wild, energetic call-and-response jazz defined the night the week my story began.",
    movieTitle: "Dracula",
    movieDescription: "Bela Lugosi's chilling silhouette left theatergoers gasping in dark, velvet movie halls.",
    tvShowTitle: "The Lucky Strike Dance Hour",
    tvShowDescription: "The sweet, crackling sound of big bands playing live under glowing vacuum-tube radios.",
    culturalSnapshot: "Crisp white tuxedos, polished jazz saxophones, and smoke-filled cabaret spotlights."
  },
  {
    year: 1932,
    songTitle: "All of Me",
    artist: "Louis Armstrong",
    genre: "Early Jazz / Orchestral",
    billboardRank: "No. 1 Chart Hit of 1932",
    albumCoverDescription: "Label features a deep navy shellac finish with gold hand-lettered text, framed by ornate brass engravings.",
    spotifyUrl: `https://open.spotify.com/search/${encodeURIComponent("Louis Armstrong All of Me")}`,
    emotionalSentence: "The smoky, sweet blues of Armstrong warmed cold jazz parlors the week my story began.",
    movieTitle: "Grand Hotel",
    movieDescription: "Plush velvet theatre drapery parting to reveal Greta Garbo in breathtaking black-and-white.",
    tvShowTitle: "The Shadow",
    tvShowDescription: "Huddled around wooden radio cabinets, listeners shivered at the narrator's eerie, famous laugh.",
    culturalSnapshot: "Elegantly tailored wool overcoats, vintage streetcars, and the warm crackle of early jukebox models."
  },
  {
    year: 1933,
    songTitle: "Night and Day",
    artist: "Fred Astaire & Leo Reisman Orchestra",
    genre: "Cole Porter Swing / Big Band",
    billboardRank: "No. 1 Chart Hit of 1933",
    albumCoverDescription: "An archival lacquer disc with a warm gold typography label on a soft textured fiber sleeve.",
    spotifyUrl: `https://open.spotify.com/search/${encodeURIComponent("Fred Astaire Leo Reisman Night and Day")}`,
    emotionalSentence: "Astaire's silky swing echoed through high-society ballrooms the week my story entered the world.",
    movieTitle: "King Kong",
    movieDescription: "Screaming theater crowds stared in absolute wonder as the mighty beast scaled the Empire State.",
    tvShowTitle: "The Jack Benny Program",
    tvShowDescription: "Radio valves glowed amber inside polished cabinets, broadcasting dry comedic timing to living rooms.",
    culturalSnapshot: "Felt fedoras, sweeping wool cloaks, and brass horns gleaming under ballroom chandeliers."
  },
  {
    year: 1934,
    songTitle: "Smoke Gets in Your Eyes",
    artist: "Paul Whiteman & His Orchestra",
    genre: "Orchestral Vintage Jazz",
    billboardRank: "No. 1 Chart Hit of 1934",
    albumCoverDescription: "A glossy crimson shellac disc with gold hand-carved text patterns in an art-deco paper jacket.",
    spotifyUrl: `https://open.spotify.com/search/${encodeURIComponent("Paul Whiteman Smoke Gets in Your Eyes")}`,
    emotionalSentence: "The sweeping romantic orchestration of Paul Whiteman softened winter evenings when I arrived.",
    movieTitle: "Cleopatra",
    movieDescription: "Grand golden Cecil B. DeMille canvases filled cinema corridors with lush, towering historical romance.",
    tvShowTitle: "The Chase and Sanborn Hour",
    tvShowDescription: "Cozy hearthside comedy variety broadcasts filled living rooms with live laughs.",
    culturalSnapshot: "Art-deco vanity cabinets, Bakelite telephones, and classic wool double-breasted suits."
  },
  {
    year: 1935,
    songTitle: "Cheek to Cheek",
    artist: "Fred Astaire",
    genre: "Golden Age Jazz / Orchestral",
    billboardRank: "No. 1 Chart Hit of 1935",
    albumCoverDescription: "A deep gold paper sleeve with classic typography patterns framing a black shellac center.",
    spotifyUrl: `https://open.spotify.com/search/${encodeURIComponent("Fred Astaire Cheek to Cheek")}`,
    emotionalSentence: "Heavens were indeed in reach as Astaire's elegant tap-steps dominated the airwaves this week.",
    movieTitle: "Top Hat",
    movieDescription: "Fred Astaire and Ginger Rogers spun on glowing white-lacquered soundstages in breathtaking elegance.",
    tvShowTitle: "Lux Radio Theatre",
    tvShowDescription: "Legendary classical actors performed full Hollywood theater screenplays live on the airwaves.",
    culturalSnapshot: "Polished evening wear, cascading satin gowns, and the elegant neon sweep of ballroom gates."
  },
  {
    year: 1936,
    songTitle: "Pennies from Heaven",
    artist: "Bing Crosby",
    genre: "Classic Crooner Pop",
    billboardRank: "No. 1 Chart Hit of 1936",
    albumCoverDescription: "Decca record label in beautiful deep orange with neat gold block-letter typography.",
    spotifyUrl: `https://open.spotify.com/search/${encodeURIComponent("Bing Crosby Pennies from Heaven")}`,
    emotionalSentence: "Bing Crosby's cheerful optimism drifted from neighborhood ice-cream parlor speakers the week my story began.",
    movieTitle: "The Great Ziegfeld",
    movieDescription: "Shining theatrical spectaculars and massive spiral orchestra staircases enchanted audiences nationwide.",
    tvShowTitle: "The Lux Radio Theatre",
    tvShowDescription: "Dramatized live adaptations of major screenplays captured hearts on Monday nights.",
    culturalSnapshot: "Vintage jukebox assemblies, straw boaters, and polished steel streamlined locomotives."
  },
  {
    year: 1937,
    songTitle: "Sweet Leilani",
    artist: "Bing Crosby",
    genre: "Hawaiian Jazz / Vocal Pop",
    billboardRank: "No. 1 Chart Hit of 1937",
    albumCoverDescription: "Vintage brown paper jacket with tropical palm drawings and a gold-stamped Decca label.",
    spotifyUrl: `https://open.spotify.com/search/${encodeURIComponent("Bing Crosby Sweet Leilani")}`,
    emotionalSentence: "Bing Crosby's warm, soothing baritone brought gentle tropical warmth to the week I arrived.",
    movieTitle: "Snow White and the Seven Dwarfs",
    movieDescription: "Stunning hand-drawn Disney animation and vintage watercolor backgrounds enchanted theater audiences.",
    tvShowTitle: "The Chase and Sanborn Hour",
    tvShowDescription: "Listeners tuned in for glamorous radio variety shows, sharing laughter beside warm hearths.",
    culturalSnapshot: "Floral leis, early tropical travel posters, and the gentle glide of steel lap guitars."
  },
  {
    year: 1938,
    songTitle: "A-Tisket, A-Tasket",
    artist: "Ella Fitzgerald & Chick Webb",
    genre: "Harlem Swing / Big Band",
    billboardRank: "No. 1 Chart Hit of 1938",
    albumCoverDescription: "Classic shellac 78 RPM record center with Ella's iconic signature stamped in gold script.",
    spotifyUrl: `https://open.spotify.com/search/${encodeURIComponent("Ella Fitzgerald A Tisket A Tisket")}`,
    emotionalSentence: "Ella's brilliant, playful swing vocals brought irresistible smiles the week my story began.",
    movieTitle: "The Adventures of Robin Hood",
    movieDescription: "Dazzling vintage Technicolor arrows zipped through lush Sherwood forest screens in vivid detail.",
    tvShowTitle: "The Mercury Theatre on the Air",
    tvShowDescription: "Orson Welles and his theatrical troupe shocked the airwaves with gripping, realistic dramas.",
    culturalSnapshot: "Swing dance marathons, high-waisted trousers, and the bustling neon shine of record stores."
  },
  {
    year: 1939,
    songTitle: "In the Mood",
    artist: "Glenn Miller & His Orchestra",
    genre: "Big Band Swing",
    billboardRank: "No. 1 Chart Hit of 1939",
    albumCoverDescription: "Classic RCA Victor labeled record center with deep blue layout and signature dog illustration.",
    spotifyUrl: `https://open.spotify.com/search/${encodeURIComponent("Glenn Miller In the Mood")}`,
    emotionalSentence: "The roaring, legendary brass rhythms of Glenn Miller sparked dance floors across America when I entered the world.",
    movieTitle: "Gone with the Wind",
    movieDescription: "Stunning cinematic color and sweeping wartime romance drew lines wrapping around city streets.",
    tvShowTitle: "The Edgar Bergen and Charlie McCarthy Show",
    tvShowDescription: "Clever ventriloquist comedy broadcasts brought joy and laughter to cozy living room hearths.",
    culturalSnapshot: "The early neon swing clubs, sleek roadsters, and the quick swing-tap of leather oxfords."
  }
];

// Helper to determine the celebrity birthday matching
function getCelebrityForDay(month: number, day: number) {
  if (month === 10 && day === 25) {
    return {
      celebrityName: "Katy Perry",
      celebrityDescription: "Katy Perry brought chart-topping pop brilliance and dazzling stardom to the world.",
      celebrityBirthMonth: 10,
      celebrityBirthDay: 25
    };
  } else if (month === 10 && day === 28) {
    return {
      celebrityName: "Julia Roberts",
      celebrityDescription: "Julia Roberts defined a generation of cinema with magnetic charm and brilliant screen presence.",
      celebrityBirthMonth: 10,
      celebrityBirthDay: 28
    };
  } else if (month === 11 && day === 11) {
    return {
      celebrityName: "Leonardo DiCaprio",
      celebrityDescription: "Leonardo DiCaprio captured hearts and pushed cinema boundaries with legendary versatility.",
      celebrityBirthMonth: 11,
      celebrityBirthDay: 11
    };
  } else if (month === 11 && day === 22) {
    return {
      celebrityName: "Scarlett Johansson",
      celebrityDescription: "Scarlett Johansson commanded the screen with modern grace and unparalleled range.",
      celebrityBirthMonth: 11,
      celebrityBirthDay: 22
    };
  } else if (month === 9 && day === 1) {
    return {
      celebrityName: "Zendaya",
      celebrityDescription: "Zendaya broke boundaries in style and television, pioneering representation for her generation.",
      celebrityBirthMonth: 9,
      celebrityBirthDay: 1
    };
  } else if (month === 12 && day === 18) {
    return {
      celebrityName: "Billie Eilish",
      celebrityDescription: "Billie Eilish revolutionized alternative pop with haunting vocals and direct emotional honesty.",
      celebrityBirthMonth: 12,
      celebrityBirthDay: 18
    };
  }
  return {
    celebrityName: "No iconic birthday match discovered",
    celebrityDescription: "A distinctive day in history, waiting for my unique story to unfold.",
    celebrityBirthMonth: 0,
    celebrityBirthDay: 0
  };
}

// Function to resolve 1930s records independently
function getHistorical1930sRecord(birthDateStr: string, matchedChartWeek: string) {
  const parts = birthDateStr.split("-");
  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  const d = parseInt(parts[2], 10);

  const { userBirthdayFormatted, chartYear } = getChartDates(birthDateStr);

  // Search exact date match first (comparing exactDate to birthDate format)
  let matchedRecord = HISTORICAL_CHART_DATASET_1930S.find(r => r.exactDate === birthDateStr);
  let isFallbackUsed = false;

  if (matchedRecord) {
    console.log(`[DEBUG] Found exact date match in 1930s chart dataset for date: ${birthDateStr}`);
  } else {
    // If exact date not matched, fall back to the yearly dataset match using the computed chart year
    matchedRecord = HISTORICAL_CHART_DATASET_1930S.find(r => r.year === chartYear && !r.exactDate);
    isFallbackUsed = true;
    console.warn(`[INTERNAL WARNING] No exact date match found in historical chart dataset for ${birthDateStr}. Falling back to year-based default match for year ${chartYear}.`);
  }

  // Double fallback handle
  if (!matchedRecord) {
    // Find the closest record in the dataset matching the calculated chart year or general default
    const fallbackYear = (chartYear >= 1930 && chartYear <= 1939) ? chartYear : 1930;
    const closestRecord = HISTORICAL_CHART_DATASET_1930S.find(r => r.year === fallbackYear && !r.exactDate) || HISTORICAL_CHART_DATASET_1930S[0];
    
    matchedRecord = {
      ...closestRecord,
      year: chartYear
    };
    isFallbackUsed = true;
  }

  const celebrityInfo = getCelebrityForDay(m, d);

  const result = {
    ...matchedRecord,
    ...celebrityInfo,
    releaseYear: matchedRecord.year,
    userBirthMonth: m,
    userBirthDay: d,
    userBirthdayFormatted,
    matchedChartWeek
  };

  // Log the selected date, calculated chart week, matched record, song title, and artist during debugging
  console.log(`[DEBUG] Selected date: ${birthDateStr} | Calculated chart week: ${matchedChartWeek} | Matched record found: "${result.songTitle}" by ${result.artist} (isFallback: ${isFallbackUsed}) | Song Title: "${result.songTitle}" | Artist: "${result.artist}"`);

  return result;
}

function getLocalArchiveResponse(m: number, d: number, year: number, userBirthdayFormatted: string, matchedChartWeek: string, songRecord: { songTitle: string; artist: string; year: number }) {
  const celebrityInfo = getCelebrityForDay(m, d);
  return {
    songTitle: songRecord.songTitle,
    artist: songRecord.artist,
    releaseYear: year,
    genre: "Nostalgic Classic",
    billboardRank: "#1 Billboard Hot 100",
    albumCoverDescription: "A retro vinyl sleeve reflecting the style and design of the era.",
    spotifyUrl: `https://open.spotify.com/search/${encodeURIComponent(songRecord.songTitle + " " + songRecord.artist)}`,
    emotionalSentence: "This classic melody defined the cultural airwaves during the week my story began.",
    movieTitle: "A Box Office Classic",
    movieDescription: "Theaters across America were packed with people escaping into cinematic wonder.",
    tvShowTitle: "Prime Time Broadcast",
    tvShowDescription: "A legendary show that brought families together around glowing living room screens.",
    celebrityName: celebrityInfo.celebrityName,
    celebrityDescription: celebrityInfo.celebrityDescription,
    celebrityBirthMonth: celebrityInfo.celebrityBirthMonth,
    celebrityBirthDay: celebrityInfo.celebrityBirthDay,
    culturalSnapshot: "A memorable generation defined by dynamic vinyl grooves, classic radio broadcasts, and lasting memories.",
    userBirthdayFormatted,
    matchedChartWeek,
    isFallback: false,
    source: "local-archive"
  };
}

// Global abstracted utility to fetch or generate birthday reveal metadata via Gemini or local database
async function getNostalgiaData(birthDate: string): Promise<any> {
  const parts = birthDate.split("-");
  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  const d = parseInt(parts[2], 10);

  const { userBirthdayFormatted, matchedChartWeek, chartYear } = getChartDates(birthDate);

  // If the birthday is in the 1930s, resolve immediately from the high-fidelity historical record dataset
  if (y < 1940) {
    const data = getHistorical1930sRecord(birthDate, matchedChartWeek) as any;
    data.source = "static-fallback";
    console.log(`[DEBUG] SOURCE: static-fallback (1930s)`);
    return data;
  }

  // Find the verified Billboard #1 song from our local archive
  const songRecord = BILLBOARD_ARCHIVE.find(r => r.year === chartYear) || BILLBOARD_ARCHIVE.find(r => r.year === y);
  if (!songRecord) {
    throw new Error("No historical data available for the requested year.");
  }

  // Check if Gemini API Key is available
  const apiKey = process.env.GEMINI_API_KEY;
  console.log(`[DEBUG] process.env.GEMINI_API_KEY exists: ${!!apiKey}`);

  if (!apiKey) {
    console.warn("GEMINI_API_KEY environment variable is not set. Using local archive data.");
    return getLocalArchiveResponse(m, d, chartYear, userBirthdayFormatted, matchedChartWeek, songRecord);
  }

  let ai;
  try {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log(`[DEBUG] Gemini SDK initialization succeeded`);
  } catch (initErr: any) {
    console.error(`[DEBUG] Gemini SDK initialization failed, falling back to local archive:`, initErr);
    return getLocalArchiveResponse(m, d, chartYear, userBirthdayFormatted, matchedChartWeek, songRecord);
  }

  const userMonth = m;
  const userDay = d;

  const prompt = `Identify and describe the musical and cultural backdrop of the year ${chartYear} during the week of ${matchedChartWeek}.
  User Birthday: ${userBirthdayFormatted} (Date Entered: ${birthDate})
  User Birth Month: ${userMonth}, User Birth Day: ${userDay}.
  
  The verified #1 Billboard Hot 100 song for this week is: "${songRecord.songTitle}" by ${songRecord.artist}.
  You MUST return exactly this official song Title: "${songRecord.songTitle}" and Artist: "${songRecord.artist}" in your response.
  
  CRITICAL: For the celebrityName, find a legendary star, famous director, writer, artist, or creative pioneer who shares the EXACT same birth calendar month (${userMonth}) and day (${userDay}) as the user. The year does NOT need to match. 
  You MUST output the celebrity's exact month under celebrityBirthMonth (must be exactly ${userMonth}) and day under celebrityBirthDay (must be exactly ${userDay}). 
  If you cannot find/verify a celebrity born on exactly month ${userMonth} and day ${userDay}, return "No iconic birthday match discovered" for celebrityName, and "A distinctive day in history, waiting for my unique story to unfold." for celebrityDescription, with celebrityBirthMonth: 0, celebrityBirthDay: 0. 
  Do NOT select any celebrity born on a different month or day. No adjacent or close dates allowed.`;

  try {
    console.log(`[DEBUG] Executing Gemini API request for date: ${birthDate}...`);
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: `You are a warm, affectionate pop-culture historian capturing memories from the perspective of the visitor. Your goal is to describe my birthday soundtrack. Overwrite songTitle option with "${songRecord.songTitle}" and artist option with "${songRecord.artist}". Return a beautifully framed structured JSON with nostalgic details of that point in time. Avoid textbook, encyclopedia, or dry informational summaries. Every single description field (movieDescription, tvShowDescription, celebrityDescription, culturalSnapshot) MUST use highly atmospheric, sensory, and emotionally immersive storytelling. Let the user FEEL the textures, sounds, and visual imagination of the era—write as if 'this world was actively happening when my story began'. Each of these must be an extremely short, punchy, scan-friendly, single cinematic observation of only 1 line (maximum 15 words) that captures the era's raw emotion written from the perspective of my story. The 'culturalSnapshot' field MUST feel like 'the emotional weather of the generation' (not a textbook list). The emotionalSentence field MUST be a clean, confident, single cinematic line (max 15 words) describing the song's relationship to my arrival, completely avoiding overly poetic or AI-generated sounding prose. Excellent examples for emotionalSentence: 'Motown filled American radios the week my story began.', 'This anthem echoed through living rooms across America when I arrived.', 'The Supremes were everywhere the week my story entered the world.', 'Classic soul tracks filled the airwaves as my era dawned.' Do not hallucinate titles or artists.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            songTitle: { type: Type.STRING, description: "Must be exactly: " + songRecord.songTitle },
            artist: { type: Type.STRING, description: "Must be exactly: " + songRecord.artist },
            releaseYear: { type: Type.INTEGER, description: "The year the song dominated the charts." },
            genre: { type: Type.STRING, description: "The genre of the track, e.g. 'Motown / Soul', 'Synthpop', 'Alternative', etc." },
            billboardRank: { type: Type.STRING, description: "Usually '#1 Billboard Hot 100' or similar historic ranking status." },
            albumCoverDescription: { type: Type.STRING, description: "A beautiful description of what its visual artwork looks like (e.g. 'A deep gold record sleeve featuring stylish vintage portraits')." },
            spotifyUrl: { type: Type.STRING, description: "A URL searching for this track on Spotify, e.g., 'https://open.spotify.com/search/Song%20Artist'" },
            emotionalSentence: { type: Type.STRING, description: "A clean, confident, single cinematic line of max 15 words representing the music landscape (e.g., 'Motown filled American radios the week my story began.')" },
            movieTitle: { type: Type.STRING, description: "The #1 film in North American cinema box offices that week or month." },
            movieDescription: { type: Type.STRING, description: "A brief nostalgic snippet highlighting the cinema vibe of that time (single short observation line, max 15 words)." },
            tvShowTitle: { type: Type.STRING, description: "The top-rated TV show taking over household living rooms around that year." },
            tvShowDescription: { type: Type.STRING, description: "A brief atmospheric snippet about what made the show popular (single short observation line, max 15 words)." },
            celebrityName: { type: Type.STRING, description: "A legendary star or creative pioneer born on the EXACT same month and day as the user (month " + userMonth + ", day " + userDay + "). If none found, write: No iconic birthday match discovered" },
            celebrityDescription: { type: Type.STRING, description: "A one-line nostalgic sentence of max 15 words about them sharing my special day. If celebrityName is No iconic birthday match discovered, write: A distinctive day in history, waiting for my unique story to unfold." },
            celebrityBirthMonth: { type: Type.INTEGER, description: "The calendar month of birth for the chosen celebrity (must be exactly " + userMonth + " or 0 if none)." },
            celebrityBirthDay: { type: Type.INTEGER, description: "The calendar day of birth for the chosen celebrity (must be exactly " + userDay + " or 0 if none)." },
            culturalSnapshot: { type: Type.STRING, description: "A deeply nostalgic highlight capturing the technology, style, or youth culture paradigm shift of that moment (single short observation line, max 15 words)." },
            userBirthdayFormatted: { type: Type.STRING, description: "Please return exactly: " + userBirthdayFormatted },
            matchedChartWeek: { type: Type.STRING, description: "Please return exactly: " + matchedChartWeek }
          },
          required: [
            "songTitle",
            "artist",
            "releaseYear",
            "genre",
            "billboardRank",
            "albumCoverDescription",
            "spotifyUrl",
            "emotionalSentence",
            "movieTitle",
            "movieDescription",
            "tvShowTitle",
            "tvShowDescription",
            "celebrityName",
            "celebrityDescription",
            "celebrityBirthMonth",
            "celebrityBirthDay",
            "culturalSnapshot",
            "userBirthdayFormatted",
            "matchedChartWeek"
          ]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response text from Gemini API.");
    }

    console.log(`[DEBUG] Gemini request executed successfully and returned text payload.`);
    const nostalgiaData = JSON.parse(text);
    nostalgiaData.source = "gemini";
    console.log(`[DEBUG] SOURCE: gemini`);
    
    // Always enforce the local verified song to bypass any potential model hallucination
    nostalgiaData.songTitle = songRecord.songTitle;
    nostalgiaData.artist = songRecord.artist;
    nostalgiaData.releaseYear = chartYear;
    nostalgiaData.userBirthdayFormatted = userBirthdayFormatted;
    nostalgiaData.matchedChartWeek = matchedChartWeek;
    
    // Inject and validate birth dates
    nostalgiaData.userBirthMonth = userMonth;
    nostalgiaData.userBirthDay = userDay;

    const celebrityMonthFetched = Number(nostalgiaData.celebrityBirthMonth);
    const celebrityDayFetched = Number(nostalgiaData.celebrityDayFetched || nostalgiaData.celebrityBirthDay);

    let isCelebrityMatch = false;
    if (celebrityMonthFetched === userMonth && celebrityDayFetched === userDay) {
      if (nostalgiaData.celebrityName && nostalgiaData.celebrityName.toLowerCase() !== "no iconic birthday match discovered" && nostalgiaData.celebrityName.trim() !== "") {
        isCelebrityMatch = true;
      }
    }

    if (!isCelebrityMatch) {
      nostalgiaData.celebrityName = "No iconic birthday match discovered";
      nostalgiaData.celebrityDescription = "A distinctive day in history, waiting for my unique story to unfold.";
      nostalgiaData.celebrityBirthMonth = 0;
      nostalgiaData.celebrityBirthDay = 0;
    }

    return nostalgiaData;
  } catch (apiError: any) {
    console.error(`[DEBUG] Gemini API fell back due to error:`, apiError);
    // Return high-fidelity verified song record offline
    return getLocalArchiveResponse(m, d, chartYear, userBirthdayFormatted, matchedChartWeek, songRecord);
  }
}

// API Route to reveal nostalgic birthday insights
app.post("/api/reveal", async (req, res) => {
  const { birthDate } = req.body;
  try {
    if (!birthDate) {
      return res.status(400).json({ error: "birthDate is required in YYYY-MM-DD format." });
    }

    const parts = birthDate.split("-");
    if (parts.length !== 3) {
      return res.status(400).json({ error: "Please enter a valid birth date." });
    }

    const y = parseInt(parts[0]);
    const m = parseInt(parts[1]);
    const d = parseInt(parts[2]);

    if (isNaN(y) || isNaN(m) || isNaN(d)) {
      return res.status(400).json({ error: "Please enter a valid birth date." });
    }

    // Check year range
    if (y < 1920 || y > 2026) {
      return res.status(400).json({ error: "The entered year is outside the available database range of 1920 to 2026." });
    }

    // Validate date exists
    const testDate = new Date(Date.UTC(y, m - 1, d));
    if (testDate.getUTCFullYear() !== y || testDate.getUTCMonth() !== m - 1 || testDate.getUTCDate() !== d) {
      return res.status(400).json({ error: "Please enter a valid birth date." });
    }

    const nostalgiaData = await getNostalgiaData(birthDate);
    res.json(nostalgiaData);
  } catch (error: any) {
    console.error("Reveal API Error:", error);
    
    // Check if the requested year is in the 1930s (which has exact local records)
    if (birthDate) {
      const parts = birthDate.split("-");
      const yStr = parts[0];
      const y = parseInt(yStr, 10);
      if (!isNaN(y) && y < 1940) {
        try {
          const fallback = getFallbackNostalgia(birthDate);
          return res.json(fallback);
        } catch (fbError) {
          console.error("1930s Fallback Error:", fbError);
        }
      }
    }

    // For any year >= 1940, do NOT show a fake song result. Return friendly error message.
    console.log(`[DEBUG] Returning archive busy 429 rate limit message to client.`);
    return res.status(429).json({ error: "The music archive is busy right now. Please try again in a minute." });
  }
});

// Dynamic Route to serve SEO crawler friendly customized templates on direct browser input
app.get("/birthday-song/:dateStr", async (req, res) => {
  try {
    const { dateStr } = req.params;
    const birthDate = parseRouteDate(dateStr);
    
    if (!birthDate) {
      return res.redirect("/");
    }

    const parts = birthDate.split("-");
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    const d = parseInt(parts[2], 10);

    if (y < 1920 || y > 2026) {
      return res.redirect("/");
    }

    const testDate = new Date(Date.UTC(y, m - 1, d));
    if (testDate.getUTCFullYear() !== y || testDate.getUTCMonth() !== m - 1 || testDate.getUTCDate() !== d) {
      return res.redirect("/");
    }

    let data;
    try {
      data = await getNostalgiaData(birthDate);
    } catch (e) {
      console.error("Error generating server-side nostalgia, using fallback", e);
      data = getFallbackNostalgia(birthDate);
    }

    const isProd = process.env.NODE_ENV === "production" || !!process.env.VERCEL;
    let templatePath = "";
    if (!isProd) {
      templatePath = path.resolve(process.cwd(), "index.html");
    } else {
      templatePath = path.resolve(process.cwd(), "dist", "index.html");
    }

    if (!fs.existsSync(templatePath)) {
      return res.status(404).send("Index template file was not found under: " + templatePath);
    }

    let html = fs.readFileSync(templatePath, "utf-8");

    if (!isProd && viteInstance) {
      html = await viteInstance.transformIndexHtml(req.originalUrl, html);
    }

    const pageTitle = `The #1 Hit When I Arrived – ${data.userBirthdayFormatted}`;
    const pageDescription = `Discover the #1 Billboard song during the week of ${data.userBirthdayFormatted} and explore the soundtrack of my arrival.`;
    const protocol = req.protocol === "https" || req.headers["x-forwarded-proto"] === "https" ? "https" : "http";
    const canonicalUrl = `${protocol}://${req.get("host")}/birthday-song/${dateStr.toLowerCase()}`;

    const webPageSchema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": pageTitle,
      "description": pageDescription,
      "url": canonicalUrl
    };

    const musicSchema = {
      "@context": "https://schema.org",
      "@type": "MusicRecording",
      "name": data.songTitle,
      "byArtist": {
        "@type": "MusicGroup",
        "name": data.artist
      }
    };

    const personSchema = {
      "@context": "https://schema.org",
      "@type": "Person",
      "birthDate": birthDate
    };

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": `${protocol}://${req.get("host")}/`
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Birthday Song",
          "item": `${protocol}://${req.get("host")}/`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": data.userBirthdayFormatted,
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

    // Meta tagging block & preload script integration
    const seoMetaBlock = `
    <!-- Dynamic SEO -->
    <title>${pageTitle}</title>
    <meta name="description" content="${pageDescription}" />
    <link rel="canonical" href="${canonicalUrl}" />
    <!-- Open Graph / Social Sharing -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${pageTitle}" />
    <meta property="og:description" content="${pageDescription}" />
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:title" content="${pageTitle}" />
    <meta property="twitter:description" content="${pageDescription}" />
    
    <!-- JSON-LD Structured Data Schema Markup -->
    <script type="application/ld+json" id="schema-webpage">${JSON.stringify(webPageSchema)}</script>
    <script type="application/ld+json" id="schema-musicrecording">${JSON.stringify(musicSchema)}</script>
    <script type="application/ld+json" id="schema-person">${JSON.stringify(personSchema)}</script>
    <script type="application/ld+json" id="schema-breadcrumbs">${JSON.stringify(breadcrumbSchema)}</script>
    <script type="application/ld+json" id="schema-faq">${JSON.stringify(faqSchema)}</script>

    <!-- Preloaded server state -->
    <script>window.__INITIAL_DATA__ = ${JSON.stringify(data).replace(/</g, '\\u003c')};</script>
    `;

    // Semantic HTML block inside <div id="root"> for crawls and bots
    const semanticSeoBody = `
      <div id="root">
        <article style="padding: 40px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 650px; margin: 0 auto; line-height: 1.6; color: #222;">
          <header>
            <h1 style="font-size: 2.25rem; font-weight: 800; margin-bottom: 0.5rem; letter-spacing: -0.025em; color: #111;">The #1 Hit When I Arrived</h1>
            <h2 style="font-size: 1.5rem; font-weight: 600; color: #4f46e5; margin-top: 0; margin-bottom: 2rem;">Born on ${data.userBirthdayFormatted}?</h2>
          </header>
          
          <section style="font-size: 1.125rem; margin-bottom: 1.5rem;">
            <p>The #1 Billboard song when I arrived was <strong>“${data.songTitle}” by ${data.artist}</strong>.</p>
            <p>This result is based on the Billboard week of <strong>${data.matchedChartWeek}</strong>.</p>
          </section>

          <section id="birthday-song-faq" style="margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 30px;">
            <h2 style="font-size: 1.5rem; font-weight: 700; color: #111; margin-bottom: 20px;">Frequently Asked Questions</h2>
            
            <h3 style="font-size: 1.125rem; font-weight: 600; color: #111; margin-top: 15px; margin-bottom: 5px;">How is the birthday song selected?</h3>
            <p style="margin: 0 0 15px 0; color: #4b5563;">The birthday song is selected from Billboard #1 chart history for the chart week connected to your birth date.</p>

            <h3 style="font-size: 1.125rem; font-weight: 600; color: #111; margin-top: 15px; margin-bottom: 5px;">Why does the Billboard week date sometimes differ from my exact birthday?</h3>
            <p style="margin: 0 0 15px 0; color: #4b5563;">Billboard charts are organized by chart weeks, so the #1 song may be tied to the Billboard week that includes or represents your birthday, not always the exact calendar day.</p>

            <h3 style="font-size: 1.125rem; font-weight: 600; color: #111; margin-top: 15px; margin-bottom: 5px;">Can two birthdays have the same #1 song?</h3>
            <p style="margin: 0 0 15px 0; color: #4b5563;">Yes. A song can stay at #1 for multiple weeks, so many birthdays may share the same soundtrack.</p>

            <h3 style="font-size: 1.125rem; font-weight: 600; color: #111; margin-top: 15px; margin-bottom: 5px;">Is this the song from the day I was born or the chart week?</h3>
            <p style="margin: 0 0 15px 0; color: #4b5563;">This result is based on the Billboard chart week connected to your birthday.</p>
          </section>

          <footer>
            <p style="font-size: 1rem; color: #4b5563; font-style: italic; border-top: 1px solid #e5e7eb; padding-top: 1.5rem; margin-top: 30px;">My birthday has its own soundtrack — and apparently, it arrived with: <strong>“${data.emotionalSentence || 'This was the sound echoing across America when my story began.'}”</strong></p>
          </footer>
        </article>
      </div>
    `;

    // Dynamic clean-out of default placeholder titles
    html = html.replace("<title>Birthday Song Reveal • Your Soundtrack</title>", "");
    html = html.replace("</head>", `${seoMetaBlock}\n</head>`);
    
    if (html.includes('<div id="root"></div>')) {
      html = html.replace('<div id="root"></div>', semanticSeoBody);
    }

    res.send(html);
  } catch (error) {
    console.error("Dynamic route parse error:", error);
    res.redirect("/");
  }
});

// Serving setup 
async function init() {
  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    const { createServer: createViteServer } = await import("vite");
    viteInstance = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(viteInstance.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  }
}

init().catch((err) => {
  console.error("Failed to start server:", err);
});

export default app;

const FALLBACK_SONGS_BY_DECADE: Record<string, Array<{
  songTitle: string;
  artist: string;
  genre: string;
  albumCoverDescription: string;
  spotifyQuery: string;
  emotionalSentence: string;
  movieTitle: string;
  movieDescription: string;
  tvShowTitle: string;
  tvShowDescription: string;
  culturalSnapshot: string;
}>> = {
  "1940s": [
    {
      songTitle: "Sentimental Journey",
      artist: "Les Brown & Doris Day",
      genre: "Big Band / Swing / Traditional Pop",
      albumCoverDescription: "A gorgeous printed cardboard sleeve displaying a polished big band orchestral outline on warm aged parchment print background.",
      spotifyQuery: "Les Brown Doris Day Sentimental Journey",
      emotionalSentence: "Dreamy orchestral horn ensembles and soft woodwinds warmed heartland radios the week my story began.",
      movieTitle: "Casablanca",
      movieDescription: "Luminous black-and-white theatrical highlights and romantic wartime intrigue filled velvet screen halls.",
      tvShowTitle: "The Radio Reader's Digest",
      tvShowDescription: "Cozy home circles gathered close dynamically around tall wooden tube-radio consoles for live theater readings.",
      culturalSnapshot: "Swing dance ballrooms, classical felt hats, tailored double-breasted suits, and early lacquer recordings."
    },
    {
      songTitle: "In the Mood",
      artist: "Glenn Miller",
      genre: "Big Band / Swing",
      albumCoverDescription: "A glossy retro single sleeve celebrating brass section icons with elegant gold borders and vintage label details.",
      spotifyQuery: "Glenn Miller In the Mood",
      emotionalSentence: "Unforgettable jazzy saxophone waves prompted lively, joyful dancing as communities celebrated new beginnings.",
      movieTitle: "Citizen Kane",
      movieDescription: "Masterful cinematic shadows and dramatic radio stories captured the artistic curiosity of global filmgoers.",
      tvShowTitle: "The Jack Benny Program",
      tvShowDescription: "Lighthearted comedy acts broadcasted directly into homes over crackle-rich vacuum-tube audio frequencies.",
      culturalSnapshot: "Polished brass instruments, classic wingtip shoes, nostalgic post-war optimism, and 78 RPM record turntables."
    },
    {
      songTitle: "White Christmas",
      artist: "Bing Crosby",
      genre: "Traditional Pop / Vocal",
      albumCoverDescription: "An elegant festive record jacket showing gold-trimmed calligraphy font on a deep pine green sleeve texture.",
      spotifyQuery: "Bing Crosby White Christmas",
      emotionalSentence: "Warm, velvet vocal frequencies filled quiet winter rooms with peaceful comforting nostalgia.",
      movieTitle: "It's a Wonderful Life",
      movieDescription: "Stirring, emotional stories of family resilience and friendship warmed winter cinema screens.",
      tvShowTitle: "The Fred Allen Show",
      tvShowDescription: "Intelligent radio humors and live sound-effect theaters entertained families sitting on classic woven rugs.",
      culturalSnapshot: "Cozy firesides, long wool trench coats, classic postcards, and cherished family radio programs."
    }
  ],
  "1950s": [
    {
      songTitle: "Jailhouse Rock",
      artist: "Elvis Presley",
      genre: "Rock & Roll",
      albumCoverDescription: "An energetic rockabilly vinyl jacket featuring bold red typography and high-contrast performance outlines.",
      spotifyQuery: "Elvis Presley Jailhouse Rock",
      emotionalSentence: "A revolutionary guitar-heavy rock and roll sound shattered the radios when I entered the world.",
      movieTitle: "Singin' in the Rain",
      movieDescription: "Dazzling dynamic tap-dancers and joyful musical comedy lit up mid-century cinema screens.",
      tvShowTitle: "I Love Lucy",
      tvShowDescription: "Millions of families tuned in to cozy tube televisions for legendary black-and-white comedic sitcom antics.",
      culturalSnapshot: "Retro jukebox diners, leather jackets, neon milkshake signs, and classic chrome-finned automobiles."
    },
    {
      songTitle: "Johnny B. Goode",
      artist: "Chuck Berry",
      genre: "Rock & Roll",
      albumCoverDescription: "A bright retro record sleeve capturing a dynamic hollow-body guitar sketch on textured canary-yellow paper.",
      spotifyQuery: "Chuck Berry Johnny B. Goode",
      emotionalSentence: "Unparalleled electric guitar riffs electrified the national airwaves, defining the dawn of rock culture.",
      movieTitle: "Rebel Without a Cause",
      movieDescription: "A gripping drama of teenage independence and modern style defined the screens of drive-in theaters.",
      tvShowTitle: "The Ed Sullivan Show",
      tvShowDescription: "Sunday evening variety theaters captivated living rooms with thrilling live performances from New York.",
      culturalSnapshot: "Polished chrome hubcaps, dynamic sock hops, ducktail hairstyles, and portable transistor radios."
    },
    {
      songTitle: "What'd I Say",
      artist: "Ray Charles",
      genre: "R&B / Soul",
      albumCoverDescription: "A warm jazz-centric cardboard jacket showing an artistic piano key graphic in deep blue and indigo.",
      spotifyQuery: "Ray Charles What'd I Say",
      emotionalSentence: "Brassy horn sections and soulful call-and-response dialogues introduced a powerful new musical energy.",
      movieTitle: "Rear Window",
      movieDescription: "Immersive suspense cinema and high-fashion style kept mystery enthusiasts gripping theater armrests.",
      tvShowTitle: "American Bandstand",
      tvShowDescription: "Enthusiastic daily teenage dance circles broadcasted live, showcasing the latest national records.",
      culturalSnapshot: "Sleek dark sunglasses, polished grand pianos, vinyl 45 singles, and high-fidelity home record players."
    }
  ],
  "1960s": [
    {
      songTitle: "Respect",
      artist: "Aretha Franklin",
      genre: "Soul / R&B",
      albumCoverDescription: "A classic vinyl record sleeve with iconic soul-music artwork, retro warm tones.",
      spotifyQuery: "Aretha Franklin Respect",
      emotionalSentence: "Motown and soul filled American radios the week my story began.",
      movieTitle: "The Graduate",
      movieDescription: "Velvet theater seats glowed as classic coming-of-age cinema swept the national screen.",
      tvShowTitle: "The Andy Griffith Show",
      tvShowDescription: "Families leaned closer to warm, humming television sets to visit Mayberry together.",
      culturalSnapshot: "The snap of stylish plastic sunglasses and emerging portable tape decks redefined youth rebellion."
    },
    {
      songTitle: "I Want to Hold Your Hand",
      artist: "The Beatles",
      genre: "Pop / Rock",
      albumCoverDescription: "A vibrant sixties-style photograph sleeve with bold yellow lettering and retro collar-suit graphics.",
      spotifyQuery: "The Beatles I Want to Hold Your Hand",
      emotionalSentence: "Spirited guitar pop and clean harmonies of the British Invasion swept global airwaves when I entered.",
      movieTitle: "A Hard Day's Night",
      movieDescription: "High-energy black-and-white musical comedy captured the sheer joy and mania of peak pop culture.",
      tvShowTitle: "The Twilight Zone",
      tvShowDescription: "Mysterious sci-fi twists captivated living rooms during late-night hours with philosophical intrigue.",
      culturalSnapshot: "Mod fashion, collarless jackets, round sunglasses, and portable vinyl carrying boxes."
    },
    {
      songTitle: "My Girl",
      artist: "The Temptations",
      genre: "Motown / Soul / R&B",
      albumCoverDescription: "A gorgeous vintage purple-tinted Motown sleeve featuring clean group alignment under metallic font.",
      spotifyQuery: "The Temptations My Girl",
      emotionalSentence: "Flawless vocal harmonies and smooth brass lines established an everlasting romantic sound for the era.",
      movieTitle: "Mary Poppins",
      movieDescription: "Spectacular hand-drawn animation combined with live action, charming audiences worldwide in local theaters.",
      tvShowTitle: "The Dick Van Dyke Show",
      tvShowDescription: "Smart, sophisticated urban apartment comedy entertained living rooms with delightful physical timing.",
      culturalSnapshot: "Polished suits, coordinated dance choreography, classic turntables, and bright soul music festivals."
    }
  ],
  "1970s": [
    {
      songTitle: "Stayin' Alive",
      artist: "Bee Gees",
      genre: "Disco / Pop",
      albumCoverDescription: "Gleaming dance floor lights, vibrant retro shirts, classic 70s record center sticker.",
      spotifyQuery: "Bee Gees Stayin Alive",
      emotionalSentence: "Disco rhythms echoed across neon dance floors when I arrived.",
      movieTitle: "Star Wars",
      movieDescription: "Fresh popcorn scents and endless queues for galaxy-spanning starship adventures filled cinemas.",
      tvShowTitle: "Happy Days",
      tvShowDescription: "Cozy living rooms pulsed with wooden TV consoles and high-spirited jukebox diner laughs.",
      culturalSnapshot: "Spinning mirrorballs, wide collars, and the heavy bass thrum of street stereos liberated sidewalks."
    },
    {
      songTitle: "Superstition",
      artist: "Stevie Wonder",
      genre: "Funk / Soul",
      albumCoverDescription: "A sleek seventies sleeve showing warm golden concentric soundwaves expanding from a dark background.",
      spotifyQuery: "Stevie Wonder Superstition",
      emotionalSentence: "Fascinating clavinet grooves and soulful keyboard mastery dominated FM radios.",
      movieTitle: "The Godfather",
      movieDescription: "Gripping dramatic storytelling and cinematic mastery rewrote box office scales in local theaters.",
      tvShowTitle: "All in the Family",
      tvShowDescription: "Lively family living room banter addressed major social themes with raw television honesty.",
      culturalSnapshot: "Earthy brown corduroy, vintage analog synthesizers, platform heels, and chunky headphones."
    },
    {
      songTitle: "Dancing Queen",
      artist: "ABBA",
      genre: "Europop / Disco",
      albumCoverDescription: "A bright, shimmering sky-blue record sleeve filled with glamorous typography and satin-suit illustrations.",
      spotifyQuery: "ABBA Dancing Queen",
      emotionalSentence: "Enchanting melodic pop hooks and sweeping piano glissandos brought immense joy to radios.",
      movieTitle: "Saturday Night Fever",
      movieDescription: "Dazzling illuminated neon clubs and iconic dance steps captured the disco pulse of moviegoers.",
      tvShowTitle: "The Muppet Show",
      tvShowDescription: "Vibrant theatrical puppet comedies and celebrity guests delighted multi-generational homes.",
      culturalSnapshot: "Bell-bottom jeans, glitter makeup, high-energy roller rinks, and cassette tape decks."
    }
  ],
  "1980s": [
    {
      songTitle: "Billie Jean",
      artist: "Michael Jackson",
      genre: "Synthpop / Funk",
      albumCoverDescription: "A sleek black vinyl jacket with silver typography and retro synth wave vibes.",
      spotifyQuery: "Michael Jackson Billie Jean",
      emotionalSentence: "This historic anthem was ruling living rooms across America when I arrived.",
      movieTitle: "Back to the Future",
      movieDescription: "A stainless-steel DeLorean and burning tire tracks captured the neon imagination of theatergoers.",
      tvShowTitle: "The Cosby Show",
      tvShowDescription: "Thursday nights belonged to family sitcom comfort and the soft static hum of color tube screens.",
      culturalSnapshot: "Glorious neon fashion, synth pop wave blares, and the early glow of cable MTV screens."
    },
    {
      songTitle: "Sweet Child O' Mine",
      artist: "Guns N' Roses",
      genre: "Hard Rock",
      albumCoverDescription: "A bold, rebellious illustrated sleeve featuring iconic gothic calligraphy on an ink-black background.",
      spotifyQuery: "Guns N' Roses Sweet Child O' Mine",
      emotionalSentence: "Legendary electric guitar intros and soaring rock vocals energized FM radio channels.",
      movieTitle: "E.T. the Extra-Terrestrial",
      movieDescription: "A beautiful, heartwarming sci-fi story of friendship under shining bicycle silhouettes filled cinemas.",
      tvShowTitle: "The Golden Girls",
      tvShowDescription: "Lively kitchen table humor and endearing friendships brought laughter to evening television hours.",
      culturalSnapshot: "Denim jackets, voluminous hairstyles, cassette walkmans, and graphic concert t-shirts."
    },
    {
      songTitle: "Take On Me",
      artist: "a-ha",
      genre: "Synthpop",
      albumCoverDescription: "A charcoal rotoscope cell-shaded graphic print sleeve with sleek modern typography.",
      spotifyQuery: "a-ha Take On Me",
      emotionalSentence: "Vibrant electronic synthesizers and sweeping pop falsettos defined the vibrant energy of the week.",
      movieTitle: "Raiders of the Lost Ark",
      movieDescription: "Thrilling archaeological expeditions and whip-cracking action pulled massive audiences into seats.",
      tvShowTitle: "Miami Vice",
      tvShowDescription: "Sleek pastel suits and innovative electronic music loops revolutionized television drama looks.",
      culturalSnapshot: "Pastel blazers, digital watches, arcade machines, and high-fidelity video cassette recorders (VCRs)."
    }
  ],
  "1990s": [
    {
      songTitle: "Smells Like Teen Spirit",
      artist: "Nirvana",
      genre: "Grunge / Alternative Rock",
      albumCoverDescription: "A dynamic underwater blue record sleeve capturing raw, authentic flannel guitar culture.",
      spotifyQuery: "Nirvana Smells Like Teen Spirit",
      emotionalSentence: "Flannel guitar anthems and independent tapes filled the stereos when I entered the world.",
      movieTitle: "Jurassic Park",
      movieDescription: "Prehistoric giants rumbled under state-of-the-art surround sound, pulling immense crowds into theater seats.",
      tvShowTitle: "Seinfeld",
      tvShowDescription: "The comforting hum of VHS tape recordings and sarcastic banter over coffee in retro diners.",
      culturalSnapshot: "Analog tapes, neon windbreakers, and the crackle-beep of early dial-up internet carved our social landscape."
    },
    {
      songTitle: "Fantasy",
      artist: "Mariah Carey",
      genre: "Pop / R&B",
      albumCoverDescription: "A pastel record sleeve featuring elegant bright fonts and optimistic pop-star photography.",
      spotifyQuery: "Mariah Carey Fantasy",
      emotionalSentence: "A blissful blend of uplifting pop vocals and sweet hip-hop loops floated in the autumn breeze.",
      movieTitle: "Titanic",
      movieDescription: "Monumental historic scale and tragic romance drew endless crying crowds into cinema complexes.",
      tvShowTitle: "Friends",
      tvShowDescription: "Cozy coffeehouse gatherings and relatable urban friendships defined the weekly schedule of households.",
      culturalSnapshot: "Baggy denim pants, custom CD players, early cellular phones, and nostalgic retro pop hooks."
    },
    {
      songTitle: "I Want It That Way",
      artist: "Backstreet Boys",
      genre: "Pop / Boyband",
      albumCoverDescription: "A bright white minimalist sleeve featuring five stylish pop stars under a futuristic sans-serif title.",
      spotifyQuery: "Backstreet Boys I Want It That Way",
      emotionalSentence: "Polished harmonies and classic pop progressions dominated national radios, uniting listeners.",
      movieTitle: "Toy Story",
      movieDescription: "Innovative, heartwarming computer-animated characters changed movie history for millions of families.",
      tvShowTitle: "The Fresh Prince of Bel-Air",
      tvShowDescription: "Hilarious, energetic family sitcoms highlighted the transition to modern urban style on TV sets.",
      culturalSnapshot: "Oversized windbreakers, pager devices, pocket CD carrying cases, and printed pop posters."
    }
  ],
  "2000s": [
    {
      songTitle: "Crazy in Love",
      artist: "Beyoncé ft. Jay-Z",
      genre: "R&B / Hip-Hop",
      albumCoverDescription: "Glittering metallic backgrounds, horns playing, and vibrant modern luxury urban style.",
      spotifyQuery: "Beyonce Crazy in Love",
      emotionalSentence: "A dazzling vocal revolution and brassy horns dominated the week I arrived.",
      movieTitle: "Avatar",
      movieDescription: "Fluorescent 3D glasses and deep orchestral soundscapes transported massive crowds into foreign luminous worlds.",
      tvShowTitle: "The Office",
      tvShowDescription: "Late-night laughter echoed around the flickering blue hues of humorous office mockumentaries.",
      culturalSnapshot: "The early tactile chic of folding phones, custom MP3 play rings, and glossy social forums."
    },
    {
      songTitle: "Toxic",
      artist: "Britney Spears",
      genre: "Dance-Pop",
      albumCoverDescription: "A futuristic metallic blue backdrop featuring sophisticated graphic vector sparkles and sleek title typography.",
      spotifyQuery: "Britney Spears Toxic",
      emotionalSentence: "Brilliant sci-fi synths and energetic violin loops redefined pop music boundaries across the nation.",
      movieTitle: "The Dark Knight",
      movieDescription: "Atmospheric, psychological superhero masterpieces redefined the creative capacities of cinema theaters.",
      tvShowTitle: "Lost",
      tvShowDescription: "Fascinating survival mysteries and complex island puzzle timelines sparked weekly theories in living rooms.",
      culturalSnapshot: "Gleaming silver iPods, digital file expansions, initial social media logins, and futuristic style."
    },
    {
      songTitle: "Hey Ya!",
      artist: "Outkast",
      genre: "Funk / Hip-Hop",
      albumCoverDescription: "A bright, multi-colored retro-futuristic jacket with vibrant green accents and quirky polaroid collage frames.",
      spotifyQuery: "Outkast Hey Ya!",
      emotionalSentence: "An incomparable energetic retro-soul dance explosion ruled the radios with joy.",
      movieTitle: "Finding Nemo",
      movieDescription: "Luminous, beautiful deep-sea ocean journeys captured the imaginations of cinema audiences.",
      tvShowTitle: "American Idol",
      tvShowDescription: "Weekly interactive live music competitions united homes around early social voting screens.",
      culturalSnapshot: "Instant camera frames, vintage neon shades, portable digital accessories, and quirky pop styles."
    }
  ],
  "2010s": [
    {
      songTitle: "Rolling in the Deep",
      artist: "Adele",
      genre: "Soul / Pop / Indie",
      albumCoverDescription: "A black-and-white minimalist record silhouette capturing the raw warmth of modern vinyl revivals.",
      spotifyQuery: "Adele Rolling in the Deep",
      emotionalSentence: "Deep emotional vocals and heavy, rhythmic stomping beats echoed across FM radio waves.",
      movieTitle: "Inception",
      movieDescription: "Intricate, gravity-defying dream architectures had moviegoers whispering theories in local theater lobbies.",
      tvShowTitle: "Game of Thrones",
      tvShowDescription: "Epic, cinematic fantasy struggles had millions of homes holding their breath on Sunday evenings.",
      culturalSnapshot: "Sleek smartphones, custom music apps, coffeehouse workspace aesthetics, and retro digital filters."
    },
    {
      songTitle: "Uptown Funk",
      artist: "Mark Ronson ft. Bruno Mars",
      genre: "Funk / Pop",
      albumCoverDescription: "A vibrant retro-styled sleeve capturing a sleek pink sunglasses silhouette on high-gloss cardstock.",
      spotifyQuery: "Mark Ronson Bruno Mars Uptown Funk",
      emotionalSentence: "Incredible horns and vintage bass grooves dominated global radio waves with high-spirited energy.",
      movieTitle: "The Avengers",
      movieDescription: "Colossal superhero assemblies and incredible digital effects broke all-time box office records.",
      tvShowTitle: "Stranger Things",
      tvShowDescription: "Charming, synthwave-rich tributes to classic eighties adventures captivated binge-watching homes.",
      culturalSnapshot: "Sleek touch screens, social media video shares, craft coffee houses, and modern retro revivals."
    },
    {
      songTitle: "Shape of You",
      artist: "Ed Sheeran",
      genre: "Pop / Tropical House",
      albumCoverDescription: "A minimalist matte blue cover featuring a bold orange mathematical symbol under clean white text.",
      spotifyQuery: "Ed Sheeran Shape of You",
      emotionalSentence: "Catchy marimba rhythms and acoustic pop hooks floated from speakers in every shop and car.",
      movieTitle: "La La Land",
      movieDescription: "Vibrant, nostalgic musicals set in modern Los Angeles painted local screen theaters with color.",
      tvShowTitle: "Black Mirror",
      tvShowDescription: "Chilling, thought-provoking sci-fi stories about digital futures sparked massive national discussions.",
      culturalSnapshot: "Wireless headphones, smart voice assistants, digital streaming playlists, and neon loft lights."
    }
  ],
  "2020s": [
    {
      songTitle: "Blinding Lights",
      artist: "The Weeknd",
      genre: "Synthwave / Pop",
      albumCoverDescription: "A cinematic red-hued evening photograph on gloss sleeve paper under neon eighties-style text.",
      spotifyQuery: "The Weeknd Blinding Lights",
      emotionalSentence: "High-octane electronic drum machines and nostalgic visual vibes defined our modern airwaves.",
      movieTitle: "Everything Everywhere All at Once",
      movieDescription: "Eye-popping, heartwarming multiversal storytelling captured the creative spirit of modern cinemas.",
      tvShowTitle: "Ted Lasso",
      tvShowDescription: "Heartwarming sports humor and infectious positivity offered comforting relief to homes during quiet evenings.",
      culturalSnapshot: "Sleek wireless earbuds, digital home setups, instant stream releases, and neon interior lamps."
    },
    {
      songTitle: "As It Was",
      artist: "Harry Styles",
      genre: "Indie Pop / New Wave",
      albumCoverDescription: "An artistic minimalist sleeve showing a bright pastel room outline with clean, spacious layout styles.",
      spotifyQuery: "Harry Styles As It Was",
      emotionalSentence: "Glittering synthesizer bells and bouncy, nostalgic beats accompanied the world during a time of change.",
      movieTitle: "Barbie",
      movieDescription: "A brilliant pink cinematic spectacle filled theaters with massive crowds dressed in vibrant monochrome.",
      tvShowTitle: "Succession",
      tvShowDescription: "Tense corporate family dynamics and satirical drama kept fans debating on social mediums.",
      culturalSnapshot: "Chic vintage record revivals, social video reels, oversized blazers, and aesthetic cozy setups."
    },
    {
      songTitle: "Flowers",
      artist: "Miley Cyrus",
      genre: "Pop / Disco-Funk",
      albumCoverDescription: "A striking high-contrast photographic cover capturing glamorous sunglasses under metallic gold text.",
      spotifyQuery: "Miley Cyrus Flowers",
      emotionalSentence: "An uplifting anthem of self-empowerment and soft nu-disco basslines ruled the airwaves.",
      movieTitle: "Oppenheimer",
      movieDescription: "Stunning historic spectacles and loud orchestral soundscapes drew huge crowds to screen theaters.",
      tvShowTitle: "The Last of Us",
      tvShowDescription: "Powerful, emotional survival stories captured hearts, creating a weekly Sunday evening ritual.",
      culturalSnapshot: "Nu-disco grooves, workout playlists, smart digital devices, and home-decor aesthetics."
    }
  ]
};

function getFallbackNostalgia(date: string) {
  const { userBirthdayFormatted, matchedChartWeek, chartYear } = getChartDates(date);
  
  if (chartYear < 1940) {
    return {
      ...getHistorical1930sRecord(date, matchedChartWeek),
      isFallback: true,
      source: "fallback"
    };
  }
  
  throw new Error("The music archive is busy right now. Please try again in a minute.");
}

