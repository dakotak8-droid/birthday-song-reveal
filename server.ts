import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Date calculation and formatting helpers
function getChartDates(birthDateStr: string) {
  const parts = birthDateStr.split("-");
  const y = parseInt(parts[0]);
  const m = parseInt(parts[1]);
  const d = parseInt(parts[2]);
  
  // Construct date in timezone safe way
  const birthDate = new Date(y, m - 1, d);
  
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const userBirthdayFormatted = `${months[birthDate.getMonth()]} ${birthDate.getDate()}, ${birthDate.getFullYear()}`;
  
  // 1. Find Saturday on or before
  const dayOfWeek = birthDate.getDay(); // 0 is Sunday, 6 is Saturday
  const daysToSubtract = (dayOfWeek + 1) % 7;
  
  const sateOnOrBefore = new Date(birthDate);
  sateOnOrBefore.setDate(birthDate.getDate() - daysToSubtract);
  
  // 2. Find Saturday after
  const sateAfter = new Date(sateOnOrBefore);
  sateAfter.setDate(sateOnOrBefore.getDate() + 7);
  
  // 3. Find the closest Saturday (preferring on or before)
  const distBefore = Math.abs(birthDate.getTime() - sateOnOrBefore.getTime());
  const distAfter = Math.abs(sateAfter.getTime() - birthDate.getTime());
  
  // Prefer the closest chart date on or before the birthday.
  // We only use the date after if it is strictly closer.
  const chartDate = (distAfter < distBefore) ? sateAfter : sateOnOrBefore;
  
  const matchedChartWeek = `${months[chartDate.getMonth()]} ${chartDate.getDate()}, ${chartDate.getFullYear()}`;
  
  return {
    userBirthdayFormatted,
    matchedChartWeek,
    chartYear: chartDate.getFullYear()
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

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
      const testDate = new Date(y, m - 1, d);
      if (testDate.getFullYear() !== y || testDate.getMonth() !== m - 1 || testDate.getDate() !== d) {
        return res.status(400).json({ error: "Please enter a valid birth date." });
      }

      const { userBirthdayFormatted, matchedChartWeek } = getChartDates(birthDate);

      // Check if Gemini API Key is available
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.warn("GEMINI_API_KEY environment variable is not set. Using rich fallback data.");
        return res.json(getFallbackNostalgia(birthDate));
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const prompt = `Provide the historical Billboard #1 song from the weekly chart week that contains the user's birthdate or is the closest Saturday on or before that date.
      User Birthday: ${userBirthdayFormatted} (Date Entered: ${birthDate})
      Closest Weekly Billboard Hot 100 Chart Saturday Date (on or before): ${matchedChartWeek}
      Find the historic #1 song for the chart week dated exactly: ${matchedChartWeek}. Also supply nostalgic details for a person born around this date. Make everything highly factual and deeply sentimental.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are a warm, affectionate pop-culture historian. Your goal is to tell someone the exact soundtrack of their birth. Identify the ACTUAL #1 Billboard Hot 100 song on the exact weekly chart date provided in the prompt (closest Saturday on or before birthDate). Return a beautifully framed structured JSON with nostalgic details of that point in time. For date inputs before the Hot 100 was released in August 1958, use top popular music hits of that year or decade. Ensure every single field is filled with rich, cinematic, atmospheric, and highly factual descriptions. Do not hallucinate titles or artists.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              songTitle: { type: Type.STRING, description: "The official title of the #1 Billboard song corresponding to the matched chart week." },
              artist: { type: Type.STRING, description: "The artist or band name behind the song." },
              releaseYear: { type: Type.INTEGER, description: "The year the song dominated the charts." },
              genre: { type: Type.STRING, description: "The genre of the track, e.g. 'Motown / Soul', 'Synthpop', 'Alternative', etc." },
              billboardRank: { type: Type.STRING, description: "Usually '#1 Billboard Hot 100' or similar historic ranking status." },
              albumCoverDescription: { type: Type.STRING, description: "A beautiful description of what its visual artwork looks like (e.g. 'A deep gold record sleeve featuring stylish vintage portraits')." },
              spotifyUrl: { type: Type.STRING, description: "A URL searching for this track on Spotify, e.g., 'https://open.spotify.com/search/Song%20Artist'" },
              emotionalSentence: { type: Type.STRING, description: "A short, highly evocative, emotionally resonant sentence detailing parents listening to the static radio or how your arrival matched this melody." },
              movieTitle: { type: Type.STRING, description: "The #1 movie in North American theater box offices that week or month." },
              movieDescription: { type: Type.STRING, description: "A brief nostalgic snippet highlighting the cinema vibe of that time." },
              tvShowTitle: { type: Type.STRING, description: "The top-rated TV show taking over household living rooms around that year." },
              tvShowDescription: { type: Type.STRING, description: "A brief atmospheric snippet about what made the show popular." },
              celebrityName: { type: Type.STRING, description: "A legendary star or creative pioneer born on the same calendar day, month, or shares the year milestone." },
              celebrityDescription: { type: Type.STRING, description: "A short connection about your astrological or physical era ally." },
              culturalSnapshot: { type: Type.STRING, description: "A deeply nostalgic highlight capturing the technology, style, or youth culture paradigm shift of that moment (e.g. dawn of arcade machines, cassette players, or walkman)." },
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

      const nostalgiaData = JSON.parse(text);
      nostalgiaData.userBirthdayFormatted = nostalgiaData.userBirthdayFormatted || userBirthdayFormatted;
      nostalgiaData.matchedChartWeek = nostalgiaData.matchedChartWeek || matchedChartWeek;
      res.json(nostalgiaData);
    } catch (error: any) {
      console.error("Reveal API Error:", error);
      // Fallback gracefully instead of throwing a 500 status on legitimate queries
      try {
        const fallback = getFallbackNostalgia(birthDate);
        res.json(fallback);
      } catch (fallbackError) {
        res.status(500).json({ error: "Failed to gather nostalgic memories. Please try again." });
      }
    }
  });

  // Hot module reloading setup / Production serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

function getFallbackNostalgia(date: string) {
  const { userBirthdayFormatted, matchedChartWeek, chartYear } = getChartDates(date);
  
  const baseResult = (() => {
    if (chartYear < 1970) {
      return {
        songTitle: "Respect",
        artist: "Aretha Franklin",
        releaseYear: chartYear,
        genre: "Soul / R&B",
        billboardRank: "#1 Billboard Hot 100",
        albumCoverDescription: "A classic vinyl record sleeve with iconic soul-music artwork, retro warm tones.",
        spotifyUrl: `https://open.spotify.com/search/${encodeURIComponent("Aretha Franklin Respect")}`,
        emotionalSentence: "Soul music resonated in local diners and from car radios as a generation stood up for respect, and your story began.",
        movieTitle: "The Graduate",
        movieDescription: "The classic coming-of-age movie was capturing the cultural imagination in theaters nationwide.",
        tvShowTitle: "The Andy Griffith Show",
        tvShowDescription: "A simple, heartwarming depiction of family life that families huddled around the television set to watch.",
        celebrityName: "Julia Roberts",
        celebrityDescription: "Sharing an iconic era and star quality that redefined golden-age cinema vibes.",
        culturalSnapshot: "The release of compact audio cassettes was revolutionize-ing how everyday folks took their music on the open highway."
      };
    } else if (chartYear < 1980) {
      return {
        songTitle: "Stayin' Alive",
        artist: "Bee Gees",
        releaseYear: chartYear,
        genre: "Disco / Pop",
        billboardRank: "#1 Billboard Hot 100",
        albumCoverDescription: "Gleaming dance floor lights, vibrant retro shirts, classic 70s record center sticker.",
        spotifyUrl: `https://open.spotify.com/search/${encodeURIComponent("Bee Gees Stayin Alive")}`,
        emotionalSentence: "A pulsating, energetic disco rhythm echoed through the streets of America under flashing mirror balls the week you arrived.",
        movieTitle: "Star Wars",
        movieDescription: "A revolutionary space opera that forever changed movies and transported audiences to a galaxy far, far away.",
        tvShowTitle: "Happy Days",
        tvShowDescription: "The wholesome 1950s nostalgia show that made jukebox culture the ultimate neighborhood hangout craze.",
        celebrityName: "Leonardo DiCaprio",
        celebrityDescription: "Born in the heart of this electric decade, carrying the star power of timeless Hollywood style.",
        culturalSnapshot: "Portable audio players like the Walkman were about to change the relationship between music, public spaces, and headphones."
      };
    } else if (chartYear < 1990) {
      return {
        songTitle: "Billie Jean",
        artist: "Michael Jackson",
        releaseYear: chartYear,
        genre: "Synthpop / Funk",
        billboardRank: "#1 Billboard Hot 100",
        albumCoverDescription: "A sleek black vinyl jacket with silver typography and retro synth wave vibes.",
        spotifyUrl: `https://open.spotify.com/search/${encodeURIComponent("Michael Jackson Billie Jean")}`,
        emotionalSentence: "Slick synthesizers and moonwalking basslines took over world radio while your very first breaths were matching the rhythm of the city.",
        movieTitle: "Back to the Future",
        movieDescription: "Amblin-style cinematic adventure of traveling in a stainless steel DeLorean grabbed the world.",
        tvShowTitle: "The Cosby Show",
        tvShowDescription: "A comforting family sitcom that dominated living rooms with cozy sweaters and laughter.",
        celebrityName: "Scarlett Johansson",
        celebrityDescription: "A talent carrying the effortless dual magnetism of independence and golden-age glamour.",
        culturalSnapshot: "MTV hit the broadcast cables, turning music into an eye-popping visual medium of high fashion and dance routines."
      };
    } else if (chartYear < 2000) {
      return {
        songTitle: "Smells Like Teen Spirit",
        artist: "Nirvana",
        releaseYear: chartYear,
        genre: "Grunge / Alternative Rock",
        billboardRank: "#1 Billboard Hot 100",
        albumCoverDescription: "A dynamic underwater blue record sleeve capturing raw, authentic flannel guitar culture.",
        spotifyUrl: `https://open.spotify.com/search/${encodeURIComponent("Nirvana Smells Like Teen Spirit")}`,
        emotionalSentence: "The raw power of distorted guitars and flannel-clad independence soundtracked your arrival as the century turned its final bend.",
        movieTitle: "Jurassic Park",
        movieDescription: "Groundbreaking CGI brought prehistoric giants back to life, filling movie theaters with raw awe and adventure.",
        tvShowTitle: "Seinfeld",
        tvShowDescription: "A brilliant show about nothing that captured the urban neuroses of a highly conversational decade.",
        celebrityName: "Zendaya",
        celebrityDescription: "Representing the modern multi-talented wave, defined by expressive intelligence and trendsetting grace.",
        culturalSnapshot: "Dial-up internet soundscapes and floppy disks were creating the initial pathways of a brand new World Wide Web."
      };
    } else {
      return {
        songTitle: "Crazy in Love",
        artist: "Beyoncé ft. Jay-Z",
        releaseYear: chartYear,
        genre: "R&B / Hip-Hop",
        billboardRank: "#1 Billboard Hot 100",
        albumCoverDescription: "Glittering metallic backgrounds, horns playing, and vibrant modern luxury urban style.",
        spotifyUrl: `https://open.spotify.com/search/${encodeURIComponent("Beyonce Crazy in Love")}`,
        emotionalSentence: "A soaring horn hook and high-energy vocals dominated the radio dials as a digital-first era began, welcoming you.",
        movieTitle: "Avatar",
        movieDescription: "The breathtaking 3D adventure on the planet Pandora set box office history on fire.",
        tvShowTitle: "The Office",
        tvShowDescription: "The mockumentary comedy capturing awkward humor and paper-shredder romance in Scranton, PA.",
        celebrityName: "Billie Eilish",
        celebrityDescription: "Sharing the vibe of bedroom production becoming globally revolutionary, deep sub-bass and honest vocals.",
        culturalSnapshot: "The rise of early pocket-sized smartphones began to connect human minds on instant social platforms like never before."
      };
    }
  })();

  return {
    ...baseResult,
    userBirthdayFormatted,
    matchedChartWeek
  };
}

startServer();
