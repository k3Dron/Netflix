import { fetchTrending, fetchMoviesByGenre, searchMovies, checkOMDBConnection, fetchPopularMovies } from "@/lib/omdb"
import Hero from "@/components/hero"
import MovieRow from "@/components/movie-row"
import SearchBar from "@/components/search-bar"
import ApiUnavailableNotice from "@/components/api-unavailable-notice"
import MovieCard from "@/components/movie-card"

export default async function Home({ searchParams }: { searchParams: { query?: string } }) {
  const query = searchParams.query || ""
  const apiAvailable = await checkOMDBConnection()

  // If there's a search query, show search results instead of the homepage content
  if (query) {
    const searchResults = await searchMovies(query)
    return (
      <main className="min-h-screen bg-black text-white pb-20">
        <div className="pt-20 px-4 md:px-8 lg:px-16">
          <SearchBar initialQuery={query} />

          {!apiAvailable && <ApiUnavailableNotice />}

          <h2 className="text-2xl font-bold mt-8 mb-4">Search Results for "{query}"</h2>
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {searchResults.map((movie) => (
                <MovieCard key={movie.imdbID} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl">No results found for "{query}"</p>
              <p className="text-gray-400 mt-2">Try searching for something else</p>
            </div>
          )}
        </div>
      </main>
    )
  }

  // Fetch data for homepage
  const trendingMovies = await fetchTrending()
  const actionMovies = await fetchMoviesByGenre("action")
  const comedyMovies = await fetchMoviesByGenre("comedy")
  const horrorMovies = await fetchMoviesByGenre("horror")
  const romanceMovies = await fetchMoviesByGenre("romance")
  const popularMovies = await fetchPopularMovies()

  // Get movie details for the featured movie
  const featuredMovie = trendingMovies && trendingMovies.length > 0 ? trendingMovies[0] : undefined

  return (
    <main className="min-h-screen bg-black text-white pb-20">
      <Hero movie={featuredMovie} />
      <div className="px-4 md:px-8 lg:px-16 -mt-16 relative z-10">
        <SearchBar />

        {!apiAvailable && <ApiUnavailableNotice />}

        {trendingMovies && trendingMovies.length > 0 && <MovieRow title="Trending Now" movies={trendingMovies} />}
        {popularMovies && popularMovies.length > 0 && <MovieRow title="Popular Movies" movies={popularMovies} />}
        {actionMovies && actionMovies.length > 0 && <MovieRow title="Action Movies" movies={actionMovies} />}
        {comedyMovies && comedyMovies.length > 0 && <MovieRow title="Comedies" movies={comedyMovies} />}
        {horrorMovies && horrorMovies.length > 0 && <MovieRow title="Horror" movies={horrorMovies} />}
        {romanceMovies && romanceMovies.length > 0 && <MovieRow title="Romance" movies={romanceMovies} />}
      </div>
    </main>
  )
}
