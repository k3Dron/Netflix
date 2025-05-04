'use client'
import { Play, Info } from "lucide-react"
import type { Movie } from "@/lib/omdb"

export default function Hero({ movie }: { movie?: Movie }) {
  // If no movie is provided, return a fallback hero
  if (!movie) {
    return (
      <div className="relative h-[80vh] w-full bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black"></div>
        <div className="relative h-full flex flex-col justify-center px-4 md:px-8 lg:px-16 z-10">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Welcome to Netflix</h1>
            <p className="text-sm md:text-base text-gray-300 mb-6">
              Discover the latest movies and TV shows. Watch anywhere. Cancel anytime.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="netflix-button flex items-center gap-2">
                <Play className="h-5 w-5" />
                <span>Browse Movies</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-[80vh] w-full">
      {/* Background Image */}
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
      <div className="relative h-full flex flex-col justify-center px-4 md:px-8 lg:px-16 z-10">
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{movie.Title}</h1>
          <div className="flex items-center space-x-4 mb-4">
            {movie.imdbRating && (
              <span className="text-green-500 font-semibold">{Number.parseFloat(movie.imdbRating) * 10}% Match</span>
            )}
            <span>{movie.Year}</span>
          </div>
          <p className="text-sm md:text-base text-gray-300 mb-6 line-clamp-3 md:line-clamp-4">
            {movie.Plot || "No plot description available."}
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="netflix-button flex items-center gap-2">
              <Play className="h-5 w-5" />
              <span>Play</span>
            </button>
            <button className="netflix-button-secondary flex items-center gap-2">
              <Info className="h-5 w-5" />
              <span>More Info</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
