"use client"

import { useEffect, useRef, useState } from "react"
import { Play, X, Star, Calendar, Clock } from "lucide-react"
import type { Movie } from "@/lib/omdb"
import { fetchMovieDetails } from "@/lib/omdb"

interface MovieInfoPopupProps {
  movie: Movie
  onClose: () => void
  onPlay: () => void
}

export default function MovieInfoPopup({ movie, onClose, onPlay }: MovieInfoPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null)
  const [fullMovieDetails, setFullMovieDetails] = useState<Movie | null>(null)

  // Fetch full movie details if we don't have them
  useEffect(() => {
    const getDetails = async () => {
      if (!movie.Plot) {
        const details = await fetchMovieDetails(movie.imdbID)
        if (details) {
          setFullMovieDetails(details)
        }
      }
    }

    getDetails()
  }, [movie])

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  // Prevent body scrolling when popup is open
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [])

  const displayMovie = fullMovieDetails || movie

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div ref={popupRef} className="bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header with poster */}
        <div className="relative h-[200px] md:h-[300px]">
          {displayMovie.Poster && displayMovie.Poster !== "N/A" ? (
            <img
              src={displayMovie.Poster || "/placeholder.svg"}
              alt={displayMovie.Title}
              className="w-full h-full object-cover rounded-t-lg"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg?height=300&width=600"
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-b from-gray-800 to-black rounded-t-lg"></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 bg-black/50 p-2 rounded-full hover:bg-black/80 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-2">{displayMovie.Title}</h2>

          <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
            {displayMovie.Year && (
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{displayMovie.Year}</span>
              </div>
            )}
            {displayMovie.Runtime && displayMovie.Runtime !== "N/A" && (
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{displayMovie.Runtime}</span>
              </div>
            )}
            {displayMovie.imdbRating && displayMovie.imdbRating !== "N/A" && (
              <div className="flex items-center text-yellow-500">
                <Star className="h-4 w-4 mr-1 fill-yellow-500" />
                <span>{displayMovie.imdbRating}/10</span>
              </div>
            )}
          </div>

          <p className="text-gray-300 mb-6">{displayMovie.Plot || "No plot description available."}</p>

          {displayMovie.Genre && displayMovie.Genre !== "N/A" && (
            <div className="mb-4">
              <span className="text-gray-400">Genre: </span>
              <span>{displayMovie.Genre}</span>
            </div>
          )}

          {displayMovie.Director && displayMovie.Director !== "N/A" && (
            <div className="mb-4">
              <span className="text-gray-400">Director: </span>
              <span>{displayMovie.Director}</span>
            </div>
          )}

          {displayMovie.Actors && displayMovie.Actors !== "N/A" && (
            <div className="mb-6">
              <span className="text-gray-400">Cast: </span>
              <span>{displayMovie.Actors}</span>
            </div>
          )}

          <button onClick={onPlay} className="netflix-button flex items-center justify-center gap-2 w-full">
            <Play className="h-5 w-5" />
            <span>Play Sample Video</span>
          </button>
        </div>
      </div>
    </div>
  )
}
