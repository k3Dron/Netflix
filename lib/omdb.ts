// Use the provided OMDB API key
const API_KEY = "3695609f" // OMDB API key
const BASE_URL = "https://www.omdbapi.com"

// Sample data to use when API calls fail
const SAMPLE_MOVIES = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Poster: "N/A",
    Year: "2010",
    Type: "movie",
    Plot: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    imdbRating: "8.8",
  },
  {
    imdbID: "tt0111161",
    Title: "The Shawshank Redemption",
    Poster: "N/A",
    Year: "1994",
    Type: "movie",
    Plot: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    imdbRating: "9.3",
  },
  {
    imdbID: "tt0468569",
    Title: "The Dark Knight",
    Poster: "N/A",
    Year: "2008",
    Type: "movie",
    Plot: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    imdbRating: "9.0",
  },
  {
    imdbID: "tt0110912",
    Title: "Pulp Fiction",
    Poster: "N/A",
    Year: "1994",
    Type: "movie",
    Plot: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    imdbRating: "8.9",
  },
  {
    imdbID: "tt0167260",
    Title: "The Lord of the Rings: The Return of the King",
    Poster: "N/A",
    Year: "2003",
    Type: "movie",
    Plot: "Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.",
    imdbRating: "8.9",
  },
]

// Define the Movie interface based on OMDB API response
export interface Movie {
  imdbID: string
  Title: string
  Poster: string
  Year: string
  Type: string
  Plot?: string
  imdbRating?: string
  Released?: string
  Runtime?: string
  Genre?: string
  Director?: string
  Actors?: string
}

// Helper function to make API requests with better error handling
async function fetchFromOMDB(params: string): Promise<any> {
  try {
    const url = `${BASE_URL}/?apikey=${API_KEY}${params}`
    console.log(`Fetching from OMDB: ${params}`)

    const res = await fetch(url, {
      next: { revalidate: 60 * 60 }, // Revalidate every hour
    })

    if (!res.ok) {
      console.error(`OMDB API Error: ${res.status} ${res.statusText} for ${params}`)
      return null
    }

    const data = await res.json()

    // OMDB returns { Response: "False", Error: "..." } when there's an error
    if (data.Response === "False") {
      console.error(`OMDB API Error: ${data.Error} for ${params}`)
      return null
    }

    return data
  } catch (error) {
    console.error(`Error fetching from OMDB (${params}):`, error)
    return null
  }
}

// Check if we can connect to the OMDB API
export async function checkOMDBConnection(): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/?apikey=${API_KEY}&t=inception`)
    const data = await response.json()
    return data.Response === "True"
  } catch (error) {
    console.error("Failed to connect to OMDB API:", error)
    return false
  }
}

// Search movies
export async function searchMovies(query: string): Promise<Movie[]> {
  if (!query) return []

  const data = await fetchFromOMDB(`&s=${encodeURIComponent(query)}&type=movie`)

  if (!data || !data.Search || data.Search.length === 0) {
    console.log(`No results found for search query: ${query}`)
    return []
  }

  return data.Search
}

// Fetch movie details
export async function fetchMovieDetails(imdbID: string): Promise<Movie | null> {
  const data = await fetchFromOMDB(`&i=${imdbID}&plot=full`)

  if (!data || data.Response === "False") {
    console.log(`No details found for movie ID: ${imdbID}`)
    return null
  }

  return data
}

// Fetch popular movies (using predefined searches since OMDB doesn't have a trending endpoint)
export async function fetchPopularMovies(): Promise<Movie[]> {
  // We'll use a search for popular terms to simulate trending movies
  const data = await fetchFromOMDB(`&s=marvel&type=movie`)

  if (!data || !data.Search || data.Search.length === 0) {
    console.log("Using sample data for popular movies")
    return SAMPLE_MOVIES
  }

  return data.Search
}

// Fetch movies by genre (simulated with keyword searches)
export async function fetchMoviesByGenre(genre: string): Promise<Movie[]> {
  const data = await fetchFromOMDB(`&s=${genre}&type=movie`)

  if (!data || !data.Search || data.Search.length === 0) {
    console.log(`Using sample data for genre ${genre}`)
    return SAMPLE_MOVIES
  }

  return data.Search
}

// Fetch trending movies (simulated with recent popular movies)
export async function fetchTrending(): Promise<Movie[]> {
  // We'll use a search for recent popular movies to simulate trending
  const data = await fetchFromOMDB(`&s=2023&type=movie`)

  if (!data || !data.Search || data.Search.length === 0) {
    console.log("Using sample data for trending movies")
    return SAMPLE_MOVIES
  }

  return data.Search
}
