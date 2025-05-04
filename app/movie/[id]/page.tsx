import { fetchMovieDetails } from "@/lib/omdb"
import { Play, Plus, ThumbsUp } from "lucide-react"
import Link from "next/link"

export default async function MoviePage({ params }: { params: { id: string } }) {
  const movieId = params.id
  const movie = await fetchMovieDetails(movieId)

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Movie not found</h1>
          <Link href="/" className="netflix-button">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white pb-20">
      {/* Hero Section with Backdrop */}
      <div className="relative h-[70vh] w-full">
        <div className="absolute inset-0">
          {movie.Poster && movie.Poster !== "N/A" ? (
            <img
              src={movie.Poster || "/placeholder.svg"}
              alt={movie.Title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg?height=800&width=1600"
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-b from-gray-800 to-black"></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col justify-end px-4 md:px-8 lg:px-16 py-12 z-10">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">{movie.Title}</h1>
            <div className="flex items-center space-x-4 mb-4">
              {movie.imdbRating && (
                <span className="text-green-500 font-semibold">{Number.parseFloat(movie.imdbRating) * 10}% Match</span>
              )}
              <span>{movie.Year}</span>
              {movie.Runtime && <span>{movie.Runtime}</span>}
            </div>
            <div className="flex flex-wrap gap-4 mb-6">
              <button className="netflix-button flex items-center gap-2">
                <Play className="h-5 w-5" />
                <span>Play</span>
              </button>
              <button className="netflix-button-secondary flex items-center gap-2">
                <Plus className="h-5 w-5" />
                <span>My List</span>
              </button>
              <button className="netflix-button-secondary flex items-center gap-2">
                <ThumbsUp className="h-5 w-5" />
                <span>Rate</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Movie Details */}
      <div className="px-4 md:px-8 lg:px-16 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Overview</h2>
            <p className="text-gray-300 mb-6">{movie.Plot || "No plot description available."}</p>

            {movie.Director && movie.Director !== "N/A" && (
              <p className="text-gray-300 mb-2">
                <span className="text-gray-400">Director: </span>
                {movie.Director}
              </p>
            )}

            {movie.Actors && movie.Actors !== "N/A" && (
              <p className="text-gray-300 mb-2">
                <span className="text-gray-400">Cast: </span>
                {movie.Actors}
              </p>
            )}
          </div>
          <div>
            <div className="bg-gray-900 p-6 rounded-md">
              <h3 className="text-lg font-semibold mb-4">Movie Info</h3>
              <div className="space-y-3">
                {movie.Released && movie.Released !== "N/A" && (
                  <div>
                    <span className="text-gray-400">Release Date: </span>
                    <span>{movie.Released}</span>
                  </div>
                )}
                {movie.imdbRating && movie.imdbRating !== "N/A" && (
                  <div>
                    <span className="text-gray-400">Rating: </span>
                    <span>{movie.imdbRating}/10</span>
                  </div>
                )}
                {movie.Genre && movie.Genre !== "N/A" && (
                  <div>
                    <span className="text-gray-400">Genre: </span>
                    <span>{movie.Genre}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
