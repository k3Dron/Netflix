"use client"

import { useState, useRef } from "react"
import type { Movie } from "@/lib/omdb"
import MovieInfoPopup from "./movie-info-popup"
import VideoPlayer from "./video-player"

export default function MovieCard({ movie }: { movie: Movie }) {
  const [showPopup, setShowPopup] = useState(false)
  const [playVideo, setPlayVideo] = useState(false)
  const clickTimer = useRef<NodeJS.Timeout | null>(null)
  const clickCount = useRef(0)

  const handleClick = () => {
    console.log("MovieCard clicked")
    clickCount.current += 1

    if (clickCount.current === 1) {
      // Single click
      clickTimer.current = setTimeout(() => {
        if (clickCount.current === 1) {
          // It's a single click
          setShowPopup(true)
        }
        clickCount.current = 0
      }, 300) // 300ms delay to detect double click
    } else if (clickCount.current === 2) {
      // Double click
      if (clickTimer.current) {
        clearTimeout(clickTimer.current)
      }
      clickCount.current = 0
      setPlayVideo(true)
    }
  }

  return (
    <>
      <div
        className="relative min-w-[150px] md:min-w-[180px] h-[225px] md:h-[270px] cursor-pointer transition duration-200 ease-out hover:scale-105"
        onClick={handleClick}
      >
        {movie.Poster && movie.Poster !== "N/A" ? (
          <img
            src={movie.Poster || "/placeholder.svg"}
            alt={movie.Title}
            className="rounded-sm object-cover w-full h-full"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg?height=270&width=180"
            }}
          />
        ) : (
          <div className="rounded-sm w-full h-full bg-gray-800 flex items-center justify-center">
            <p className="text-center p-2 text-sm">{movie.Title}</p>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2 opacity-0 hover:opacity-100 transition-opacity duration-300">
          <h3 className="text-sm font-semibold truncate">{movie.Title}</h3>
          <p className="text-xs text-gray-300">{movie.Year}</p>
        </div>
      </div>

      {/* Movie Info Popup */}
      {showPopup && (
        <MovieInfoPopup
          movie={movie}
          onClose={() => setShowPopup(false)}
          onPlay={() => {
            setShowPopup(false)
            setPlayVideo(true)
          }}
        />
      )}

      {/* Video Player */}
      {playVideo && <VideoPlayer movie={movie} onClose={() => setPlayVideo(false)} />}
    </>
  )
}
