export interface NostalgiaResult {
  songTitle: string;
  artist: string;
  releaseYear: number;
  genre: string;
  billboardRank: string;
  albumCoverDescription: string;
  spotifyUrl: string;
  emotionalSentence: string;
  movieTitle: string;
  movieDescription: string;
  tvShowTitle: string;
  tvShowDescription: string;
  celebrityName: string;
  celebrityDescription: string;
  culturalSnapshot: string;
  userBirthdayFormatted?: string;
  matchedChartWeek?: string;
}

export interface SavedSearch {
  id: string;
  birthDate: string;
  data: NostalgiaResult;
  timestamp: number;
}
